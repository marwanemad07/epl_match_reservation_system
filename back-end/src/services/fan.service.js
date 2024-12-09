const { Prisma: prisma } = require("../../lib/db");
const schedule = require("node-schedule");
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
        await clearBookedSeats(activeSession.id);
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
        await clearBookedSeats(existingSession.id);
      }
    }

    // set session end time to end after 7 mins
    const expiresAt = new Date(new Date().getTime() + 7 * 60 * 1000);

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
      // check if the session is still active
      const oldSession = await prisma.reservationSession.findFirst({
        where: {
          id: session.id,
          isActive: true,
        },
      });

      if (oldSession) {
        await clearBookedSeats(oldSession.id);
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

    await clearBookedSeats(sessionId);

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
      await clearBookedSeats(data.sessionId);
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

    console.log(session)

    return prisma.$transaction(async () => {
      // check if the seat is reserved
      const existingReservation = await prisma.reservation.findUnique({
        where: {
          "matchId_seatId": {
            matchId: session.match.id,
            seatId: data.seatId,
          }
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
      });

      return { statusCode: 201, data: reservation };
    });
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

clearBookedSeats = async (sessionId) => {
  try {
    prisma.$transaction([
      // delete all reservations for the session
      prisma.reservation.deleteMany({
        where: {
          sessionId: sessionId,
        },
      }),

      // set the session to inactive
      prisma.reservationSession.update({
        where: {
          id: sessionId,
        },
        data: {
          isActive: false,
        },
      }),
    ]);

    // send to users on sockets the new seats

    return { statusCode: 200, message: "Session cleared" };
  } catch (err) {
    if (process.env._ENV === "dev") {
      throw err;
    }

    return { statusCode: 500, message: "Internal server error" };
  }
};
