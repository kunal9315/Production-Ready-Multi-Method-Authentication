import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import { useSetPasswordMutation } from "../../api/authApi";

const SetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  if (!email) return null;

  // State for password
  const [password, setPassword] = useState("");

  // RTK Query Mutation
  const [setPasswordApi, { isLoading }] = useSetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await setPasswordApi({
        email,
        password,
      }).unwrap();

      console.log(res);

      alert("Password Set Successfully");

      navigate("/login");
    } catch (err) {
      console.error(err);

      alert(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center">
      <Card>
        <h1 className="text-3xl font-bold text-center">
          Set Password
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Create your account password
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 mt-8"
        >
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button loading={isLoading}>
            Save Password
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SetPassword;