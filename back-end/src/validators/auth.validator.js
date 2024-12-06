const { body } = require("express-validator");

exports.registerValidation = [
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),
    body("password")
        .trim()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
    body("username")
        .trim()
        .isLength({ min: 4 })
        .withMessage("Username must be at least 4 characters long"),
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("birthDate")
        .isISO8601()
        .withMessage("Please enter a valid birth date")
        .toDate(),
    body("gender")
        .toUpperCase()
        .isIn(["MALE", "FEMALE"])
        .withMessage("Please select a valid gender"),
    body("city").trim().notEmpty().withMessage("City is required"),
    body("address").optional().trim(),
    body("role")
        .isIn(["FAN", "MANAGER"])
        .withMessage("Please select a valid role"),
    body("isVerified")
        .not()
        .exists()
        .withMessage("This variable is not allowed"),
];

exports.loginValidation = [
    body("username")
        .trim()
        .isLength({ min: 4 })
        .withMessage("Username must be at least 4 characters long"),
    body("password")
        .trim()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
];
