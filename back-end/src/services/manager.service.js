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
}

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
}