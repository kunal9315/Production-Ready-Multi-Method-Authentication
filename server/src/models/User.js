const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

  //    isPhoneVerified: {
  //   type: Boolean,
  //   default: false,
  // },


    otpHash: {
      type: String,
      default: null,
    },
    isForgotOtpVerified: {
    type: Boolean,
    default: false,
},

    otpExpiresAt: {
      type: Date,
      default: null,
    },

    otpPurpose: {
      type: String,
      enum: ["REGISTER", "LOGIN", "FORGOT_PASSWORD","RESET_PASSWORD"],
      default: null,
    },

    otpAttempts: {
      type: Number,
      default: 0,
    },

    lastOtpSentAt: {
      type: Date,
      default: null,
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);