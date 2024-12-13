const { Prisma: prisma } = require("../../lib/db");
require("dotenv").config();

exports.getAllMatches = async () => {
  try {
    const matches = await prisma.match.findMany({
      include: {
        homeTeam: true,
        awayTeam: true,
        mainReferee: true,
        linesMan1: true,
        linesMan2: true,
        stadium: true,
      },
    });

    return { statusCode: 200, data: matches };
  } catch (err) {
    if (process.env._ENV === "dev") {
      throw err;
    }
    return { statusCode: 500, message: "Internal server error" };
  }
};
