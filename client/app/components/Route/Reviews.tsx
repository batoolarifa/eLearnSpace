import { Star } from "lucide-react";
import ReviewCard from "./ReviewCard";



const Reviews = () => {

  const reviews = [
  {
    rating: 5,
    comment:
      "ELearnSpace completely transformed the way I learn. The practical projects and expert guidance helped me build production-ready applications with confidence.",
    courseName: "Complete MERN Stack Development",
    user: {
      name: "Sarah Johnson",
      avatar: {
        url: "https://i.pravatar.cc/150?img=32",
      },
    },
  },
  {
    rating: 5,
    comment:
      "The React and Next.js course exceeded my expectations. Every lesson was easy to follow, and I landed my first frontend internship shortly after completing it.",
    courseName: "Modern React & Next.js",
    user: {
      name: "Michael Chen",
      avatar: {
        url: "https://i.pravatar.cc/150?img=15",
      },
    },
  },
  {
    rating: 4,
    comment:
      "As someone new to AI, I found the Machine Learning roadmap incredibly beginner-friendly. The projects made difficult concepts easy to understand.",
    courseName: "AI & Machine Learning Bootcamp",
    user: {
      name: "Emily Rodriguez",
      avatar: {
        url: "https://i.pravatar.cc/150?img=47",
      },
    },
  },
  {
    rating: 5,
    comment:
      "The backend development course is fantastic. From Express to MongoDB, every concept was explained clearly with real-world examples.",
    courseName: "Node.js Backend Development",
    user: {
      name: "David Wilson",
      avatar: {
        url: "https://i.pravatar.cc/150?img=11",
      },
    },
  },
  {
    rating: 5,
    comment:
      "ELearnSpace offers one of the best learning experiences I've had online. The instructors are knowledgeable and the content is always up to date.",
    courseName: "Python Programming Masterclass",
    user: {
      name: "Sophia Martinez",
      avatar: {
        url: "https://i.pravatar.cc/150?img=44",
      },
    },
  },
  {
    rating: 4,
    comment:
      "The UI is clean, the learning path is well organized, and the hands-on assignments helped me build a strong portfolio for job applications.",
    courseName: "Frontend Web Development",
    user: {
      name: "James Anderson",
      avatar: {
        url: "https://i.pravatar.cc/150?img=68",
      },
    },
  },
];
  const total = reviews?.length ?? 0;
  const avgRating = total
    ? (reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / total).toFixed(1)
    : "5.0";

  return (
    <section
      className="
        relative overflow-hidden
        bg-gradient-to-b from-emerald-50 via-white to-white
        py-8
        dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
      "
    >
      <div className="absolute left-0 top-10 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/10" />
      <div className="absolute right-0 bottom-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/10" />

      <div className="relative mx-auto w-[90%] max-w-6xl text-center 800:w-[80%]">
        <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
          Testimonials
        </span>

        <h2 className="mt-4 font-poppins text-[26px] font-bold leading-tight text-slate-900 sm:text-3xl lg:text-4xl dark:text-white">
          What Others Say{" "}
          <span className="text-emerald-600 dark:text-emerald-400">
            About Us
          </span>
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
          Don&apos;t just take our word for it  here&apos;s what our students say
          about learning on ELearnSpace, from career switchers to working
          professionals leveling up their skills.
        </p>

        {/* Rating summary */}
        <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-6 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {avgRating}
            <span className="ml-1 text-sm font-medium text-slate-400">
              / 5
            </span>
          </p>
          <span className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {total} reviews
          </p>
        </div>
      </div>

      {/* Review cards grid */}
      <div className="relative mx-auto mt-14 grid w-[90%] max-w-6xl grid-cols-1 gap-6 800:w-[80%] sm:grid-cols-2 lg:grid-cols-3">
        {reviews?.slice(0, 6).map((item: any, index: number) => (
          <ReviewCard key={index} item={item} />
        ))}
      </div>
    </section>
  );
};

export default Reviews;