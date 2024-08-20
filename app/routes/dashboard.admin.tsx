import { User } from "@prisma/client";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { requireUser } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user: User = await requireUser(request);
  if (user.isAdmin === false) {
    return redirect("/dashboard/employee");
  }
  return json({ user });
}

export default function DashboardAdmin() {
  return <Outlet />;
}
