// const dns = require("dns"); dns.setServers(["1.1.1.1", "8.8.8.8"]);


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



const dbUrl = process.env.DB_URL;

if (!dbUrl) {
  throw new Error("DB_URL is missing");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

const connectDB = async (): Promise<typeof mongoose> => {
  if (cached.conn) {
    console.log("Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("Creating new MongoDB connection...");

    cached.promise = mongoose
      .connect(dbUrl, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log(
          `Database connected with ${mongooseInstance.connection.host}`
        );

        return mongooseInstance;
      })
      .catch((error) => {
        console.error("MongoDB connection failed:", error.message);

        cached.promise = null;

        throw error;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
};

export default connectDB;
