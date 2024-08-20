import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Ticket } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";

interface Profile {
  id: string;
  name: string;
  employeeCode: number;
}

interface TicketWithProfile extends Ticket {
  profile: Profile;
}

interface TicketWithoutProfile extends Ticket {
  profile?: undefined;
}

type TicketType = TicketWithProfile | TicketWithoutProfile;

import {
  getAdminTicketListItems,
  getTicketListItems,
} from "~/models/ticket.server";
import { requireUser } from "~/session.server";
import { formatDateToUserTimeZone, useUser } from "~/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const userId = user.id;
  let tickets: TicketType[] = [];
  if (user.isAdmin) {
    tickets = await getAdminTicketListItems();
  } else {
    tickets = await getTicketListItems({ userId });
  }

  // Format the createdAt date
  const formattedTickets = tickets.map((ticket: TicketType) => ({
    ...ticket,
    createdAt: formatDateToUserTimeZone(ticket.createdAt),
  }));
  return json(formattedTickets);
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
                      {ticket.profile ? <p className="text-gray-500">{ticket.profile.name}</p> : null}
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