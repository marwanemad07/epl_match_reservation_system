const { Prisma: prisma } = require("../../lib/db");
require("dotenv").config();

exports.createStadium = async (body) => {
  try {
    // check if stadium already exists
    const stadiumExists = await prisma.stadium.findFirst({
      where: {
        name: body.name,
      },
    });

    if (stadiumExists) {
      return { statusCode: 400, message: "Stadium already exists" };
    }

    const stadium = await prisma.stadium.create({
      data: body,
    });

    await createSeats(stadium.id, body.rows, body.seatsPerRow);

    return { statusCode: 201, data: stadium };
  } catch (err) {
    if (process.env._ENV === "dev") {
      throw err;
    }
    return { statusCode: 500, message: "Internal server error" };
  }
};

const createSeats = async (stadiumId, rows, seatsPerRow) => {
  const seats = [];
  for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= seatsPerRow; j++) {
      seats.push({
        stadiumId: stadiumId,
        row: i,
        seatNumber: j,
      });
    }
  }

  try {
    await prisma.seat.createMany({
      data: seats,
    });
  } catch (err) {
    if (process.env._ENV === "dev") {
      throw err;
    }
    return { statusCode: 500, message: "Internal server error" };
  }
};

exports.createMatch = async (body) => {
  try {
    // validate if stadium exists
    const stadiumExists = await prisma.stadium.findFirst({
      where: {
        id: body.stadiumId,
      },
    });

    if (!stadiumExists) {
      return { statusCode: 400, message: "Stadium does not exist" };
    }

    // validate if home team exists
    const homeTeamExists = await prisma.team.findFirst({
      where: {
        id: body.homeTeamId,
      },
    });

    if (!homeTeamExists) {
      return { statusCode: 400, message: "Home team does not exist" };
    }

    // validate if away team exists
    const awayTeamExists = await prisma.team.findFirst({
      where: {
        id: body.awayTeamId,
      },
    });

    if (!awayTeamExists) {
      return { statusCode: 400, message: "Away team does not exist" };
    }

    // validate if main referee exists
    const mainRefereeExists = await prisma.referee.findFirst({
      where: {
        id: body.mainRefereeId,
      },
    });

    if (!mainRefereeExists) {
      return { statusCode: 400, message: "Main referee does not exist" };
    }

    // validate if linesman 1 exists
    const linesman1Exists = await prisma.referee.findFirst({
      where: {
        id: body.linesman1Id,
      },
    });

    if (!linesman1Exists) {
      return { statusCode: 400, message: "Linesman 1 does not exist" };
    }

    // validate if linesman 2 exists
    const linesman2Exists = await prisma.referee.findFirst({
      where: {
        id: body.linesman2Id,
      },
    });

    if (!linesman2Exists) {
      return { statusCode: 400, message: "Linesman 2 does not exist" };
    }

    // validate if there is a match on the same day on the same stadium
    // check on day not datetime
    nextDay = new Date(
      new Date(body.matchDate).setDate(new Date(body.matchDate).getDate() + 1)
    )
    
    const matchExists = await prisma.match.findFirst({
      where: {
        matchDate: {
          gte: new Date(body.matchDate),
          lt: nextDay,
        },
        stadiumId: body.stadiumId,
      },
    });

    if (matchExists) {
      return {
        statusCode: 400,
        message: "Match already exists on the same day",
      };
    }

    // check if date is in the past
    if (new Date(body.matchDate) < new Date()) {
      return {
        statusCode: 400,
        message: "Match date is in the past",
      };
    }

    const match = await prisma.match.create({
      data: {
        matchDate: new Date(body.matchDate),
        homeTeam: {
          connect: {
            id: body.homeTeamId,
          },
        },
        awayTeam: {
          connect: {
            id: body.awayTeamId,
          },
        },
        stadium: {
          connect: {
            id: body.stadiumId,
          },
        },
        mainReferee: {
          connect: {
            id: body.mainRefereeId,
          },
        },
        linesMan1: {
          connect: {
            id: body.linesman1Id,
          },
        },
        linesMan2: {
          connect: {
            id: body.linesman2Id,
          },
        },
      },
    });

    return { statusCode: 201, data: match };
  } catch (err) {
    if (process.env._ENV === "dev") {
      throw err;
    }
    return { statusCode: 500, message: "Internal server error" };
  }
};
