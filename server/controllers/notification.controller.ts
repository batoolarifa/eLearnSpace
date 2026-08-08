import notificationModel from "../models/notification.model";
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cron from "node-cron";


// get all notfications only for admin
export const getAllNotifications = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const notifications = await notificationModel.find().sort({createdAt: -1});

        res.status(201).json({
            success: true,
            notifications
        })
  } catch (error: any) {
     return next(new ErrorHandler(error.message, 500));
  }
})


// update notification status only for admin

export const updateNotification = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const notfication = await notificationModel.findById(req.params.id);
        if(!notfication) {
            return next(new ErrorHandler("Notification not found", 404));
       
        } else {
            notfication.status ? notfication.status = 'read' : notfication?.status;

        }

        await notfication.save()

        const notifications = await notificationModel.find().sort({ createdAt: -1});
        
        res.status(201).json({
            success: true,
            notifications
        });

  } catch (error: any) {
     return next(new ErrorHandler(error.message, 500));
  }
})


// delete notifications only admin

cron.schedule("0 0 0 * * *", async() => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    await notificationModel.deleteMany({status: "read", createdAt: {$lt: thirtyDaysAgo}});
    console.log("Deleted read notifications");
});
