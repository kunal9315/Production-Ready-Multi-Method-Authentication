const express = require("express")

const authMiddleware = require("../middleware/auth.middleware")

const router = express.Router()

const { register, verifyOtp, setPassword, login, getProfile, refreshAccessToken, logout,resendOtp, forgotPassword, verifyForgotOtp, resetPassword, sendLoginOtp, verifyLoginOtp,sendPhoneLoginOtp, verifyPhoneLoginOtp } = require("../constrollers/auth.controller")

router.post("/register", register)
router.post("/verify-otp", verifyOtp)
router.post("/set-password", setPassword)
router.post("/login",login)



//protected route

router.get("/me",authMiddleware, getProfile)

// router.get("/test-sms", testSms);

router.post("/refresh-token", refreshAccessToken)

router.post("/logout", logout);

router.post("/resend-otp", resendOtp);

router.post("/forgot-password", forgotPassword);

router.post("/verify-forgot-otp", verifyForgotOtp);

router.post("/reset-password", resetPassword);

router.post("/login/email-otp/send", sendLoginOtp);

router.post("/login/email-otp/verify", verifyLoginOtp);

router.post("/login/phone-otp/send", sendPhoneLoginOtp);

router.post("/login/phone-otp/verify", verifyPhoneLoginOtp);

module.exports = router;

