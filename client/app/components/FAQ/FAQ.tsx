"use client";

import { useGetHeroDataQuery } from "../../../redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ = () => {
  const { data, isLoading } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });



  const [questions, setQuestions] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (data?.layout?.faq) {
      setQuestions(data.layout.faq);
    }
  }, [data]);

  const toggleQuestion = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      className="
        relative overflow-hidden
        bg-gradient-to-b from-white via-emerald-50/40 to-white
        py-24
        dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
      "
    >
      <div className="absolute left-0 top-10 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/10" />
      <div className="absolute right-0 bottom-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/10" />

      <div className="relative mx-auto w-[90%] max-w-4xl 800:w-[80%]">
        {/* Heading */}
        <div className="text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
            FAQ
          </span>

          <h2 className="mt-4 font-poppins text-[26px] font-bold leading-tight text-slate-900 sm:text-3xl lg:text-4xl dark:text-white">
            Frequently Asked{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              Questions
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
            Everything you need to know about ELearnSpace. Can&apos;t find the
            answer you&apos;re looking for? Feel free to reach out to our support
            team.
          </p>
        </div>

        {/* Accordion */}
        <div className="mt-14 space-y-4">
          {isLoading && (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-2xl bg-emerald-100/50 dark:bg-slate-800"
                />
              ))}
            </>
          )}

          {!isLoading && questions?.length === 0 && (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              No questions available right now.
            </p>
          )}

          {!isLoading &&
            questions?.map((item: any) => {
              const isOpen = activeId === item._id;

              return (
                <div
                  key={item._id}
                  className={`
                    overflow-hidden rounded-2xl border bg-white
                    transition-all duration-300
                    dark:bg-slate-900
                    ${
                      isOpen
                        ? "border-emerald-300 shadow-md shadow-emerald-100 dark:border-emerald-700 dark:shadow-emerald-900/10"
                        : "border-slate-200 dark:border-slate-800"
                    }
                  `}
                >
                  <button
                    onClick={() => toggleQuestion(item._id)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`
                          flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full
                          transition-colors duration-300
                          ${
                            isOpen
                              ? "bg-emerald-600 text-white"
                              : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
                          }
                        `}
                      >
                        <HelpCircle className="h-4 w-4" />
                      </span>

                      <span className="font-semibold text-slate-900 dark:text-white">
                        {item.question}
                      </span>
                    </div>

                    <ChevronDown
                      className={`
                        h-5 w-5 flex-shrink-0 text-emerald-600 transition-transform duration-300
                        dark:text-emerald-400
                        ${isOpen ? "rotate-180" : ""}
                      `}
                    />
                  </button>

                  <div
                    className={`
                      grid transition-all duration-300 ease-in-out
                      ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
                    `}
                  >
                    <div className="overflow-hidden">
                      <p className="border-t border-emerald-50 px-6 py-5 pl-[3.75rem] text-sm leading-7 text-slate-600 dark:border-slate-800 dark:text-slate-400">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;