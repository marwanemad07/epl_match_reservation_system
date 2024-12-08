const fanService = require("../services/fan.service");
const development = process.env._ENV == "dev";

exports.openSession = async (req, res) => {
  try {
    const data = req.body;
    const response = await fanService.openSession({
      ...data,
      userId: req.userToken.userId,
    });
    const statusCode = response.statusCode || 201;
    res.status(statusCode).json(response);
  } catch (err) {
    const message = development ? err.message : "Internal server error";
    const statusCode = err.status || 500;
    res.status(statusCode).json({ message: message });
  }
};

exports.closeSession = async (req, res) => {
  try {
    const response = await fanService.closeSession(req.query.sessionId);
    const statusCode = response.statusCode || 200;
    res.status(statusCode).json(response);
  } catch (err) {
    const message = development ? err.message : "Internal server error";
    const statusCode = err.status || 500;
    res.status(statusCode).json({ message: message });
  }
};