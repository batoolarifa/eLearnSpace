


"use client";

import {
  Target,
  Eye,
 ArrowRight,
  Users,
  Award,
  Rocket,
  CheckCircle2,
  Heart,
  Lightbulb,
  BookOpen
} from "lucide-react";








import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../Header";
import Footer from "../Footer";

const values = [
  {
    icon: Target,
    title: "Outcome-Driven",
    description:
      "Every course is built around real skills employers actually look for, not just theory.",
  },
  {
    icon: Heart,
    title: "Learner First",
    description:
      "We design around how people actually learn at their pace, on their schedule.",
  },
  {
    icon: Lightbulb,
    title: "Practical by Design",
    description:
      "Hands-on projects and real-world case studies, not just passive video watching.",
  },
  {
    icon: Rocket,
    title: "Career Focused",
    description:
      "From certificates to portfolio projects, everything ties back to your next opportunity.",
  },
];

const About = () => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);


  const stats = [
    { icon: Users, value: "10K+", label: "Active Students" },
    { icon: BookOpen, value: "150+", label: "Curated Courses" },
    { icon: Award, value: "50+", label: "Industry Experts" },
    { icon: Rocket, value: "95%", label: "Satisfaction Rate" },
  ];

  const keyHighlights = [
    "Career-focused, modern curriculum",
    "Production-ready portfolio projects",
    "Lifetime access with regular updates",
    "Interactive code reviews & support",
  ];

  useEffect(() => {
    document.title = "About • eLearnSpace";
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={2}
        route={route}
        setRoute={setRoute}
      />

      <div className="relative overflow-hidden pt-10">
        {/* Decorative Background Glows */}
        <div className="pointer-events-none absolute left-0 top-10 -z-10 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/10" />
        <div className="pointer-events-none absolute right-0 top-1/3 -z-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/10" />

        {/* MISSION & VISION SECTION — now the page opener */}
        <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-16">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-8 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/50 md:p-14">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Our Mission & Vision
                </span>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                  Practical Education Designed For{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Real Impact
                  </span>
                </h2>

                <p className="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  We founded eLearnSpace to remove fluff from technical
                  education. Instead of memorizing synthetic algorithms, our
                  students solve modern engineering problems using
                  industry-standard tools and workflows.
                </p>

                <div className="mt-8 space-y-4">
                  {keyHighlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/courses"
                  className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg dark:shadow-emerald-900/20"
                >
                  Explore Courses
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Mission & Vision Mini-Cards */}
              <div className="grid gap-6">
                <div className="group rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700 dark:hover:shadow-emerald-900/20">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Our Mission
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Skill Transformation
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    To equip learners worldwide with industry-aligned
                    software capabilities that turn technical knowledge into
                    tangible career opportunities.
                  </p>
                </div>

                <div className="group rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700 dark:hover:shadow-emerald-900/20">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400">
                      <Eye className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Our Vision
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Global Tech Ecosystem
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    To serve as a premier ecosystem where engineers master
                    modern paradigms and innovate with confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
       

         <section className="relative border-y border-emerald-100 bg-white py-10 sm:py-12 dark:border-slate-800 dark:bg-slate-950">
         <div className="mx-auto grid w-[90%] max-w-5xl grid-cols-2 gap-6 800:w-[80%] sm:gap-8 lg:grid-cols-4">
           {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 sm:h-12 sm:w-12 dark:bg-emerald-900/40 dark:text-emerald-400">
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <span className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">
                {stat.value}
              </span>
              <span className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="relative overflow-hidden bg-emerald-50/40 py-16 sm:py-20 lg:py-24 dark:bg-slate-900/40">
        <div className="mx-auto w-[90%] max-w-6xl text-center 800:w-[80%]">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold text-emerald-700 sm:text-sm dark:bg-emerald-900/40 dark:text-emerald-400">
            What We Stand For
          </span>

          <h2 className="mt-4 font-poppins text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-4xl dark:text-white">
            Our Core{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              Values
            </span>
          </h2>
        </div>

        <div className="mx-auto mt-12 grid w-[90%] max-w-6xl grid-cols-1 gap-5 800:w-[80%] sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="
                rounded-2xl border border-emerald-100 bg-white p-6
                shadow-sm transition-all duration-300
                hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100
                dark:border-slate-800 dark:bg-slate-900
                dark:hover:border-emerald-700 dark:hover:shadow-emerald-900/20
              "
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                <value.icon className="h-5 w-5" />
              </span>

              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                {value.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>
       
      </div>

      <Footer />
    </div>
  );
};

export default About;




