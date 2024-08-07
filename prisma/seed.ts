import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // Cleanup the existing database
  await prisma.user.deleteMany().catch(() => {
    // No worries if it doesn't exist yet
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
    const newUser = await prisma.user.create({
      data: {
        email: userData.email,
        password: { create: { hash: employeePassword } },
        status: "ACTIVE",
        profile: {
          create: {
            name: userData.name,
            employeeCode: userData.employeeCode,
            tickets: {
              create: [
                {
                  amount: 10.0,
                  createdAt: new Date(),
                },
                {
                  amount: 20.0,
                  createdAt: new Date(),
                },
              ],
            },
          },
        },
      },
      include: {
        profile: true,
      },
    });

    await prisma.user.update({
      where: { id: newUser.id },
      data: { profileId: newUser.profile?.id },
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
          tickets: {
            create: [
              {
                amount: 50.0,
                createdAt: new Date(),
              },
              {
                amount: 75.0,
                createdAt: new Date(),
              },
            ],
          },
        },
      },
    },
    include: {
      profile: true,
    },
  });

  await prisma.user.update({
    where: { id: admin.id },
    data: { profileId: admin.profile?.id },
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
