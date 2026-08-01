const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");

const app = express();
const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);
// app.use(helmet());

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const corsOptions = {
  origin: CLIENT_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.use("/api/auth", authRoutes);

module.exports = app;