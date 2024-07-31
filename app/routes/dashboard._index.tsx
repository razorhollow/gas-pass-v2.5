import { LoaderFunctionArgs, redirect } from "@remix-run/node";

import { requireUser } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  console.log
  
  if (user.isAdmin) {
    return redirect("./admin");
  }
  return redirect("./employee");
}
