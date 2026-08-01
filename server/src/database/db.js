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

mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    console.log("Connecting to MongoDB...", process.env.MONGODB_URI);

    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      family: 4,
    });

    console.log("MongoDB Connected:", connection.connection.host);
    return connection;
  } catch (error) {
    console.error("MongoDB Connection Error:");
    console.error(error);
    throw error;
  }
};

module.exports = connectDB;