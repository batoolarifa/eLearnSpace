// const dns = require("dns"); 
// dns.setServers(["1.1.1.1", "8.8.8.8"]);


import mongoose from "mongoose";
require('dotenv').config();



console.log("===== DB.TS LOADED =====");

const dbUrl = process.env.DB_URL;

const connectDB = async () => {
  try {
    if (!dbUrl) {
      throw new Error("DB_URL is not defined");
    }

    const connection = await mongoose.connect(dbUrl);

    console.log(
      `Database connected with ${connection.connection.host}`
    );
  } catch (error: any) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;


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



