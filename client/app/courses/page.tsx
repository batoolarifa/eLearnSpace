"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useSearchParams, useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { useGetUserAllCoursesQuery } from "../../redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "../../redux/features/layout/layoutApi";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import CourseCard from "../components/Course/CourseCard";
import Footer from "../components/Footer";

export default function Page() {
  const { theme } = useTheme();

  const router = useRouter();
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();


  const {data, isLoading} = useGetUserAllCoursesQuery(undefined, {});
  const {data: categoriesData} = useGetHeroDataQuery("Categories", {});


  const[route, setRoute] = useState("Login") 
  const[open, setOpen] = useState(false);   
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState("All");


  useEffect(() => {
  const timer = setTimeout(() => {
    const params = new URLSearchParams(searchParams?.toString());

    if (search.trim()) {
      params.set("title", search);
    } else {
      params.delete("title");
    }

    router.replace(`/courses?${params.toString()}`, {
      scroll: false,
    });
  }, 300);

  return () => clearTimeout(timer);
}, [search, router, searchParams]);



  useEffect(() => {

     document.title = "Courses • eLearnSpace";

    if(category === "All"){
        setCourses(data?.courses);
    }

     if(category !== "All"){
        setCourses(
            data?.courses.filter((item:any) => item.categories === category)
        );
    }

    if(search) {
        setCourses(
            data?.courses.filter((item:any) => item.name.toLowerCase().includes(search.toLowerCase()))
        );
    }

  }, [data, category, search])
  
  const handleSearch = () => {
      if(search === "") {
        return
      } else {
        router.push(`/courses?title=${search}`);
      }
    };

  const categories = categoriesData?.layout.categories;

  if (isLoading) {
  return <Loader />; 
}

  return (

    <>

      <Header
      open={open}
      setOpen={setOpen}
      activeItem={1}
      setRoute={setRoute}
      route={route}
    />
    <div className="relative min-h-screen overflow-hidden">

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

  <div className="relative max-w-7xl mx-auto px-6 py-20">

      <div className="text-center mb-14">

    <p className="font-poppins uppercase tracking-[0.3em] text-sm font-semibold text-emerald-600 dark:text-emerald-400">
        Explore Courses
    </p>

    <h1
        className="
            mt-4
            font-poppins
            text-4xl
            800:text-5xl
            font-bold
            leading-tight
            text-slate-900
            dark:text-white
        "
    >
        Find Your Next
        <span className="text-emerald-600">
            {" "}Skill
        </span>
    </h1>

    <p
        className="
            mt-5
            max-w-2xl
            mx-auto
            font-poppins
            text-lg
            leading-8
            text-slate-600
            dark:text-slate-300
        "
    >
        Discover programming, AI, Machine Learning and Web Development
        courses taught by experienced instructors.
    </p>

</div>





 <div className="max-w-3xl mx-auto px-2">

  <div
    className="
      flex
      items-center
      rounded-2xl
      border
      border-white/40
      dark:border-white/10
      bg-white/80
      dark:bg-slate-900/60
      backdrop-blur-xl
      shadow-2xl
      overflow-hidden
    "
  >

    <div className="px-3 sm:px-5 text-gray-400">
      <FiSearch size={20} />
    </div>

    <input
      value={search || ""}
      onChange={(e) => setSearch(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSearch();
        }
      }}
      placeholder="Search courses..."
      className="
        flex-1
        h-[52px]
        sm:h-[58px]
        bg-transparent
        outline-none
        text-[14px]
        sm:text-[15px]
        text-black
        dark:text-white
        placeholder:text-gray-400
      "
    />

    <button
      onClick={handleSearch}
      className="
        mr-2
        h-[38px]
        sm:h-[44px]
        px-3
        sm:px-6
        rounded-lg
        bg-emerald-600
        hover:bg-emerald-700
        transition
        text-sm
        sm:text-base
        font-semibold
        text-white
        whitespace-nowrap
      "
    >
      Search
    </button>

  </div>

</div>


{/* Categories */}
<div className="mt-12 flex flex-wrap items-center justify-center gap-3">

  <button
    onClick={() => setCategory("All")}
    className={`
      px-5
      py-2.5
      rounded-full
      font-poppins
      text-sm
      font-medium
      transition-all
      duration-300
      ${
        category === "All"
          ? "bg-emerald-600 text-white shadow-lg"
          : "bg-white/80 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-slate-800"
      }
    `}
  >
    All
  </button>

  {categories?.map((item: any, index: number) => (
    <button
      key={index}
      onClick={() => setCategory(item.title)}
      className={`
        px-5
        py-2.5
        rounded-full
        font-poppins
        text-sm
        font-medium
        transition-all
        duration-300
        ${
          category === item.title
            ? "bg-emerald-600 text-white shadow-lg"
            : "bg-white/80 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-slate-800"
        }
      `}
    >
      {item.title}
    </button>
  ))}

</div>


<div className="mt-14">

  {courses && courses.length > 0 ? (

    <div className="grid grid-cols-1 800:grid-cols-2 1100:grid-cols-3 gap-8">
      {courses.map((item: any, index: number) => (
        <CourseCard  
          key={index}
          item={item}
        />
      ))}
    </div>

  ) : (

    <div className="py-24 text-center">

      <h2 className="font-poppins text-3xl font-bold text-slate-900 dark:text-white">
        {search
          ? "No courses found"
          : category === "All"
          ? "No courses available"
          : "No courses found in this category"}
      </h2>

      <p className="mt-4 max-w-xl mx-auto font-poppins text-slate-600 dark:text-slate-400 leading-7">
        {search
          ? `No courses found for "${search}". Try another keyword.`
          : category === "All"
          ? "There are currently no courses available."
          : "There are no courses in this category yet. Please try another category."}
      </p>

    </div>

  )}

</div>




  </div>

  <Footer />

</div>

</>


  );
}
