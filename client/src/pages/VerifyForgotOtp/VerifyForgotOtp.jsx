import React from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import { useVerifyForgotOtpMutation } from "../../api/authApi";

const VerifyForgotOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [verifyForgotOtp, { isLoading }] =
    useVerifyForgotOtpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await verifyForgotOtp({
        email,
        otp: data.otp,
      }).unwrap();

      alert("OTP Verified");

      navigate("/reset-password", {
        state: {
          email,
        },
      });
    } catch (error) {
      alert(error?.data?.message || "Invalid OTP");
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
      <Card title="Verify OTP">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Input
            label="OTP"
            placeholder="Enter OTP"
            register={register}
            name="otp"
            rules={{
              required: "OTP is required",
            }}
            error={errors.otp}
          />

          <Button loading={isLoading}>
            Verify OTP
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default VerifyForgotOtp;