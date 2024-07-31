import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { getRecentTicketListItems } from "~/models/ticket.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const recentTickets = await getRecentTicketListItems({userId});
  return json({ recentTickets });
}

export default function EmployeeDashboard() {
  const user = useUser()
  console.log(user)

  //placeholder balance
  let balance = 37.26
  const data = useLoaderData<typeof loader>()
  console.log(data)
  return (
    <>
    {user.status === "PENDING" ? 
      <div>
        <h1>Registration Pending</h1>
        <p>Your registration is pending approval. Please wait for an admin to approve your registration.</p>
      </div>
      :
    <div>
      <Button>Pump Gas</Button>
      <h3>Remaining Balance</h3>
      <div className="overflow-hidden rounded-full bg-gray-200">
        <div style={{ width: `${balance}%` }} className="h-2 rounded-full bg-green-500" />
      </div>
      <h3>$ {balance}</h3>
      <div>
        <h3>Recent Transactions</h3>
        <ul className='divide-y divide-gray-200'>
          {data.recentTickets.map(ticket => (
            <li key={ticket.id} className='flex justify-between py-4'>
              <div>
                <h4>{ticket.id.slice(19)}</h4>
                <p>${ticket.amount.toFixed(2)}</p>
              </div>
              <div>
                <p>{ticket.createdAt}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    }
    </>
  );
}