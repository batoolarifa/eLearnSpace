"use client";

import React, { FC, useEffect, useState } from "react";
import SideBarProfile from "./SideBarProfile";
import { useLogoutQuery } from "../../../redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import CourseCard from "../Course/CourseCard";
import { useGetUserAllCoursesQuery } from "../../../redux/features/courses/coursesApi";


type Props = {
  user: any;
};

const Profile: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [active, setActive] = useState(1);
  const [logout, setLogout] = useState(false);
  const [courses, setCourses] = useState([]);

  const {data, isLoading} = useGetUserAllCoursesQuery(undefined, {});
  

  useLogoutQuery(undefined, {
    skip: !logout,
  });

  const logoutHandler = async () => {
    setLogout(true);
    await signOut();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 85);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  useEffect(() => {
    if(data) {
      const filteredCourses = user.courses
            .map((userCourse: any) => 
                data.courses.find((course: any) =>  course._id === userCourse._id)
            )

            .filter((course: any) => course != undefined);
            setCourses(filteredCourses);
    }


  },[data]);

  return (
    <div className="mx-auto w-[92%] py-8 800:w-[85%] 800:py-0">
      <div className="flex flex-col gap-6 800:flex-row 800:items-start 800:gap-8">
        {/* Sidebar */}
        <div
          className={`
            w-full rounded-xl border border-emerald-100 bg-white bg-opacity-90
            shadow-sm dark:border-slate-800 dark:bg-slate-900
            800:sticky 800:w-[280px] 800:mt-[80px] 800:mb-[80px]
            ${scroll ? "800:top-[100px]" : "800:top-[30px]"}
          `}
        >
          <SideBarProfile
            user={user}
            active={active}
            avatar={avatar}
            setActive={setActive}
            logoutHandler={logoutHandler}
          />
        </div>

        {/* Content */}
        <div className="w-full 800:mt-[80px] 800:mb-[80px]">
          {active === 1 && <ProfileInfo avatar={avatar} user={user} />}
          {active === 2 &&   <ChangePassword /> }

           {active === 3 && (  
            <> 
            {   isLoading ? ( 
              <div className="flex min-h-[300px] items-center justify-center"> 
                <p className="text-sm text-gray-500 dark:text-gray-400">
                        Loading your courses...  
                        </p> 
                  </div> ) 
                  : 
                  
                  courses.length > 0 
                  ? 
                  ( 
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"> 
                  {courses.map( (item: any, index: number) => ( 
                    <CourseCard item={item} key={item._id || index} isProfile={true} />
                     ) 
                     )} 
                     </div> 
                    ) :
                     ( <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-emerald-100 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"> 
                     <h3 className="text-lg font-semibold text-slate-900 dark:text-white"> No courses purchased </h3> 
                     <p className="mt-2 text-sm text-gray-500 dark:text-gray-400"> You haven&apos;t purchased or enrolled in any courses yet. </p> </div> )} </> )}
          
        </div>
      </div>
    </div>
  );
};

export default Profile;