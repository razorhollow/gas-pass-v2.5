import type { User, Ticket } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getTicket({
  id,
  userId,
}: Pick<Ticket, "id"> & { userId: User["id"] }) {
  // Fetch the user along with their profile in one query
  const userWithProfile = await prisma.user.findFirst({
    where: { id: userId },
    include: { profile: true },
  });

  // Handle the case where the user or the user's profile does not exist
  if (!userWithProfile || !userWithProfile.profile) {
    throw new Error("User or user profile not found");
  }

  // Fetch the ticket
  const ticket = await prisma.ticket.findFirst({
    where: { id },
  });

  // Handle the case where the ticket does not exist
  if (!ticket) {
    throw new Error("Ticket not found");
  }

  // Check access permissions
  if (ticket.profileId === userWithProfile.profile.id || userWithProfile.isAdmin) {
    return ticket;
  } else {
    throw new Error("User does not have access to this ticket");
  }
}

export function getTicketListItems({ userId }: { userId: User["id"] }) {
  return prisma.ticket.findMany({
    where: {
      profile:{
        userId: userId ,
      },
    },
    orderBy: { createdAt: "desc" },
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

export async function createTicket({ userId }: { userId: User["id"] }) {
  // Check if there is an existing ticket with amount 0 for the given user
  const existingTicket = await prisma.ticket.findFirst({
    where: {
      profile: {
        userId: userId,
      },
      amount: 0,
    },
  });

  // If such a ticket exists, return it instead of creating a new one
  if (existingTicket) {
    console.log("ticket with zero balance found...")
    return existingTicket;
  }

  // Otherwise, create a new ticket with amount 0
  console.log("no zero balance ticket found...")
  return prisma.ticket.create({
    data: {
      amount: 0,
      profile: {
        connect: { userId },
      },
    },
  });
}



export function deleteTicket({ id }:Pick<Ticket, "id">) {
  return prisma.ticket.deleteMany({
    where: { id },
  });
}

export function updateTicket({
  id,
  amount,
}: Pick<Ticket, "id" | "amount">) {
  return prisma.ticket.update({
    where: { id },
    data: { amount },
  });
} 
