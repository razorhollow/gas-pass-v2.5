import { useUser } from "~/utils";

export default function DashboardIndex() {
  const user = useUser();
  console.log(user)
  return (
    <div className="grid place-items-center h-screen">
      {user.status === "PENDING" ? 
      <h1 className="text-white">Here is the pending dashboard index.</h1>
      : user.isAdmin ?
      <h1 className="text-white">Here is the Admin Dashboard index</h1>
      : 
      <h1 className="text-white">Here is the Employee Dashboard index</h1>
    }
    </div>
  );
}
