import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Profile } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";

import {
  getAdminTicketListItems,
  getTicketListItems,
} from "~/models/ticket.server";
import { requireUser } from "~/session.server";
import { formatDateToUserTimeZone, useUser } from "~/utils";

interface CustomTicket {
  id: string;
  amount: number;
  createdAt: string;
  profile?: Profile;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const userId = user.id;

  let tickets: CustomTicket[] = [];

  if (user.isAdmin) {
    const adminTickets = await getAdminTicketListItems();
    tickets = adminTickets.map((ticket) => ({
      ...ticket,
      createdAt: formatDateToUserTimeZone(ticket.createdAt), // Now, this can be a string
    }));
  } else {
    const userTickets = await getTicketListItems({ userId });
    tickets = userTickets.map((ticket) => ({
      ...ticket,
      createdAt: formatDateToUserTimeZone(ticket.createdAt), // Now, this can be a string
    }));
  }

  return json(tickets);
}

export default function TicketIndex() {
  const tickets = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <>
      {user.isAdmin ? (
        <div>
          {tickets.length === 0 ? (
            <p>No tickets yet</p>
          ) : (
            <div>
              <h3>Transaction List</h3>
              <ul className="divide-y divide-gray-200 bg-zinc-800 rounded-xl p-4">
                {tickets.map((ticket) => (
                  <li key={ticket.id} className="flex justify-between py-4">
                    <NavLink to={ticket.id} className="w-full grid grid-cols-3">
                      <h4 className="tracking-wider">
                        {ticket.id.slice(19).toUpperCase()}
                      </h4>
                      <p className="text-green-400">
                        ${ticket.amount.toFixed(2)}
                      </p>
                      <p>{new Date(ticket.createdAt).toLocaleDateString()}</p>
                      {ticket.profile ? (
                        <p className="text-gray-500">{ticket.profile.name}</p>
                      ) : null}
                    </NavLink>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div>
          {tickets.length === 0 ? (
            <p>No tickets yet</p>
          ) : (
            <div>
              <h3>Transaction List</h3>
              <ul className="divide-y divide-gray-200 bg-zinc-800 rounded-xl p-4">
                {tickets.map((ticket) => (
                  <li key={ticket.id} className="flex justify-between py-4">
                    <NavLink to={ticket.id} className="w-full grid grid-cols-3">
                      <h4 className="tracking-wider">
                        {ticket.id.slice(19).toUpperCase()}
                      </h4>
                      <p className="text-green-400">
                        ${ticket.amount.toFixed(2)}
                      </p>
                      <p>{new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
}
