const express = require("express");
const managerController = require("../controllers/manager.controller");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { createStadiumValidation, createMatchValidation } = require("../validators/manager.validator");
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

router.post(
  "/create-match",
  authMiddleware,
  roleMiddleware(role),
  createMatchValidation,
  handleValidationErrors,
  managerController.createMatch
);

module.exports = router;
