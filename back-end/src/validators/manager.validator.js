const { body } = require("express-validator");

exports.createStadiumValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("rows")
    .isInt({ min: 1 })
    .withMessage("Rows must be an integer greater than 0"),
  body("seatsPerRow")
    .isInt({ min: 1 })
    .withMessage("Seats per row must be an integer greater than 0"),
];

exports.createMatchValidation = [
  body("matchDate")
    .isISO8601()
    .withMessage("Invalid date format")
    .toDate()
    .custom((value, { req }) => {
      if (value <= new Date()) {
        throw new Error("Match date must be in the future");
      }
      return value;
    }),
  body("homeTeamId")
    .isInt({ min: 1 })
    .withMessage("Home team ID must be an integer greater than 0"),
  // can't have the same team as home team and away team
  body("awayTeamId")
    .isInt({ min: 1 })
    .withMessage("Away team ID must be an integer greater than 0")
    .custom((value, { req }) => {
      if (value === req.body.homeTeamId) {
        throw new Error("Away team cannot be the same as home team");
      }
      return value;
    }),
  body("stadiumId")
    .isInt({ min: 1 })
    .withMessage("Stadium ID must be an integer greater than 0"),
  body("mainRefereeId")
    .isInt({ min: 1 })
    .withMessage("Main referee ID must be an integer greater than 0"),
  // can't have the same referee as main referee
  body("linesman1Id")
    .isInt({ min: 1 })
    .withMessage("Linesman 1 ID must be an integer greater than 0")
    .custom((value, { req }) => {
      if (value === req.body.mainRefereeId) {
        throw new Error("Linesman 1 cannot be the same as main referee");
      }
      return value;
    }),
  // can't have the same referee as linesman 1 and linesman 2
  body("linesman2Id")
    .isInt({ min: 1 })
    .withMessage("Linesman 2 ID must be an integer greater than 0")
    .custom((value, { req }) => {
      if (value === req.body.linesman1Id) {
        throw new Error("Linesman 2 cannot be the same as linesman 1");
      }
      if (value === req.body.mainRefereeId) {
        throw new Error("Linesman 2 cannot be the same as main referee");
      }
      return value;
    }),
];
