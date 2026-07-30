import React from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import { useResetPasswordMutation } from "../../api/authApi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [resetPassword, { isLoading }] =
    useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      await resetPassword({
        email,
        password: data.password,
      }).unwrap();

      alert("Password reset successfully");

      navigate("/login");
    } catch (error) {
      alert(error?.data?.message || "Something went wrong");
    }
  };

  if (!email) {
    return (
      <h1 className="text-center mt-10">
        Email not found.
      </h1>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <Card title="Reset Password">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            register={register}
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
            }}
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm password"
            register={register}
            name="confirmPassword"
            rules={{
              required: "Confirm password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
            error={errors.confirmPassword}
          />

          <Button loading={isLoading}>
            Reset Password
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;