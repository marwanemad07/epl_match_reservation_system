const express = require("express");
const managerController = require("../controllers/manager.controller");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { createStadiumValidation } = require("../validators/manager.validator");
const handleValidationErrors = require("../middleware/validationMiddleware");

const router = express.Router();

const role = "MANAGER";

router.post(
  "/create-stadium",
  authMiddleware,
  roleMiddleware(role),
  createStadiumValidation,
  handleValidationErrors,
  managerController.createStadium
);

module.exports = router;
