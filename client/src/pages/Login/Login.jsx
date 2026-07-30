import { Link, NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import { useLoginMutation } from "../../api/authApi";

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data) => {
    try {
      const res = await login(data).unwrap();

      localStorage.setItem("accessToken", res.accessToken);

      alert("Login Successful");

      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      alert(err?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center">
      <Card>
        <h1 className="text-3xl font-bold text-center">
          Login
        </h1>

        {/* Login Tabs */}
        <div className="flex gap-2 mt-6">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `flex-1 p-2 rounded text-center transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`
            }
          >
            Password
          </NavLink>

          <NavLink
            to="/login/email-otp"
            className={({ isActive }) =>
              `flex-1 p-2 rounded text-center transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`
            }
          >
            Email OTP
          </NavLink>

          <NavLink
            to="/login/phone-otp"
            className={({ isActive }) =>
              `flex-1 p-2 rounded text-center transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`
            }
          >
            Phone OTP
          </NavLink>
        </div>

        {/* Password Login Form */}
        <div className="mt-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              register={register}
              name="email"
              rules={{
                required: "Email is required",
              }}
              error={errors.email}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              register={register}
              name="password"
              rules={{
                required: "Password is required",
              }}
              error={errors.password}
            />

            <Button loading={isLoading}>
              Login
            </Button>
          </form>
        </div>

        {/* Forgot Password */}
        <div className="mt-6 text-center">
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Register */}
        <div className="mt-3 text-center">
          <Link
            to="/register"
            className="text-blue-600 hover:underline"
          >
            Create Account
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;