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

exports.reserveSeat = async (req, res) => {
  try {
    const data = req.body;
    const response = await fanService.reserveSeat({
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

exports.cancelSeatReservation = async (req, res) => {
  try {
    const data = req.body;
    const response = await fanService.cancelSeatReservation({
      ...data,
      userId: req.userToken.userId,
    });
    const statusCode = response.statusCode || 200;
    res.status(statusCode).json(response);
  } catch (err) {
    const message = development ? err.message : "Internal server error";
    const statusCode = err.status || 500;
    res.status(statusCode).json({ message: message });
  }
};

exports.completeReservation = async (req, res) => {
  try {
    const data = req.body;
    const response = await fanService.completeReservation({
      ...data,
      userId: req.userToken.userId,
    });
    const statusCode = response.statusCode || 200;
    res.status(statusCode).json(response);
  } catch (err) {
    const message = development ? err.message : "Internal server error";
    const statusCode = err.status || 500;
    res.status(statusCode).json({ message: message });
  }
}

exports.getReservations = async (req, res) => {
  try {
    const response = await fanService.getReservations(req.userToken.userId);
    const statusCode = response.statusCode || 200;
    res.status(statusCode).json(response);
  } catch (err) {
    const message = development ? err.message : "Internal server error";
    const statusCode = err.status || 500;
    res.status(statusCode).json({ message: message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const sessionId = req.query.sessionId;
    if (!sessionId) {
      throw { status: 400, message: "Session ID is required" };
    }

    const response = await fanService.deleteReservation(req.userToken.userId, sessionId);
    const statusCode = response.statusCode || 200;
    res.status(statusCode).json(response);
  } catch (err) {
    const message = development ? err.message : "Internal server error";
    const statusCode = err.status || 500;
    res.status(statusCode).json({ message: message });
  }
}