const { Prisma: prisma } = require("../lib/db");
const bcrypt = require("bcrypt");

const deleteAll = async () => {
  await prisma.team.deleteMany();
  await prisma.stadium.deleteMany();
  await prisma.referee.deleteMany();
};

exports.seedDatabase = async () => {
  try {
    await deleteAll();

    await seedTeams();

    await seedReferees();

    const stadiums = [
      { name: "Cairo International Stadium", rows: 100, seatsPerRow: 50 },
      { name: "Borg El Arab Stadium", rows: 80, seatsPerRow: 40 },
      { name: "Al Salam Stadium", rows: 60, seatsPerRow: 30 },
    ];
    await prisma.stadium.createMany({ data: stadiums });

    await seedAdmin();

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
};

const seedAdmin = async () => {
  await prisma.user.delete({
    where: {
      username: "admin",
    },
  });

  birthDate = new Date("2001-10-14");
  user = {
    username: "admin",
    password: "admin123",
    email: "amdin@gmail.com",
    firstName: "Marwan",
    lastName: "Emad",
    isVerified: true,
    role: "ADMIN",
    birthDate: birthDate,
    gender: "MALE",
    city: "Giza",
  };

  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;

  await prisma.user.create({ data: user });
};

exports.seedTeams = async () => {
  try {
    await prisma.team.deleteMany();

    const teams = [
      "Al Ahly",
      "Zamalek",
      "Pyramids FC",
      "Ismaily SC",
      "Al Ittihad Alexandria",
      "ENPPI",
      "Future FC",
      "Ghazl El Mahalla",
      "El Gaish",
      "Smouha SC",
      "Al Mokawloon Al Arab",
      "Misr Lel Makkasa",
      "El Entag El Harby",
      "El Gouna",
      "Pharco FC",
      "National Bank of Egypt SC",
      "Ceramica Cleopatra",
      "Eastern Company SC",
    ];
    await prisma.team.createMany({
      data: teams.map((name) => ({ name })),
    });

    console.log("Teams seeded successfully.");

    return { statusCode: 201, message: "Teams seeded successfully" };
  } catch (error) {
    console.error("Error seeding teams:", error);
    return { statusCode: 500, message: "Internal server error" };
  }
};

exports.seedReferees = async () => {
  try {
    const referees = [
      { name: "Gehad Grisha" },
      { name: "Mahmoud El Banna" },
      { name: "Ibrahim Nour El Din" },
      { name: "Amr El Hanafi" },
      { name: "Ahmed Gamal" },
      { name: "Tahseen Abo Elmahasen" },
    ];
    await prisma.referee.createMany({ data: referees });
    return { statusCode: 201, message: "Referees seeded successfully" };
  } catch (error) {
    console.error("Error seeding teams:", error);
    return { statusCode: 500, message: "Internal server error" };
  }
};

// seedDatabase();
