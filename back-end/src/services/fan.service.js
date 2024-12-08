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
    const expiresAt = new Date(new Date().getTime() + 1 * 60 * 1000);

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
}

clearBookedSeats = async (sessionId) => {
  try {
    // delete all reservations for the session
    await prisma.reservation.deleteMany({
      where: {
        sessionId: sessionId,
      },
    });

    // clear the session
    await prisma.reservationSession.update({
      where: {
        id: sessionId,
      },
      data: {
        isActive: false,
      },
    });

    // send to users on sockets the new seats

    return { statusCode: 200, message: "Session cleared" };
  } catch (err) {
    if (process.env._ENV === "dev") {
      throw err;
    }
  }
};
