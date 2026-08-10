const dns = require("dns"); dns.setServers(["1.1.1.1", "8.8.8.8"]);


import mongoose from "mongoose";
require('dotenv').config();

// const dbUrl: string = process.env.DB_URL  || '';


// const connectDB = async () => {
//     try {
//         await mongoose.connect(dbUrl).then((data: any) => {
//             console.log(`Database connected with ${data.connection.host}`)
//         })
//     } catch (error: any) {
//         console.log(error.message);
//         setTimeout(connectDB, 5000);
        

        
//     }
// }


// export default connectDB





const MONGODB_URI = process.env.DB_URL;

if (!MONGODB_URI) {
  throw new Error("Please define DB_URL environment variable");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log("Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("Creating new MongoDB connection...");

    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log(
          `MongoDB connected: ${mongoose.connection.host}`
        );

        return mongoose;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
};

export default connectDB;