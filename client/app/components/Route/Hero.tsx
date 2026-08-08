"use client";

import Image from "next/image";
import heroImage from "../../../public/assets/lms-1.png";
import { useGetHeroDataQuery } from "../../../redux/features/layout/layoutApi";
import Loader from "../Loader/Loader";
import Link from "next/link";

export default function Hero() {
   const { data, refetch, isLoading } = useGetHeroDataQuery("Banner", {
    });

    const scrollToCourses = () => {
      document
        .getElementById("featured-courses")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

      window.history.replaceState({}, "", window.location.pathname);
    };

    
  
  return (
     <>
     {
      isLoading ? ( 
        <Loader />
       ) : (

      <section className="relative overflow-hidden">
      {/* Animated Background */}
      <div
        className="
          absolute inset-0 -z-10
          animate-[heroBackgroundFade_10s_ease-in-out_infinite]
          bg-gradient-to-br
          from-emerald-50
          via-white
          to-cyan-100
          dark:from-slate-950
          dark:via-slate-900
          dark:to-emerald-950
        "
      />

      {/* Decorative Blobs */}
      <div
        className="
          absolute
          top-10
          left-0
          h-56
          w-56
          rounded-full
          bg-emerald-400/20
          blur-3xl
          800:h-72
          800:w-72
          dark:bg-emerald-500/15
        "
      />

      <div
        className="
          absolute
          bottom-0
          right-0
          h-64
          w-64
          rounded-full
          bg-cyan-300/20
          blur-3xl
          800:h-96
          800:w-96
          dark:bg-cyan-600/15
        "
      />

      {/* Content */}
      <div
        className="
          mx-auto
          flex
          min-h-[90vh]
          max-w-7xl
          items-center
          justify-between
          gap-12
          px-6
          py-16
        "
      >
        {/* Left Side */}
        <div
          className="
            w-full
            text-center
            1000:w-1/2
            1000:text-left
          "
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
            Learn • Build • Grow
          </p>

          <h1 className="text-4xl font-bold leading-tight text-slate-900 400:text-5xl 800:text-6xl dark:text-white">
              {data?.layout?.banner?.title || "Learn New Skills with eLearnSpace"}
            <span className="text-emerald-600 dark:text-emerald-400">
              {" "}
              eLearnSpace
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-600 800:text-lg 1000:mx-0 dark:text-slate-300">
              {data?.layout?.banner?.subTitle ||
    "Master web development, AI, machine learning, programming, and modern technologies with expert instructors and hands-on projects."}
          </p>

          <div
            className="
              mt-10
              flex
              flex-col
              gap-4
              400:flex-row
              400:justify-center
              1000:justify-start
            "
          >
            <button className="rounded-xl bg-emerald-600 px-8 py-3 font-semibold text-white transition duration-300 hover:bg-emerald-700"
            onClick={() => {
           scrollToCourses();
      }}
            >
              Explore Courses
            </button>
            
            
             <Link href="/courses"
              className="rounded-xl border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-800 transition duration-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800">
              
              View Categories
            
            </Link>
          </div>
        </div>

        {/* Right Side Image */}
        <div
          className="
            hidden
            1000:flex
            1000:w-1/2
            justify-center
            items-center
          "
        >
          <Image
            src={data?.layout?.banner?.image?.url || heroImage}
            alt="eLearnSpace Hero"
            priority
            width={560}
            height={560}
            className="
              h-auto
              w-full
              max-w-[320px]
              1100:max-w-[380px]
              1200:max-w-[450px]
              1300:max-w-[520px]
              1500:max-w-[580px]
              object-contain
              drop-shadow-2xl
              rounded-lg

            "
          />
        </div>
      </div>


      <div
  className="
    absolute
    bottom-0
    left-0
    h-32
    w-full
    bg-gradient-to-b
    from-transparent
    via-emerald-50/70
    to-emerald-50
    dark:via-slate-950/70
    dark:to-slate-950
    pointer-events-none
  "
/>
    </section>
     )
    }
     </>

  );
}