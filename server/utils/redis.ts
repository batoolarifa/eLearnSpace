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