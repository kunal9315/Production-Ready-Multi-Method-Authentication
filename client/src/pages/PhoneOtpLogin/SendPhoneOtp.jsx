import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import { useSendPhoneLoginOtpMutation } from "../../api/authApi";

const SendPhoneOtp = () => {
  const navigate = useNavigate();

  const [sendPhoneLoginOtp, { isLoading }] =
    useSendPhoneLoginOtpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await sendPhoneLoginOtp(data.phone).unwrap();

      alert("OTP sent successfully!");

      navigate("/login/phone-otp/verify", {
        state: {
          phone: data.phone,
        },
      });
    } catch (error) {
      console.log(error);

      alert(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card title="Login with Phone OTP">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Input
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            register={register}
            name="phone"
            rules={{
              required: "Phone number is required",
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: "Enter a valid 10-digit phone number",
              },
            }}
            error={errors.phone}
          />

          <Button loading={isLoading}>
            Send OTP
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SendPhoneOtp;