const { Prisma: prisma } = require("../../lib/db");
require("dotenv").config();

exports.getUnapprovedUsers = async () => {
  const users = await prisma.user.findMany({
    where: {
      isVerified: false,
    },
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  });
  return { statusCode: 200, data: users };
};

exports.approveUser = async (userId) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      id: true,
      isVerified: true,
    },
  });

  console.log(user)

  if (!user) {
    return { statusCode: 404, message: "User not found" };
  }

  if (user.isVerified) {
    return { statusCode: 400, message: "User is already verified" };
  }

  await prisma.user.update({
    where: {
      id: userId,
      isVerified: false,
    },
    data: {
      isVerified: true,
    },
  });

  return { statusCode: 202, message: "User approved successfully" };
};

exports.deleteUser = async (userId) => {
  const user = await prisma.user.delete({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });
  if (!user) {
    return { statusCode: 404, message: "User not found" };
  }
  return { statusCode: 200, message: "User deleted successfully" };
};
