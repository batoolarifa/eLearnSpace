// import {Redis} from 'ioredis';
// require('dotenv').config()

// const redisClient = () => {
//     if(process.env.REDIS_URL){
//         console.log(`Redis connected`);
//         return process.env.REDIS_URL
//     }
//     throw new Error('Redis connecton failed')
// };


// export const redis = new Redis(redisClient());



import { Redis } from "ioredis";

const redisUrl = process.env.REDIS_URL;

console.log("REDIS_URL exists:", !!redisUrl);

if (!redisUrl) {
  throw new Error("REDIS_URL is missing at runtime");
}

export const redis = new Redis(redisUrl);

redis.on("connect", () => {
  console.log("Redis connection established");
});

redis.on("error", (error) => {
  console.error("Redis connection error:", error.message);
});