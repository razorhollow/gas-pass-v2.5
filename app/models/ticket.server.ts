import type { User, Ticket } from "@prisma/client";

import { prisma } from "~/db.server";

export function getTicket({
  id,
  userId,
}: Pick<Ticket, "id"> & {
  userId: User["id"];
}) {
  return prisma.note.findFirst({
    select: { id: true, body: true, title: true },
    where: { id, userId },
  });
}

export function getTicketListItems({ userId }: { userId: User["id"] }) {
  return prisma.note.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function getRecentTicketListItems({ userId }: { userId: User["id"] }) {
  return prisma.ticket.findMany({
    where: {
      profile:{
        userId: userId ,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}
export function createNote({
  body,
  title,
  userId,
}: Pick<Ticket, "body" | "title"> & {
  userId: User["id"];
}) {
  return prisma.note.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteNote({
  id,
  userId,
}: Pick<Ticket, "id"> & { userId: User["id"] }) {
  return prisma.note.deleteMany({
    where: { id, userId },
  });
}
