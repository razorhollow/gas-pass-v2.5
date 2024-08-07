import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getTicket } from "../models/ticket.server";
import { requireUserId } from "../session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const ticketId = params.ticketId;
  const userId = await requireUserId(request)
  if (!ticketId) {
    throw new Error("Ticket ID is required");
  }
  const ticket = await getTicket({ id: ticketId, userId });
  return { ticket }
};

export default function TicketDetail() {
  const { ticket } = useLoaderData<typeof loader>();
  
  return (
    <div>
      <h1>Ticket Detail</h1>
      <p>Ticket ID: {ticket.id}</p>
      <p>Amount: {ticket.amount}</p>
      <p>Created At: {new Date(ticket.createdAt).toLocaleString()}</p>
    </div>
  );
}