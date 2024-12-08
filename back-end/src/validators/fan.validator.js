const { body, query } = require("express-validator");

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
