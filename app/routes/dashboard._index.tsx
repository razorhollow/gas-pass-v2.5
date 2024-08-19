import { LoaderFunctionArgs, redirect } from "@remix-run/node";

import { requireUser } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  console.log

  //if the user doesn't have a profile or user.profile.name includes 'user', redirect to onboarding route
  if (!user.profileId || user.profile?.name.toLowerCase().includes("user")) {
    return redirect("./onboarding");
  }
  
  if (user.isAdmin) {
    return redirect("./admin");
  }
  return redirect("./employee");
}
