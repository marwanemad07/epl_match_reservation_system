const { Prisma: prisma } = require("../../lib/db");
const fanService = require("./fan.service");
require("dotenv").config();

exports.getMatchDetails = async (matchId, userId) => {
  try {
    const match = await prisma.match.findUnique({
      where: {
        id: matchId,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        mainReferee: true,
        linesMan1: true,
        linesMan2: true,
        stadium: true,
      },
    });

    if (!match) {
      return { statusCode: 404, message: "Match not found" };
    }

    // get user reservation session
    const existingSession = await prisma.reservationSession.findFirst({
      where: {
        userId: userId,
        matchId: matchId,
        isActive: true,
      },
    });

    if (existingSession) {
      if (existingSession.expiresAt <= new Date()) {
        await fanService.clearBookedSeats(existingSession.id);
      }
    }

    // get seats
    const seats = await this.getMatchSeats(match);
    match.seats = seats;

    return { statusCode: 200, data: match };
  } catch (err) {
    if (process.env._ENV === "dev") {
      throw err;
    }
    return { statusCode: 500, message: "Internal server error" };
  }
};

exports.getMatchSeats = async (match) => {
  try {
    const seats = await prisma.seat.findMany({
      where: {
        stadiumId: match.stadiumId,
      },
      include: {
        reservations: {
          where: {
            matchId: match.id,
          },
        },
      },
    });

    return seats;
  } catch (error) {
    throw error;
  }
};
