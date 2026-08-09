import express, { Request, Response ,NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import { rateLimit } from 'express-rate-limit'


export const app = express();
app.set("trust proxy", 1);



// body parser
app.use(express.json({ limit: "50mb" }));



// cookie parser
app.use(cookieParser());


// cors
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}));


// api request limit

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100,
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
	ipv6Subnet: 56, 
})





// routes


app.use(limiter)

app.use('/api/v1', userRouter, courseRouter, orderRouter, notificationRouter, analyticsRouter, layoutRouter);

app.get('/test', (req: Request, res: Response, next: NextFunction) => {
    res.status(200)
       .json({
          success: true,
          message: "API is working"
       })
})




// unknown route

app.all(/.*/, (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});


// middleware calls

app.use(ErrorMiddleware);

export default app;