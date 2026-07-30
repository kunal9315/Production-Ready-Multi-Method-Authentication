import { useGetMeQuery, useLogoutMutation } from "../../api/authApi";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { data, isLoading, error } = useGetMeQuery();

  const navigate = useNavigate();

  const [logout] = useLogoutMutation();

const handleLogout = async () => {
  try {
    await logout().unwrap();
  } catch (err) {
    console.log("Logout API Error:", err);
  } finally {
    localStorage.removeItem("accessToken");

    console.log(
      "Token after remove:",
      localStorage.getItem("accessToken")
    );

    navigate("/login");
  }
};

  if (isLoading) return <h1>Loading...</h1>;

//   if (error) return <h1>Something went wrong</h1>;

if (error) {
  console.log(error);
  return (
    <div>
      <h1>Something went wrong</h1>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  );
}

  const user = data.user;



  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-[450px]">
        <h1 className="text-3xl font-bold mb-6">
          Welcome {user.name} 👋
        </h1>

        <div className="space-y-3">
          <p>
            <strong>Name:</strong> {user.name}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>Phone:</strong> {user.phone || "Not Added"}
          </p>

          <p>
            <strong>Email Verified:</strong>{" "}
            {user.isVerified ? "✅ Yes" : "❌ No"}
          </p>

          {/* <p>
            <strong>Phone Verified:</strong>{" "}
            {user.isPhoneVerified ? "✅ Yes" : "❌ No"}
          </p> */}
        </div>

        <div className="mt-8">
          <Button onClick={handleLogout} >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;