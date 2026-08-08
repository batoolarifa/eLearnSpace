import { useGetUserAllCoursesQuery } from '../../../redux/features/courses/coursesApi';
import React, { useEffect, useState } from 'react'
import CourseCard from "../Course/CourseCard";

const Courses = () => {

  const {data, isLoading} =  useGetUserAllCoursesQuery({})
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    setCourses(data?.courses);

  }, [data]);


  return (
     <div
      id="featured-courses"
  className="
    relative
    overflow-hidden
    bg-gradient-to-b
    from-emerald-50
    via-white
    to-cyan-50
    py-24
    dark:from-slate-950
    dark:via-slate-900
    dark:to-slate-950
  "
>
  {/* Decorative Blur */}
  <div className="absolute left-0 top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/10" />

  <div className="absolute right-0 bottom-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/10" />

  <div className="relative w-[90%] 800:w-[80%] mx-auto">
    <h1 className="text-center font-poppins text-[25px] font-bold leading-[35px] tracking-tight text-slate-900 sm:text-3xl lg:text-5xl dark:text-white 800:leading-[60px]">
      Expand Your Career{" "}
      <span className="text-emerald-600 dark:text-emerald-400">
        Opportunities
      </span>
      <br />
      With Our Courses
    </h1>

    <p className="mx-auto mt-6 max-w-3xl text-center text-base leading-8 text-slate-600 dark:text-slate-300">
      Discover expert-led courses designed to help you master modern
      technologies, build real-world projects, and advance your career.
    </p>
 
   
   <div
  className="
    mt-16
    grid
    grid-cols-1
    gap-8
    md:grid-cols-2
    xl:grid-cols-3
    1500:grid-cols-4
    mb-12
  "
>
  { courses &&
  
  courses.map((item: any, index: number) => (
    <CourseCard
      key={index}
      item={item}
    />

    
  ))}
</div>
    

  </div>
</div>
  )
}

export default Courses
