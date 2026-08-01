require("dotenv").config();

const app = require("./app");
const connectDB = require("./database/db");

connectDB().catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
});

module.exports = app;


