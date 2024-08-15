import { Ticket } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { getWeekRange, formatDateToUserTimeZone } from "~/utils"; // Make sure formatDateToUserTimeZone is imported correctly


import { getTicket, getRecentTicketListItems, deleteTicket, updateTicket } from "../models/ticket.server";
import { requireUser, requireUserId } from "../session.server";

const WEEKLY_ALLOWANCE = 100;

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const ticketId = params.ticketId;
  const userId = await requireUserId(request);
  
  if (!ticketId) {
    throw new Error("Ticket ID is required");
  }
  
  const ticket = await getTicket({ id: ticketId, userId });
  
  const { startOfWeek, endOfWeek } = getWeekRange();
  const recentTickets = await getRecentTicketListItems({ userId });

  const weekTickets = recentTickets.filter((ticket: Ticket) => {
    const createdAt = DateTime.fromJSDate(ticket.createdAt);
    return createdAt >= DateTime.fromJSDate(startOfWeek) && createdAt <= DateTime.fromJSDate(endOfWeek);
  });

  const totalSpent = weekTickets.reduce((sum, ticket) => sum + ticket.amount, 0);
  const remainingBalance = WEEKLY_ALLOWANCE - totalSpent;

  const formattedTickets = recentTickets.map((ticket: Ticket) => ({
    ...ticket,
    createdAt: formatDateToUserTimeZone(ticket.createdAt),
  }));

  return {
    ticket,
    recentTickets: formattedTickets,
    totalSpent,
    remainingBalance,
  };
};

export async function action({ params, request }: ActionFunctionArgs) {
  const user = await requireUser(request)
  console.log(user)
  const formData = await request.formData();
  const profileId = formData.get("profileId");
  const intent = formData.get("intent")

  if (intent === "update") {
    // Update ticket
    const amount = formData.get("amount");
    if (typeof amount !== "string" || parseInt(amount) === 0) {
      throw new Error("Amount is required");
    }

    await updateTicket({ id: params.ticketId!, amount: parseInt(amount) });

    console.log('upating ticket...')
    return redirect('/dashboard')
  } else if (intent === "delete" && (user.isAdmin || user.profileId === profileId)) {
    await deleteTicket({ id: params.ticketId! });
    return redirect("/dashboard");
  } else {
    throw new Error("Invalid intent");
  }
}

export default function TicketDetail() {
  const { ticket, remainingBalance } = useLoaderData<typeof loader>();

  return (
    <>
      {ticket.amount === 0 ? (
        <div>
          <div>
            <h2>Ticket Number</h2>
            <p>{ticket.id.slice(19).toUpperCase()}</p>
          </div>
          <div>
            <h2>Pre-Pay Amount</h2>
            <p>{remainingBalance.toFixed(2)}</p>
          </div>
          <div>
            <Form method="POST">
              <input type="hidden" name="profileId" value={ticket.profileId} />
              <Input type="number" name="amount" />
              <Button type="submit" name="intent" value="update">Submit Ticket</Button>
              <Button type="submit" name="intent" value="delete">Cancel</Button>
            </Form>
          </div>
        </div>
      ) : (
        <div>
          <h1>Ticket Detail</h1>
          <p>Ticket ID: {ticket.id.toUpperCase()}</p>
          <p>Amount: {ticket.amount}</p>
          <p>Created At: {new Date(ticket.createdAt).toLocaleString()}</p>
        </div>
      )}
    </>
  );
}
