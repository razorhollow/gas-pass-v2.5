import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id }, include: { profile: true } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,         // Include the id field (optional)
      email: true,      // Include the email field
      status: true,     // Include the status field
      profile: {
        select: {
          name: true,           // Include the name field from Profile
          employeeCode: true,   // Include the employeeCode field from Profile
        },
      },
      createdAt: true,  
    },
  });
}

export async function createUser(email: User["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"],
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash,
  );

  if (!isValid) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

// create an updateUserProfile function that updates the user's profile with name: `${firstName} ${lastName}` and employeeCode: employeeId
export async function updateUserProfile(userId: User["id"], { firstName, lastName, employeeId }: { firstName: string; lastName: string; employeeId: string }) {
  return prisma.profile.upsert({
    where: { userId },
    create: {
      name: `${firstName} ${lastName}`,
      employeeCode: parseInt(employeeId),
      user: { connect: { id: userId } },
    },
    update: {
      name: `${firstName} ${lastName}`,
      employeeCode: parseInt(employeeId),
    },
  });
}
