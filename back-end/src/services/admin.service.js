const { PrismaClient } = require("@prisma/client");
require('dotenv').config();

const prisma = new PrismaClient();

exports.getUnapprovedUsers = async () => {
    const users = await prisma.user.findMany({
        where: {
            isVerified: false
        },
        select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
        }
    });
    return {statusCode: 200, data: users};
};

exports.approveUser = async (userId) => {
    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            isVerified: true
        }, 
        select: {
            id: true
        }
    });
    if (!user) {
        return {statusCode: 404, message: "User not found"};
    }
    return {statusCode: 204};
}