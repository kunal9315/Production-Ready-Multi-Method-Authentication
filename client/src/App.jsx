import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home"
import Register from "./pages/Register/Register"
import VerifyEmailOtp from "./pages/VerifyEmailOtp/VerifyEmailOtp"
import SetPassword from "./pages/SetPassword/SetPassword";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import SendEmailOtp from "./pages/EmailOtpLogin/SendEmailOtp";
import VerifyEmailOtpLogin from "./pages/VerifyEmailOtpLogin/VerifyEmailOtpLogin";
import SendPhoneOtp from "./pages/PhoneOtpLogin/SendPhoneOtp";
import VerifyPhoneOtpLogin from "./pages/VerifyPhoneOtpLogin/VerifyPhoneOtpLogin";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import VerifyForgotOtp from "./pages/VerifyForgotOtp/VerifyForgotOtp";
import ResetPassword from "./pages/ResetPassword/ResetPassword";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element = {<Register/>}/>
        <Route
  path="/verify-email"
  element={<VerifyEmailOtp />}
/>
<Route
  path="/set-password"
  element={<SetPassword />}
/>
<Route path="/login" element={<Login />} />
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/login/email-otp"
  element={<SendEmailOtp />}
/>
<Route
  path="/login/email-otp/verify"
  element={<VerifyEmailOtpLogin />}
/>
<Route
  path="/login/phone-otp"
  element={<SendPhoneOtp />}
/>
<Route
  path="/login/phone-otp/verify"
  element={<VerifyPhoneOtpLogin />}
/>
<Route path="/forgot-password" element={<ForgotPassword />} />

<Route
  path="/verify-forgot-otp"
  element={<VerifyForgotOtp />}
/>

<Route
  path="/reset-password"
  element={<ResetPassword />}
/>

      </Routes>
    </BrowserRouter>
  );
};

export default App;