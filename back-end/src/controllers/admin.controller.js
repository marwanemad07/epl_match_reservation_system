const adminService = require('../services/admin.service');

const development = process.env._ENV == "dev";

exports.getUnapprovedUsers = async (req, res) => {
    try{
        const response = await adminService.getUnapprovedUsers();
        const statusCode = response.statusCode || 200;
        res.status(statusCode).json(response);
    }
    catch(err){
        const message = development ? err.message : "Internal server error";
        const statusCode = err.status || 500;
        res.status(statusCode).json({message: message});
    }
};

exports.approveUser = async (req, res) => {
    try{
        const userId = req.query.id;
        console.log(userId)
        if(!userId){
            throw {status: 400, message: "User ID is required"};
        }

        const response = await adminService.approveUser(userId);
        const statusCode = response.statusCode || 204;
        res.status(statusCode).json();
    }
    catch(err){
        const message = development ? err.message : "Internal server error";
        const statusCode = err.status || 500;
        res.status(statusCode).json({message: message});
    }
}