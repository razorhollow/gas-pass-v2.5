import { User } from "@prisma/client";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";



import { requireUser } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user: User = await requireUser(request);
  if (user.isAdmin === false) {
    return redirect("/dashboard");
  }
}

export default function DashboardAdmin() {
  return (
    <h1>This is the Admin Dashboard</h1>
  );
}