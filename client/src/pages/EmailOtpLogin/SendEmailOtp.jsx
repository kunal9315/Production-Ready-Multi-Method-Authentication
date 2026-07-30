import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import { useSendEmailLoginOtpMutation } from "../../api/authApi";

const SendEmailOtp = () => {
  const navigate = useNavigate();

  const [sendEmailLoginOtp, { isLoading }] =
    useSendEmailLoginOtpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await sendEmailLoginOtp(data.email).unwrap();

      alert("OTP sent successfully!");

      navigate("/login/email-otp/verify", {
        state: {
          email: data.email,
        },
      });
    } catch (error) {
      console.log(error);

      alert(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card title="Login with Email OTP">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            register={register("email", {
              required: "Email is required",
            })}
            error={errors.email?.message}
          />

          <Button loading={isLoading}>
            Send OTP
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SendEmailOtp;