import { QrCodeIcon } from "@heroicons/react/20/solid";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, NavLink, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";

import { Button } from "~/components/ui/button";
import { getRecentTicketListItems, createTicket } from "~/models/ticket.server";
import { requireUserId } from "~/session.server";
import { useUser, formatDateToUserTimeZone, getWeekRange } from "~/utils";

interface Ticket {
  id: string;
  amount: number;
  createdAt: Date;
}

const WEEKLY_ALLOWANCE = 100;

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const { startOfWeek, endOfWeek } = getWeekRange();
  console.log(`startOfWeek: ${startOfWeek}, endOfWeek: ${endOfWeek}`);

  const recentTickets = await getRecentTicketListItems({ userId });

  const weekTickets = recentTickets.filter((ticket: Ticket) => {
    const createdAt = DateTime.fromJSDate(ticket.createdAt);
    return (
      createdAt >= DateTime.fromJSDate(startOfWeek) &&
      createdAt <= DateTime.fromJSDate(endOfWeek)
    );
  });

  const totalSpent = weekTickets.reduce(
    (sum, ticket) => sum + ticket.amount,
    0,
  );
  const remainingBalance = WEEKLY_ALLOWANCE - totalSpent;

  // Format the createdAt date
  const formattedTickets = recentTickets.map((ticket: Ticket) => ({
    ...ticket,
    createdAt: formatDateToUserTimeZone(ticket.createdAt),
  }));

  return json({ recentTickets: formattedTickets, remainingBalance });
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);

  // Fetch recent tickets and calculate remaining balance
  const { startOfWeek, endOfWeek } = getWeekRange();
  const recentTickets = await getRecentTicketListItems({ userId });

  const weekTickets = recentTickets.filter((ticket: Ticket) => {
    const createdAt = DateTime.fromJSDate(ticket.createdAt);
    return (
      createdAt >= DateTime.fromJSDate(startOfWeek) &&
      createdAt <= DateTime.fromJSDate(endOfWeek)
    );
  });

  const totalSpent = weekTickets.reduce(
    (sum, ticket) => sum + ticket.amount,
    0,
  );
  const remainingBalance = WEEKLY_ALLOWANCE - totalSpent;

  // If the remaining balance is 0 or less, do not allow creating a new ticket
  if (remainingBalance <= 0) {
    // Optionally, you can redirect to an error page or return a JSON response with an error message
    return json(
      { error: "Insufficient balance to create a new ticket." },
      { status: 400 },
    );
  }

  // If there's enough balance, proceed to create the new ticket
  const newTicket = await createTicket({ userId });

  return redirect(`/dashboard/tickets/${newTicket.id}`);
}

export default function EmployeeDashboard() {
  const user = useUser();
  const data = useLoaderData<typeof loader>();

  // Check if remaining balance is less than or equal to 0
  const isPumpDisabled = data.remainingBalance <= 0;

  return (
    <>
      {user.status === "PENDING" ? (
        <div>
          <h1>Registration Pending</h1>
          <p>
            Your registration is pending approval. Please wait for an admin to
            approve your registration.
          </p>
        </div>
      ) : (
        <div>
          <Form method="POST">
            <Button type="submit" disabled={isPumpDisabled}>
              <QrCodeIcon /> Pump Gas
            </Button>
          </Form>
          <h3>Remaining Balance</h3>
          <div className="overflow-hidden rounded-full bg-gray-200">
            <div
              style={{ width: `${data.remainingBalance}%` }}
              className="h-2 rounded-full bg-green-500"
            />
          </div>
          <h3>$ {data.remainingBalance.toFixed(2)}</h3>
          {isPumpDisabled ? (
            <p className="text-red-600">
              Your weekly balance has been exhausted. Please wait until next
              week to pump gas.
            </p>
          ) : null}
          <div>
            <h3>Recent Transactions</h3>
            <ul className="divide-y divide-gray-200 bg-zinc-800 rounded-xl p-4">
              {data.recentTickets.map((ticket) => (
                <NavLink
                  key={ticket.id}
                  to={`/dashboard/tickets/${ticket.id}`}
                  className="flex justify-between py-4"
                >
                  <li className="flex justify-between py-4">
                    <div className="w-full grid grid-cols-3">
                      <h4 className="tracking-wider">
                        {ticket.id.slice(19).toUpperCase()}
                      </h4>
                      <p>${ticket.amount.toFixed(2)}</p>
                      <p>{ticket.createdAt}</p>
                    </div>
                  </li>
                </NavLink>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
