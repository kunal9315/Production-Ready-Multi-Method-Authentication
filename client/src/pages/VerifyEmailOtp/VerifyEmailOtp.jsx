import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import {
  useVerifyEmailMutation,
  useResendOtpMutation,
} from "../../api/authApi";

const VerifyEmailOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

    useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  if (!email) {
    return null;
  }
  const [otp, setOtp] = useState("");

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendOtp] = useResendOtpMutation();

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await verifyEmail({
        email,
        otp,
      }).unwrap();

      console.log(res);

      alert("Email Verified Successfully");

      navigate("/set-password", {
        state: { email },
      });

    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Verification Failed");
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp(email).unwrap();

      alert("OTP Sent Again");
    } catch (err) {
      alert(err?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center">
      <Card>
        <h1 className="text-3xl font-bold text-center">
          Verify Email
        </h1>

        <p className="text-center text-gray-500 mt-2">
          OTP sent to
        </p>

        <p className="text-center font-semibold">
          {email}
        </p>

        <form
          onSubmit={handleVerify}
          className="space-y-5 mt-8"
        >
          <Input
            label="OTP"
            type="text"
            placeholder="Enter 6 digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <Button loading={isLoading}>
            Verify OTP
          </Button>
        </form>

        <button
          onClick={handleResend}
          className="text-blue-600 mt-5 w-full"
        >
          Resend OTP
        </button>
      </Card>
    </div>
  );
};

export default VerifyEmailOtp;