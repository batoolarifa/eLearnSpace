import { Response } from "express";
import CourseModel from "../models/course.model";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { redis } from "../utils/redis";

// create course

export const createCourse =  CatchAsyncError(async( data: any , res: Response) => {
    const course = await CourseModel.create(data);

     await redis.del("allCourses");


    res.status(201).json({
        success: true,
        course
    });

})


// get all courses for admin only
export const getAllCoursesService = async(res: Response) => {
  const courses = await CourseModel.find().sort({createdAt: -1});

  res.status(201).json({
    success: true,
    courses
  });

};