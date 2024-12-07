const { validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors.array()[0]);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
};

module.exports = handleValidationErrors;
