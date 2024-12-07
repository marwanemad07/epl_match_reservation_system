const managerService = require('../services/manager.service');
const development = process.env._ENV == "dev";

exports.createStadium = async (req, res) => {
  try {
    const data = req.body;
    const response = await managerService.createStadium(data);
    const statusCode = response.statusCode || 201;
    res.status(statusCode).json(response);
  } catch (err) {
    const message = development ? err.message : "Internal server error";
    const statusCode = err.status || 500;
    res.status(statusCode).json({ message: message });
  }
};
