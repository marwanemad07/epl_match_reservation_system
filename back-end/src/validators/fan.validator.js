const { body, query, param } = require("express-validator");

exports.openSessionValidation = [
  body("matchId")
    .isInt({ min: 1 })
    .withMessage("Match ID must be an integer greater than 0"),
];

exports.closeSessionValidation = [
  query("sessionId")
    .exists()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Session ID is required")
    .isUUID()
    .withMessage("Invalid session ID"),
];

exports.reserveSeatValidation = [
  body("seatId")
    .isInt({ min: 1 })
    .withMessage("Seat ID must be an integer greater than 0"),
  body("sessionId").trim().isUUID().withMessage("Invalid session ID"),
];

exports.completeReservationValidation = [
  body("sessionId").trim().isUUID().withMessage("Invalid session ID"),
];
