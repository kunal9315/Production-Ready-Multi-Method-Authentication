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

let cached = global.mongooseCache;
if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (!cached.promise) {
    console.log("Connecting to MongoDB...", process.env.MONGODB_URI);
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        family: 4,
      })
      .then((connection) => {
        console.log("MongoDB Connected:", connection.connection.host);
        return connection;
      })
      .catch((error) => {
        cached.promise = null;
        console.error("MongoDB Connection Error:");
        console.error(error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;