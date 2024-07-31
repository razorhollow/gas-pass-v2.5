import { useUser } from "~/utils";

export default function EmployeeDash() {
  const user = useUser()
  console.log(user)
  return (
    <>
    {user.status === "PENDING" ? 
      <div>
        <h1>Registration Pending</h1>
        <p>Your registration is pending approval. Please wait for an admin to approve your registration.</p>
      </div>
      :
    <div>
      <h1>This is the Employee Dashboard</h1>
    </div>
    }
    </>
  );
}