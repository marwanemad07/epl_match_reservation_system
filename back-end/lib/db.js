const { PrismaClient } = require("@prisma/client");

const prismaClientSingleton = () => {
  return new PrismaClient()
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

exports.Prisma = prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma