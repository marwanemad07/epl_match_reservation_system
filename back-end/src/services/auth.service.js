const { Prisma: prisma } = require("../../lib/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.registerUser = async (body) => {
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
        email: true,
      },
    });

    token = exports.generateToken({ userId: user.id, role: user.role });

    return { statusCode: 201, data: { user, token } };
  } catch (err) {
    if (process.env._ENV === "dev") {
      throw err;
    }
    if (err.code === "P2002") {
      return {
        statusCode: 404,
        message: "User exists or a constraint is violated",
      };
    }
  }
};

exports.loginUser = async (body) => {
  const user = await prisma.user.findFirst({
    where: {
      username: body.username,
    },
    select: {
      id: true,
      username: true,
      password: true,
      role: true,
      isVerified: true,
    },
  });

  if (!user) {
    return { statusCode: 404, message: "User not found" };
  }

  if (user.isVerified === false) {
    return { statusCode: 403, message: "User is not verified" };
  }

  const match = await bcrypt.compare(body.password, user.password);

  if (!match) {
    return { statusCode: 401, message: "Invalid credentials" };
  }
  token = exports.generateToken({ userId: user.id, role: user.role });
  return { statusCode: 200, data: { token } };
};

exports.generateToken = (user) => {
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token;
};

exports.addTokenToCookie = (res, token) => {
  res.cookie("token", `Bearer ${token}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};
