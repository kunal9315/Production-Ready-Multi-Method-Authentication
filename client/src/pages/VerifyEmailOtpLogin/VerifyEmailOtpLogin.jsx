import React from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import { useVerifyEmailLoginOtpMutation } from "../../api/authApi";

const VerifyEmailOtpLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [verifyEmailLoginOtp, { isLoading }] =
    useVerifyEmailLoginOtpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await verifyEmailLoginOtp({
        email,
        otp: data.otp,
      }).unwrap();

      localStorage.setItem("accessToken", res.accessToken);

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert(error?.data?.message || "Invalid OTP");
    }
  };

  if (!email) {
    return <h1>Email not found. Please start again.</h1>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card title="Verify Email OTP">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Input
            label="OTP"
            type="text"
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

export default VerifyEmailOtpLogin;