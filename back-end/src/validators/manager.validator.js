const { body } = require("express-validator");

exports.createStadiumValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("rows").isInt({ min: 1 }).withMessage("Rows must be an integer greater than 0"),
  body("seatsPerRow").isInt({ min: 1 }).withMessage("Seats per row must be an integer greater than 0"),
];