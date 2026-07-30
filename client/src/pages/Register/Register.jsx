import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import { useNavigate } from "react-router-dom";

import { useRegisterMutation } from "../../api/authApi";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [registerUser, { isLoading }] = useRegisterMutation();

  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      console.log("Form Data:", data);

      const response = await registerUser(data).unwrap();

      console.log("Register Success:", response);

      navigate("/verify-email", {
      state: {
      email: data.email,
    },
    });

      // Later we'll navigate to Verify Email OTP page
      // navigate("/verify-email", {
      //   state: { email: data.email },
      // });

    } catch (error) {
      console.error("Register Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <Card>
        <h1 className="text-3xl font-bold text-center">
          Create Account
        </h1>

        <p className="text-gray-500 text-center mt-2">
          Register to continue
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-5"
        >
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            register={register}
            name="name"
            rules={{
              required: "Name is required",
            }}
            error={errors.name}
          />

          <Input
            label="Email Address"
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
            label="Phone Number"
            type="text"
            placeholder="Enter your phone number"
            register={register}
            name="phone"
            rules={{
              required: "Phone number is required",
            }}
            error={errors.phone}
          />

          <Button loading={isLoading}>
            Register
          </Button>
        </form>

        <p className="text-center mt-6">
          Already have an account?

          <Link
            className="text-blue-600 ml-2 font-semibold hover:underline"
            to="/login"
          >
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;