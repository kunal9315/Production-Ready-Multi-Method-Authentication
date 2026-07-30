import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import { useForgotPasswordMutation } from "../../api/authApi";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [forgotPassword, { isLoading }] =
    useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email).unwrap();

      alert("OTP sent successfully");

      navigate("/verify-forgot-otp", {
        state: {
          email: data.email,
        },
      });
    } catch (error) {
      alert(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <Card title="Forgot Password">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
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

          <Button loading={isLoading}>
            Send OTP
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPassword;