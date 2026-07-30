const User = require("../models/User")
const bcrypt = require("bcrypt")
const sendEmail = require("../services/email.service")
const jwt = require("jsonwebtoken")
const { sendSms } = require("../services/twilio.service");

const {generateAccessToken, generateRefreshToken} = require("../utils/generateToken")


const register = async (req,res) =>{

  try {
        console.log(req.body)
    const { name, email, phone }= req.body
    
    // for validation the input 
    if(!name || !email || !phone ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }

    // for checking existing user
    const existingUser = await User.findOne({
        $or : [
            {email},
            {phone}
        ]
    })


    if(existingUser){
        return res.status(409).json({
            success: false,
            message: "Email or phone already registered"
        })
    }

    // for generatingh the otp 
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    console.log("Generated OTP:",otp)

    // the hash otp 
    const otpHash = await bcrypt.hash(otp,10)

    //for otp expiry
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000)

    //for creating the user
    const user = await User.create({
        name,
        email,
        phone,
        otpHash,
        otpExpiresAt,
        otpPurpose:"REGISTER"
    })

    await sendEmail(
        email,
        "verify your Email",
        `
        <h2>Email verification</h2>
        <p>Hello ${name},</p>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>

        `
    )

    res.status(201).json({
        success: true,
        message: "User Registerd Successfully",
        data : {
            id: user._id,
            email:user.email
        }
    })

    console.log("email sent successfully")

  } catch (error) {

    console.error(error)
    res.status(500).json({
        success:false,
        message: "internal server error"
    })  

  }

}


const verifyOtp = async (req, res) => {
    try {
        const {email,otp}= req.body;

        if(!email || !otp){
            return res.status(400).json({
                success:false,
                message:"Email and OTP are required"
            })
        }

        const user = await User.findOne({ email})

        if(!user){
            return res.status(404).json({
                success: false,
                message:"user not found ",
            })
        }

        if(user.otpExpiresAt < new Date()){
            return res.status(400).json({
                success:false,
                message:"OTP has expired"
            })
        }

        const isOtpValid = await bcrypt.compare(otp, user.otpHash)

        if(!isOtpValid){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }

        user.isVerified = true
        user.otpHash = undefined
        user.otpExpiresAt = undefined
        user.otpPurpose = undefined 

        await user.save()

        return res.status(200).json({
            success: true,
            message:"Email verified successfully"
        })


    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


const setPassword = async (req, res) =>{

    try {

        const {email, password} = req.body

        if (!email || !password){
            return res.status(400).json({
                sucess:false,
                message: "Email and password are required"
            })
        }

        const user = await User.findOne({email})

        if(!user) {
            return res.status(404).json({
                success:false,
                message: "User not found"
            })
        }

        if (!user.isVerified){
            return res.status(400).json({
                success:false,
                message:"Please verify your email first"
            })
        }

        if(user.password){
            return res.status(400).json({
                success: false,
                message:"Password already set"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10)

        user.password = hashedPassword;

        await user.save()
        return res.status(200).json({
            success: true,
            message: "Password set successfully"
        })

    } catch(error) {
        console.error(error)

        return res.status(500).json({
            success:false,
            message:"Internal server Error"
        })
    }

}


const login = async (req,res)=>{
    try{
        const {email, password}= req.body

        if(!email || ! password){
            return res.status(400).json({
                success:false,
                message:"Email and password are required"
            })
        }

        const user = await User.findOne({email})

        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }

        if(!user.isVerified){
            return res.status(400).json({
                success:false,
                message:"Please verify your email first"
            })
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password 
        )

        if(!isPasswordValid){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials"
            })
        }

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        user.refreshToken = refreshToken;
        await user.save()

       res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

return res.status(200).json({
    success: true,
    message: "Login successfully",
    accessToken,
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
    },
});

    }catch (error) {
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"internal server error"
        })
    }
}

const getProfile = async (req, res)=>{
    try{
        return res.status(200).json({
            success: true,
            user:{
                id:req.user._id,
                name: req.user.name,
                email: req.user.email,
                phone: req.user.phone,
                isVerified: req.user.isVerified,
            }
        })
    }catch (error){
        console.error(error)

        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token missing",
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token",
            });
        }

        const accessToken = generateAccessToken(user);

        return res.status(200).json({
            success: true,
            accessToken,
        });

    } catch (error) {
        console.error(error);

        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired refresh token",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

const logout = async (req, res) => {
    try {
        // Read refresh token from cookie
        const refreshToken = req.cookies.refreshToken;

        // If cookie doesn't exist, user is already logged out
        if (!refreshToken) {
            return res.status(200).json({
                success: true,
                message: "Logged out successfully",
            });
        }

        // Find user by refresh token
        const user = await User.findOne({ refreshToken });

        // Remove refresh token from database
        if (user) {
            user.refreshToken = undefined;
            await user.save();
        }

        // Clear cookie from browser
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if already verified
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified",
            });
        }

        // Prevent OTP spam (Optional but Recommended)
        if (
            user.lastOtpSentAt &&
            Date.now() - user.lastOtpSentAt.getTime() < 60 * 1000
        ) {
            return res.status(429).json({
                success: false,
                message: "Please wait 1 minute before requesting another OTP",
            });
        }

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        console.log("New OTP:", otp);

        // Hash OTP
        const otpHash = await bcrypt.hash(otp, 10);

        // Save OTP
        user.otpHash = otpHash;
        user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
        user.otpPurpose = "REGISTER";
        user.lastOtpSentAt = new Date();

        await user.save();

        // Send Email
        await sendEmail(
            user.email,
            "Resend Email Verification OTP",
            `
                <h2>Email Verification</h2>

                <p>Hello <b>${user.name}</b>,</p>

                <p>Your new OTP is:</p>

                <h1>${otp}</h1>

                <p>This OTP is valid for 5 minutes.</p>

                <p>If you didn't request this, please ignore this email.</p>
            `
        );

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Please verify your email first",
            });
        }

        // Prevent OTP spam
        if (
            user.lastOtpSentAt &&
            Date.now() - user.lastOtpSentAt.getTime() < 60 * 1000
        ) {
            return res.status(429).json({
                success: false,
                message: "Please wait 1 minute before requesting another OTP",
            });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        console.log("Forgot Password OTP:", otp);

        // Hash OTP
        const otpHash = await bcrypt.hash(otp, 10);

        // Save OTP
        user.otpHash = otpHash;
        user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
        user.otpPurpose = "FORGOT_PASSWORD";
        user.lastOtpSentAt = new Date();

        await user.save();

        // Send Email
        await sendEmail(
            user.email,
            "Reset Your Password",
            `
            <h2>Password Reset</h2>

            <p>Hello <b>${user.name}</b>,</p>

            <p>Your password reset OTP is:</p>

            <h1>${otp}</h1>

            <p>This OTP is valid for 5 minutes.</p>

            <p>If you did not request a password reset, you can safely ignore this email.</p>
            `
        );

        return res.status(200).json({
            success: true,
            message: "Password reset OTP sent successfully",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const verifyForgotOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate input
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check OTP purpose
        if (user.otpPurpose !== "FORGOT_PASSWORD") {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP request",
            });
        }

        // Check expiry
        if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired",
            });
        }

        // Compare OTP
        const isOtpValid = await bcrypt.compare(
            otp,
            user.otpHash
        );

        if (!isOtpValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Mark OTP as verified
        user.isForgotOtpVerified = true;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if forgot OTP is verified
        if (!user.isForgotOtpVerified) {
            return res.status(400).json({
                success: false,
                message: "Please verify OTP first",
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password
        user.password = hashedPassword;

        // Clear OTP fields
        user.otpHash = undefined;
        user.otpExpiresAt = undefined;
        user.otpPurpose = undefined;

        // Reset verification flag
        user.isForgotOtpVerified = false;

        // Remove refresh token
        user.refreshToken = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. Please login again.",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const sendLoginOtp = async (req, res) => {
    try {
        // Get email from request body
        const { email } = req.body;

        // Validate input
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Please verify your email first",
            });
        }

        // Rate limit (1 minute)
        if (
            user.lastOtpSentAt &&
            Date.now() - user.lastOtpSentAt.getTime() < 60 * 1000
        ) {
            return res.status(429).json({
                success: false,
                message: "Please wait 1 minute before requesting another OTP",
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Save OTP details
        user.otpHash = hashedOtp;
        user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        user.otpPurpose = "LOGIN";
        user.lastOtpSentAt = new Date();

        await user.save();

        // Send OTP Email
        await sendEmail(
            user.email,
            "Login OTP",
            `Your login OTP is ${otp}. It is valid for 5 minutes.`
        );

        return res.status(200).json({
            success: true,
            message: "Login OTP sent successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const verifyLoginOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate input
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check OTP purpose
        if (user.otpPurpose !== "LOGIN") {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP request",
            });
        }

        // Check OTP expiry
        if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired",
            });
        }

        // Compare OTP
        const isOtpValid = await bcrypt.compare(otp, user.otpHash);

        if (!isOtpValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Save refresh token
        user.refreshToken = refreshToken;

        // Clear OTP fields
        user.otpHash = undefined;
        user.otpExpiresAt = undefined;
        user.otpPurpose = undefined;

        await user.save();

        // Send refresh token in cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const sendPhoneLoginOtp = async (req, res) => {
    try {
        const { phone } = req.body;

        // Validate phone
        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required",
            });
        }

        console.log("phone from request",phone)
        // Find user
        const user = await User.findOne({ phone });

        console.log("user", user)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Rate limit (1 minute)
        if (
            user.lastOtpSentAt &&
            Date.now() - user.lastOtpSentAt.getTime() < 60 * 1000
        ) {
            return res.status(429).json({
                success: false,
                message: "Please wait 1 minute before requesting another OTP",
            });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Save OTP details
        user.otpHash = hashedOtp;
        user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        user.otpPurpose = "LOGIN";
        user.lastOtpSentAt = new Date();

        await user.save();

        // Send SMS
        const phoneNumber = `+91${user.phone}`

        console.log("Sending SMS to:", phoneNumber)

        await sendSms(
            phoneNumber,
            `Your login OTP is ${otp}. It is valid for 5 minutes.`
        );

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully to your phone",
        });

    } catch (error) {
        console.error("Send Phone OTP Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


const verifyPhoneLoginOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        // Validate input
        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                message: "Phone number and OTP are required",
            });
        }

        // Find user
        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check OTP purpose
        if (user.otpPurpose !== "LOGIN") {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP request",
            });
        }

        // Check OTP expiry
        if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired",
            });
        }

        // Compare OTP
        const isOtpValid = await bcrypt.compare(otp, user.otpHash);

        if (!isOtpValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Generate Tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Save Refresh Token
        user.refreshToken = refreshToken;

        // Clear OTP Fields
        user.otpHash = undefined;
        user.otpExpiresAt = undefined;
        user.otpPurpose = undefined;

        await user.save();

        // Send Refresh Token in Cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });

    } catch (error) {
        console.error("Verify Phone OTP Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


// const testSms = async (req, res) => {
//     try {
//         await sendSms(
//             "+919315262520", // Replace with your verified phone number
//             "Hello Kunal! Twilio is working successfully."
//         );

//         return res.status(200).json({
//             success: true,
//             message: "SMS sent successfully",
//         });
//     } catch (error) {
//         console.error(error);

//         return res.status(500).json({
//             success: false,
//             message: "Failed to send SMS",
//         });
//     }
// };

module.exports = {
    register,
    verifyOtp,
    setPassword,
    login,
    getProfile,
    refreshAccessToken,
    logout,
    resendOtp,
    forgotPassword,
    verifyForgotOtp,
    resetPassword,
    sendLoginOtp,
    verifyLoginOtp,
    sendPhoneLoginOtp,
    verifyPhoneLoginOtp,
    
}