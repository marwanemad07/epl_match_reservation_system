const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
require('dotenv').config();

const prisma = new PrismaClient();

exports.registerUser = async (body) => {
    switch (body.gender) {
        case "M":
            body.gender = "MALE";
            break;
        case "F":
            body.gender = "FEMALE";
            break;
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword;

    try {
        const user = await prisma.user.create({
            data: body,
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true
            }
        });
        return { statusCode: 201, data: user };
    } catch (err) {
        if (process.env._ENV === 'dev') {
            throw err;
        }
        if (err.code === "P2002") {
            return { statusCode: 404, message: "User exists or a constraint is violated" };
        }
    }
};
