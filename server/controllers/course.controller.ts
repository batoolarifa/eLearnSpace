import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service";
import CourseModel from "../models/course.model";
import {redis} from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import notificationModel from "../models/notification.model";
import { getAllCoursesService } from "../services/course.service";
import axios from "axios";

// upload course


export const uploadCourse = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
  try {

    const data = req.body;

    const thumbnail = data.thumbnail;
    if(thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
            folder:"courses"
        });
        
        data.thumbnail = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }


    createCourse(data, res, next);

  } catch (error: any) {
     return next(new ErrorHandler(error.message, 500));
  }
})


// edit course

export const editCourse = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
     try {
        
        const data = req.body;
        const thumbnail =  data.thumbnail;

        const courseId = req.params.id;

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }


        if(thumbnail  && thumbnail.startsWith("data:")) {

            const publicId = (course.thumbnail as { public_id?: string }).public_id;
            if (publicId) {
                await cloudinary.v2.uploader.destroy(publicId);
            }

            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses"

            });

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url

            };
        }

        const updatedCourse = await CourseModel.findByIdAndUpdate(courseId,{
                $set: data
            },  
            
            {
                new: true
            });

        res.status(200).json({
                success: true,
                updatedCourse,
            })

  } catch (error: any) {
     return next(new ErrorHandler(error.message, 500));
  }
});



// get single course without purchase

export const getSingleCourse = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {

        const courseId = req.params.id as string;

        const isCacheExist = await redis.get(courseId);


        if(isCacheExist){
            const course = JSON.parse(isCacheExist);
            res.status(200).json({
            success: true,
            course
        });
            
        }
        else {

            const course = await CourseModel.findById(courseId).select(
            "-courseData.videoUrl  -courseData.suggestion  -courseData.questions  -courseData.links"
            );

            if (!course) {
                return next(new ErrorHandler("Course not found", 404));
            }

            
            await redis.set(courseId, JSON.stringify(course), 'EX', 604800);


            res.status(200).json({
                success: true,
                course
            });
            
        }

  } catch (error: any) {
     return next(new ErrorHandler(error.message, 500));
  }
})




// get all courses without purchase

export const getAllCourse = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {

        const isCacheExist = await redis.get("allCourses");

        if(isCacheExist){

            const courses = JSON.parse(isCacheExist);
            
            res.status(200).json({
            success: true,
            courses
        });
            

        }

        else {
               

            const courses = await CourseModel.find().select(
            "-courseData.videoUrl  -courseData.suggestion  -courseData.questions  -courseData.links"
        );

            if (!courses) {
                return next(new ErrorHandler("No courses are found", 404));
            }

            await redis.set("allCourses", JSON.stringify(courses));

           
            res.status(200).json({
                success: true,
                courses
            });
            }

        
        
  } catch (error: any) {
     return next(new ErrorHandler(error.message, 500));
  }
})


// get course content purchased only

export const getCourseByUser = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    
try {
    const userCourseList = req.user?.courses;
    const courseId = req.params.id;


    const courseExists = userCourseList?.find((course: any) => course._id.toString() === courseId);
    if (!courseExists){
        return next(new ErrorHandler("You are not eligible to access this course", 404));
    }

    const course = await CourseModel.findById(courseId);

    const content = course?.courseData;

    res.status(200).json({
        success:true,
        content
    });

    
  } catch (error: any) {
     return next(new ErrorHandler(error.message, 500));
  }
})




// add question in course

interface IAddQuestionData {
    question: string;
    courseId: string;
    contentId: string
}


export const addQuestion = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    
try {

     const  {question, courseId, contentId} : IAddQuestionData = req.body;

     
     const course = await CourseModel.findById(courseId);

     if(!mongoose.Types.ObjectId.isValid(contentId)){
         return next(new ErrorHandler("Invalid content id", 400));

     }

     const courseContent = course?.courseData.find((item: any) => item._id.equals(contentId));

      if(!courseContent){
         return next(new ErrorHandler("Invalid content id", 400));

     }

     // create  question object 

     const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: []
     };


     // add question object to course content

     courseContent.questions.push(newQuestion);

     await notificationModel.create({
        userId: req.user?._id,
        title: "New Question Received",
        message:`You have a new question in ${courseContent.title}`,
    })


     // save
     await course?.save()

     res.status(201).json({
        success: true,
        course
     });


  } catch (error: any) {
     return next(new ErrorHandler(error.message, 500));
  }
})



// add answer in course questions

interface IAnswerData {
    answer: string;
    courseId: string;
    contentId: string;
    questionId: string
}

export const addAnswer = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    
try {

    const {answer, courseId, contentId, questionId} : IAnswerData =  req.body;

    const course = await CourseModel.findById(courseId);

     if(!mongoose.Types.ObjectId.isValid(contentId)){
         return next(new ErrorHandler("Invalid content id", 400));

     }

     const courseContent = course?.courseData.find((item: any) => item._id.equals(contentId));

     if(!courseContent){
         return next(new ErrorHandler("Invalid content id", 400));

     }

     // search question
     const question = await courseContent?.questions?.find((item: any) => item._id.equals(questionId));

     if(!question){
          return next(new ErrorHandler("Question not found", 400));
     }

     // create answer object

     const newAnswer:  any = {
        user: req.user,
        answer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    // add answer to course content
    question.questionReplies?.push(newAnswer);

    await course?.save();

    if(req.user?._id === question.user._id){
        // create a notfication

        await notificationModel.create({
        userId: req.user?._id,
        title: "New Question Reply Received",
        message:`You have a new question reply in ${courseContent.title}`,
    });

    }
    
    else {
        const data = {
            name: question.user.name,
            title:courseContent.title,
        }

        const html = await ejs.renderFile(path.join(__dirname, "../mails/question-reply.ejs"), data);

        try {
             await sendMail({
                email: question.user.email,
                subject: "Question Reply",
                template: "question-reply.ejs",
                data
             });
            
        } catch (error: any) {
             return next(new ErrorHandler(error.message, 500)); 
        }

    }

    res.status(201).json({
        success: true,
        course
    })

    
    
  } catch (error: any) {
     return next(new ErrorHandler(error.message, 500));
  }
})


// add review in course

interface IAddReviewData {
    review: string;
    rating: number;
    userId: string;
}


export const addReview = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    
try {

    const userCourseList = req.user?.courses;
    
   const courseId = req.params.id as string;

    // check if courseId already exists in userCourseList
    const courseExists = userCourseList?.some((course: any) => course._id.toString() === courseId);

    if(!courseExists){
        return next(new ErrorHandler("You are not eligible to access this course", 404));
    }

    const course = await CourseModel.findById(courseId);

    const {review, rating} = req.body as IAddReviewData;

    const reviewData : any = {
        user: req.user,
        comment: review,
        rating: rating,
    };

    course?.reviews.push(reviewData);

    let avg = 0;

    course?.reviews.forEach((review: any) => {
        avg += review.rating;
    });

    if(course){
        course.ratings = avg / course?.reviews.length;
    }

    await course?.save();
    await redis.set(courseId, JSON.stringify(course), 'EX', 604800);

   

    // create notfication


    await notificationModel.create({
        userId: req.user?._id,
        title: "New Review Received",
        message: `${req.user?.name} has given a review on ${course?.name}`,
    });



    res.status(200).json({
        success: true,
        course
    });
    
  } catch (error: any) {
     return next(new ErrorHandler(error.message, 500));
  }
})



// add reply in review

interface IAddReviewData{
    comment: string;
    courseId: string;
    reviewId: string;
}

export const addReplyToReview = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    
try {

    const {comment, courseId, reviewId} = req.body as IAddReviewData;

    const course = await CourseModel.findById(courseId);

    if(!course){
        return next(new ErrorHandler("Course not found", 404));
    }

    const review = course?.reviews?.find((rev: any) => rev._id.toString() ===reviewId);

    if(!review) {
        return next(new ErrorHandler("Review not found", 404));
    }

    const replyData : any = {
        user: req.user,
        comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    if(!review.commentReplies){
        review.commentReplies = [];
    }

    review.commentReplies?.push(replyData);

    await course?.save()

    await redis.set(courseId, JSON.stringify(course), 'EX', 604800);


    res.status(200).json({
        success: true,
        course
    });
   
    
  } catch (error: any) {
     return next(new ErrorHandler(error.message, 500));
  }
})




// get all courses for admin only
export const getAllCourses = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        getAllCoursesService(res);
    }
    catch (error: any) {
        return next(new ErrorHandler(error.message, 400));

    }

});



// delete course adminOnly

export const deleteCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const id = req.params.id as string;

        const course = await CourseModel.findById(id);

        if(!course){
           return next(new ErrorHandler('Course not found', 404));

        }

        await course.deleteOne({id});
        await redis.del(id);


        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        })
    }
    catch (error: any) {
        return next(new ErrorHandler(error.message, 400));

    }

});





// generate video url

export const generateVideoUrl = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
             const {videoId} = req.body;
             const response = await axios.post(
                `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
                { ttl: 300},
                {
                    headers: {
                        Accept:'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
                    },
                }
             );

            res.json(response.data);
    }
    catch (error: any) {
        return next(new ErrorHandler(error.message, 400));

    }

});
