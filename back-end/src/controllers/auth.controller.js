const authService = require('../services/auth.service');
require('dotenv').config();

const development = process.env._ENV == "dev";

exports.registerUser = async (req, res) => {
    try {
        const data = req.body;
        const response = await authService.registerUser(data);
        // if (response.statusCode === 201) {
        //     authService.addTokenToCookie(res, response.data.token);
        // }
        const statusCode = response.statusCode || 201;
        res.status(statusCode).json(response);
    }
    catch (err) {
        const message = development ? err.message : "Internal server error";
        const statusCode = err.status || 500;
        res.status(statusCode).json({ statusCode: statusCode, message: message });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const data = req.body;
        const response = await authService.loginUser(data);
        if (response.statusCode === 200) {
            authService.addTokenToCookie(res, response.data.token);
        }
        const statusCode = response.statusCode || 200;
        res.status(statusCode).json(response);
    }
    catch (err) {
        const message = development ? err.message : "Internal server error";
        const statusCode = err.status || 500;
        res.status(statusCode).json({ statusCode: statusCode, message: message });
    }
}