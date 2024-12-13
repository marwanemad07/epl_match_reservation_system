const { Prisma: prisma } = require("../../lib/db");
const commonService = require("./common.service");
const { MAX_SESSION_TIME_IN_SECONDS } = require("../../lib/constants");
const schedule = require("node-schedule");
const server = require("../server");
require("dotenv").config();

exports.openSession = async (data) => {
  try {
    //check if match exists
    const match = await prisma.match.findUnique({
      where: {
        id: data.matchId,
      },
    });

    if (!match) {
      return { statusCode: 404, message: "Match not found" };
    }

    // check if user has another active session for another match
    const activeSession = await prisma.reservationSession.findFirst({
      where: {
        userId: data.userId,
        isActive: true,
        matchId: {
          not: data.matchId,
        },
      },
    });

    if (activeSession) {
      if (activeSession.expiresAt > new Date()) {
        return {
          statusCode: 400,
          message: "User has an active session for another match",
        };
      } else {
        await this.clearBookedSeats(activeSession.id);
      }
    }

    // check if user has already opened a session for this match
    const existingSession = await prisma.reservationSession.findFirst({
      where: {
        userId: data.userId,
        matchId: data.matchId,
        isActive: true,
      },
    });

    if (existingSession) {
      if (existingSession.expiresAt > new Date()) {
        // return the existing session id
        return { statusCode: 200, data: existingSession };
      } else {
        // session has expired
        await this.clearBookedSeats(existingSession.id);
      }
    }

    // set session end time to end after 7 mins
    const expiresAt = new Date(
      new Date().getTime() + MAX_SESSION_TIME_IN_SECONDS * 1000
    );

    // create the session
    const session = await prisma.reservationSession.create({
      data: {
        user: {
          connect: {
            id: data.userId,
          },
        },
        match: {
          connect: {
            id: data.matchId,
          },
        },
        isActive: true,
        expiresAt: expiresAt,
      },
    });

    // schedule the session to end after 7 mins
    schedule.scheduleJob(expiresAt, async () => {
      try {
        // check if the session is still active
        const oldSession = await prisma.reservationSession.findFirst({
          where: {
            id: session.id,
            isActive: true,
          },
        });
  
        if (oldSession) {
          await this.clearBookedSeats(oldSession.id);
        }
      } catch (error) {
        console.log(error)
      }
    });

    return { statusCode: 201, data: session };
  } catch (err) {
    if (process.env._ENV === "dev") {
      throw err;
    }
    return { statusCode: 500, message: "Internal server error" };
  }
};

exports.closeSession = async (sessionId) => {
  try {
    const session = await prisma.reservationSession.findUnique({
      where: {
        id: sessionId,
        isActive: true,
      },
    });

    if (!session) {
      return { statusCode: 404, message: "Session not found" };
    }

    await this.clearBookedSeats(sessionId);

    return { statusCode: 200, message: "Session closed" };
  } catch (err) {
    if (process.env._ENV === "dev") {
      throw err;
    }
    return { statusCode: 500, message: "Internal server error" };
  }
};

exports.reserveSeat = async (data) => {
  try {
    // check if session is active
    const session = await prisma.reservationSession.findFirst({
      where: {
        id: data.sessionId,
        isActive: true,
      },
      include: {
        match: true,
        user: true,
      },
    });

    if (!session) {
      return { statusCode: 404, message: "Session not found" };
    }

    if (session.user.id !== data.userId) {
      return { statusCode: 403, message: "Unauthorized" };
    }

    if (session.expiresAt < new Date()) {
      await this.clearBookedSeats(data.sessionId);
      return { statusCode: 400, message: "Session expired" };
    }

    // check if seat is available in stadium
    const seat = await prisma.seat.findUnique({
      where: {
        id: data.seatId,
      },
    });

    if (!seat) {
      return { statusCode: 404, message: "Seat not found" };
    }

    console.log(session);

    return prisma.$transaction(
      async () => {
        // check if the seat is reserved
        const existingReservation = await prisma.reservation.findUnique({
          where: {
            matchId_seatId: {
              matchId: session.match.id,
              seatId: data.seatId,
            },
          },
        });

        if (existingReservation) {
          throw new Error("Seat already reserved");
        }

        // reserve the seat
        const reservation = await prisma.reservation.create({
          data: {
            user: {
              connect: {
                id: session.user.id,
              },
            },
            seat: {
              connect: {
                id: data.seatId,
              },
            },
            match: {
              connect: {
                id: session.match.id,
              },
            },
            session: {
              connect: {
                id: data.sessionId,
              },
            },
          },
          select: {
            seat: true,
            match: true,
            session: true,
          },
        });

        server.io.emit(session.match.id, {
          type: "SEAT_RESERVED",
          data: {
            seatId: data.seatId,
            matchId: session.match.id,
            seats: await commonService.getMatchSeats(session.match),
          },
        });

        return { statusCode: 201, data: reservation };
      },
      {
        maxWait: 5000,
        timeout: 20000,
      }
    );
  } catch (err) {
    if (process.env._ENV === "dev") {
      throw err;
    }

    if (err.message === "Seat already reserved") {
      return { statusCode: 400, message: "Seat already reserved" };
    }

    return { statusCode: 500, message: "Internal server error" };
  }
};

exports.cancelSeatReservation = async (data) => {
  try {
    // check if session is active
    const session = await prisma.reservationSession.findFirst({
      where: {
        id: data.sessionId,
        isActive: true,
      },
      include: {
        match: true,
        user: true,
      },
    });

    if (!session) {
      return { statusCode: 404, message: "Session not found" };
    }

    if (session.user.id !== data.userId) {
      return { statusCode: 403, message: "Unauthorized" };
    }

    if (session.expiresAt < new Date()) {
      await this.clearBookedSeats(data.sessionId);
      return { statusCode: 400, message: "Session expired" };
    }

    return prisma.$transaction(
      async () => {
        // check if the seat is reserved
        const existingReservation = await prisma.reservation.findUnique({
          where: {
            matchId_seatId: {
              matchId: session.match.id,
              seatId: data.seatId,
            },
          },
        });

        if (!existingReservation) {
          throw new Error("Seat not reserved");
        }

        // check if the reservation is for the current session
        if (existingReservation.sessionId !== data.sessionId) {
          throw new Error("Seat reserved in another session");
        }

        // cancel the reservation
        await prisma.reservation.delete({
          where: {
            id: existingReservation.id,
          },
          select: {
            seat: true,
            match: true,
            session: true,
          },
        });

        server.io.emit(session.match.id, {
          type: "SEAT_CANCELLED",
          data: {
            seatId: data.seatId,
            matchId: session.match.id,
            seats: await commonService.getMatchSeats(session.match),
          },
        });

        return { statusCode: 200, message: "Reservation cancelled" };
      },
      {
        maxWait: 5000,
        timeout: 20000,
      }
    );
  } catch (err) {
    if (process.env._ENV === "dev") {
      throw err;
    }

    if (err.message === "Seat not reserved") {
      return { statusCode: 400, message: "Seat not reserved" };
    }

    return { statusCode: 500, message: "Internal server error" };
  }
};

exports.completeReservation = async (data) => {
  try {
    // check if session is active
    const session = await prisma.reservationSession.findFirst({
      where: {
        id: data.sessionId,
        isActive: true,
      },
      include: {
        match: true,
        user: true,
      },
    });

    if (!session) {
      return { statusCode: 404, message: "Session not found" };
    }

    if (session.user.id !== data.userId) {
      return { statusCode: 403, message: "Unauthorized" };
    }

    if (session.expiresAt < new Date()) {
      await this.clearBookedSeats(data.sessionId);
      return { statusCode: 400, message: "Session expired" };
    }

    return prisma.$transaction(
      async () => {
        // check if the user has any reservations
        const reservations = await prisma.reservation.findMany({
          where: {
            userId: data.userId,
            sessionId: data.sessionId,
          },
          select: {
            seat: true,
            match: true,
            session: true,
          },
        });

        if (reservations.length === 0) {
          throw new Error("No reservations found");
        }

        // update all reservations status for the session and add reservedAt time 
        await prisma.reservation.updateMany({
          where: {
            userId: data.userId,
            sessionId: data.sessionId,
          },
          data: {
            status: "CONFIRMED",
            reservedAt: new Date(),
          },
        });

        // set the session to inactive
        await prisma.reservationSession.update({
          where: {
            id: data.sessionId,
          },
          data: {
            isActive: false,
          },
        });

        server.io.emit(session.match.id, {
          type: "SESSION_EXPIRED",
          data: {
            matchId: session.match.id,
            sessionId: data.sessionId,
            seats: await commonService.getMatchSeats(session.match),
          },
        });

        return { statusCode: 200, message: "Reservation completed" };
      },
      {
        maxWait: 5000,
        timeout: 20000,
      }
    );
  } catch (err) {
    if (process.env._ENV === "dev") {
      throw err;
    }

    if (err.message === "No reservations found") {
      return { statusCode: 400, message: "No reservations found" };
    }

    return { statusCode: 500, message: "Internal server error" };
  }
}

exports.clearBookedSeats = async (sessionId) => {
  const clearSeats = async (sessionId) => {
    const session = await prisma.reservationSession.findUnique({
      where: {
        id: sessionId,
      },
      select: {
        match: true,
      },
    });

    if (!session) {
      return { statusCode: 404, message: "Session not found" };
    }

    const matchId = session.match.id;

    // delete all reservations for the session
    await prisma.reservation.deleteMany({
      where: {
        sessionId: sessionId,
      },
    });

    // set the session to inactive
    await prisma.reservationSession.update({
      where: {
        id: sessionId,
      },
      data: {
        isActive: false,
      },
    });

    if (matchId !== 0) {
      server.io.emit(matchId, {
        type: "SESSION_EXPIRED",
        data: {
          matchId: matchId,
          sessionId: sessionId,
          seats: await commonService.getMatchSeats(session.match),
        },
      });
    }
    return { statusCode: 200, message: "Session cleared" };
  };

  try {
    return prisma.$transaction(async () => clearSeats(sessionId), {
      maxWait: 20000,
      timeout: 30000,
    });
  } catch (err) {
    return { statusCode: 500, message: "Internal server error" };
  }
};

exports.getReservations = async (userId) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        userId: userId,
      },
      include: {
        seat: true,
        match: true,
        session: true,
      },
    });

    // group reservations by sessionId and concat seats together
    const groupedReservations = reservations.reduce((acc, reservation) => {
      if (!acc[reservation.sessionId]) {
        acc[reservation.sessionId] = {
          session: reservation.session,
          match: reservation.match,
          seats: [],
        };
      }

      acc[reservation.sessionId].seats.push(reservation.seat);

      return acc;
    }, {});

    // convert object to array
    const groupedReservationsArray = Object.keys(groupedReservations).map(
      (sessionId) => groupedReservations[sessionId]
    );


    return { statusCode: 200, data: groupedReservationsArray };
  } catch (err) {
    if (process.env._ENV === "dev") {
      throw err;
    }
    return { statusCode: 500, message: "Internal server error" };
  }
}

exports.deleteReservation = async (userId, sessionId) => {
  try {
    console.log(sessionId)
    // check if session is available
    const session = await prisma.reservationSession.findFirst({
      where: {
        id: sessionId,
      },
      select: {
        match: true,
      }
    });

    if (!session) {
      return { statusCode: 404, message: "Session not found" };
    }

    // check if user has any reservations for the session
    const reservations = await prisma.reservation.findMany({
      where: {
        userId: userId,
        sessionId: sessionId,
      },
      select:{
        id: true,
        match: true,
      }
    });

    if (reservations.length === 0) {
      return { statusCode: 404, message: "No reservations found" };
    }

    // check if match date is after more than 3 days
    if (new Date(reservations[0].match.matchDate) < new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)) {
      return { statusCode: 400, message: "Cannot cancel reservation for match starting in less than 3 days" };
    }

    // delete all reservations for the session
    await prisma.reservation.deleteMany({
      where: {
        userId: userId,
        sessionId: sessionId,
      },
    });

    server.io.emit(session.match.id, {
      type: "SEAT_CANCELLED",
      data: {
        matchId: session.match.id,
        seats: await commonService.getMatchSeats(session.match),
      },
    });

    return { statusCode: 200, message: "Reservations deleted" };
  }
  catch (err) {
    if (process.env._ENV === "dev") {
      throw err;
    }
    return { statusCode: 500, message: "Internal server error" };
  }
}

