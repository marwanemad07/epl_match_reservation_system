const adminService = require("../services/admin.service");
const seed = require("../../prisma/seed");

const development = process.env._ENV == "dev";

exports.getUnapprovedUsers = async (req, res) => {
  try {
    const response = await adminService.getUnapprovedUsers();
    const statusCode = response.statusCode || 200;
    res.status(statusCode).json(response);
  } catch (err) {
    const message = development ? err.message : "Internal server error";
    const statusCode = err.status || 500;
    res.status(statusCode).json({ message: message });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const userId = req.query.id;
    if (!userId) {
      throw { status: 400, message: "User ID is required" };
    }

    const response = await adminService.approveUser(userId);
    console.log(response);
    const statusCode = response.statusCode || 204;
    return res.status(statusCode).json({ message: response.message });
  } catch (err) {
    const message = development ? err.message : "Internal server error";
    const statusCode = err.status || 500;
    return res.status(statusCode).json({ message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.query.id;
    if (!userId) {
      throw { status: 400, message: "User ID is required" };
    }

    const response = await adminService.deleteUser(userId);
    const statusCode = response.statusCode || 200;
    res.status(statusCode).json(response);
  } catch (err) {
    const message = development ? err.message : "Internal server error";
    const statusCode = err.status || 500;
    res.status(statusCode).json({ message: message });
  }
};

exports.seedTeams = async (req, res) => {
  try {
    const response = await seed.seedTeams();
    const statusCode = response.statusCode || 201;
    res.status(statusCode).json(response);
  } catch (err) {
    const message = development ? err.message : "Internal server error";
    const statusCode = err.status || 500;
    res.status(statusCode).json({ message: message });
  }
};
