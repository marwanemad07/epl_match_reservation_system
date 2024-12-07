const publicService = require("../services/public.service");
const seed = require("../../prisma/seed");

const development = process.env._ENV == "dev";

exports.getAllMatches = async (req, res) => {
  try {
    const response = await publicService.getAllMatches();
    const statusCode = response.statusCode || 200;
    res.status(statusCode).json(response);
  } catch (err) {
    const message = development ? err.message : "Internal server error";
    const statusCode = err.status || 500;
    res.status(statusCode).json({ message: message });
  }
};

exports.getMatchDetails = async (req, res) => {
  try {
    const matchId = req.params.id;
    if (!matchId) {
      throw { status: 400, message: "Match ID is required" };
    }

    if (isNaN(matchId)) {
      throw { status: 400, message: "Match ID must be a number" };
    }

    const response = await publicService.getMatchDetails(parseInt(matchId));
    const statusCode = response.statusCode || 200;
    res.status(statusCode).json(response);
  } catch (err) {
    const message = development ? err.message : "Internal server error";
    const statusCode = err.status || 500;
    res.status(statusCode).json({ message: message });
  }
}
