import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);
  const employeePassword = await bcrypt.hash("hashedpassword", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const users = [
    {
      email: "user1@example.com",
      name: "User One",
      employeeCode: 1001,
    },
    {
      email: "user2@example.com",
      name: "User Two",
      employeeCode: 1002,
    },
    {
      email: "user3@example.com",
      name: "User Three",
      employeeCode: 1003,
    },
    {
      email: "user4@example.com",
      name: "User Four",
      employeeCode: 1004,
    },
    {
      email: "user5@example.com",
      name: "User Five",
      employeeCode: 1005,
    },
  ];

  for (const userData of users) {
    await prisma.user.create({
      data: {
        email: userData.email,
        password: { create: { hash: employeePassword } },
        status: "ACTIVE",
        profile: {
          create: {
            name: userData.name,
            employeeCode: userData.employeeCode,
            currentBalance: { create: { amount: 100.0 } },
            tickets: {
              create: [
                {
                  amount: 10.0,
                  ticketNumber: `TICKET_${userData.employeeCode}_1`,
                  createdAt: new Date(),
                },
                {
                  amount: 20.0,
                  ticketNumber: `TICKET_${userData.employeeCode}_2`,
                  createdAt: new Date(),
                },
              ],
            },
          },
        },
      },
    });
  }

  const hashedAdminPassword = await bcrypt.hash("hashedpassword2", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: { create: { hash: hashedAdminPassword } },
      status: "ACTIVE",
      isAdmin: true,
      profile: {
        create: {
          name: "Admin User",
          employeeCode: 1000,
          currentBalance: { create: { amount: 100.0 } },
          tickets: {
            create: [
              {
                amount: 50.0,
                ticketNumber: "TICKET_ADMIN_1",
                createdAt: new Date(),
              },
              {
                amount: 75.0,
                ticketNumber: "TICKET_ADMIN_2",
                createdAt: new Date(),
              },
            ],
          },
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
