import dotenv from "dotenv";
dotenv.config();

import http from "http"
import { app } from "./app";
import connectDB from "./utils/db";
import { v2 as cloudinary} from "cloudinary";
import { intialSocketServer } from "./socketServer";



const server = http.createServer(app);


const PORT = process.env.PORT || 8000;


// cloudinary config

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});


intialSocketServer(server);


connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Server startup failed:", error);
    process.exit(1);
  });

// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   connectDB();
// });