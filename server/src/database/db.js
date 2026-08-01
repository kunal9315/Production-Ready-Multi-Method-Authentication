// const mongoose = require("mongoose")

// const connectDB = async ()=> {

//     try {
//         const connection = await mongoose.connect(process.env.MONGODB_URI)
//         console.log(`MongoDB connected: ${connection.connection.host}`)
//     }catch (error) {
//         console.error("mongoDB connection error:", error.message)

//         process.exit(1)

//     }

// }

// module.exports = connectDB


const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    console.log("URI Exists:", !!process.env.MONGODB_URI);

    const connection = await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected:", connection.connection.host);
  } catch (error) {
    console.error("MongoDB Connection Error:");
    console.error(error);

    process.exit(1);
  }
};

module.exports = connectDB;