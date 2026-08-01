require("dotenv").config();

const app = require("../src/app");
const connectDB = require("../src/database/db");

connectDB().catch((err) => {
  console.error(err);
});

module.exports = app;