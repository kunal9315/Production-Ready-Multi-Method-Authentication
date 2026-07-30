import React from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import { useVerifyPhoneLoginOtpMutation } from "../../api/authApi";

const VerifyPhoneOtpLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const phone = location.state?.phone;

  const [verifyPhoneLoginOtp, { isLoading }] =
    useVerifyPhoneLoginOtpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await verifyPhoneLoginOtp({
        phone,
        otp: data.otp,
      }).unwrap();

      localStorage.setItem("accessToken", res.accessToken);

      alert("Login Successful!");

      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      alert(error?.data?.message || "Invalid OTP");
    }
  };

  if (!phone) {
    return (
      <h1 className="text-center mt-10">
        Phone number not found. Please start again.
      </h1>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card title="Verify Phone OTP">
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
              minLength: {
                value: 6,
                message: "OTP must be 6 digits",
              },
              maxLength: {
                value: 6,
                message: "OTP must be 6 digits",
              },
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

export default VerifyPhoneOtpLogin;