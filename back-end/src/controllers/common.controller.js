const commonService = require("../services/common.service");

const development = process.env._ENV == "dev";

exports.getMatchDetails = async (req, res) => {
  try {
    const matchId = req.params.id;
    if (!matchId) {
      throw { status: 400, message: "Match ID is required" };
    }

    if (isNaN(matchId)) {
      throw { status: 400, message: "Match ID must be a number" };
    }

    const response = await commonService.getMatchDetails(parseInt(matchId), req.userToken.userId);
    const statusCode = response.statusCode || 200;
    res.status(statusCode).json(response);
  } catch (err) {
    const message = development ? err.message : "Internal server error";
    const statusCode = err.status || 500;
    res.status(statusCode).json({ message: message });
  }
}