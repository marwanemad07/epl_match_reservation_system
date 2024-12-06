const express = require("express");
const authController = require("../controllers/auth.controller");
const {
    registerValidation,
    loginValidation,
} = require("../validators/auth.validator");
const handleValidationErrors = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
    "/register",
    registerValidation,
    handleValidationErrors,
    authController.registerUser
);

router.post(
    "/login",
    loginValidation,
    handleValidationErrors,
    authController.loginUser
);

module.exports = router;
