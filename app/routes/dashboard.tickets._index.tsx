import { Ticket } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";


import { getTicketListItems } from "~/models/ticket.server";
import { requireUserId } from "~/session.server";
import { formatDateToUserTimeZone } from "~/utils";

export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await requireUserId(request);
    const tickets = await getTicketListItems({ userId });

    // Format the createdAt date
    const formattedTickets = tickets.map((ticket: Ticket) => ({
    ...ticket,
    createdAt: formatDateToUserTimeZone(ticket.createdAt),
    }));
    return json (formattedTickets);
}

export default function TicketIndex() {
    const tickets = useLoaderData<typeof loader>();
    return (
        <div>
        {tickets.length === 0 ? (
            <p>No tickets yet</p>
        ) : (
            <div>
                <h3>Transaction List</h3>
                <ul className='divide-y divide-gray-200 bg-zinc-800 rounded-xl p-4'>
                    {tickets.map(ticket => (
                        <li key={ticket.id} className='flex justify-between py-4'>
                            <NavLink 
                                to={ticket.id}
                                className='w-full grid grid-cols-3'>
                                <h4 className="tracking-wider">{ticket.id.slice(19).toUpperCase()}</h4>
                                <p>${ticket.amount.toFixed(2)}</p>
                                <p>{ticket.createdAt}</p>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        )
        }
        </div>
    );
}


