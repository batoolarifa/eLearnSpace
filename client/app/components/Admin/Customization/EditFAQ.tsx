"use client";

import { useEditLayoutMutation, useGetHeroDataQuery } from '@/redux/features/layout/layoutApi'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useTheme } from "next-themes";
import {
  ChevronDown,
  Plus,
  Trash2,
  HelpCircle,
  Loader2,
} from "lucide-react";
import Loader from "../../../components/Loader/Loader";
import DeleteFaqModal from "./DeleteFaqModal";

const EditFAQ = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data, isLoading, refetch } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isSuccess, error, isLoading: isSaving }] =
    useEditLayoutMutation();

  const [questions, setQuestions] = useState<any[]>([]);
  const [faqToDelete, setFaqToDelete] = useState<{ id: any; index: number; question: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingAction, setPendingAction] = useState<"save" | "delete" | null>(null);

  useEffect(() => {
    if (data) {
      setQuestions(data?.layout?.faq || []);
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      if (pendingAction === "delete") {
        toast.success("Question deleted successfully");
      } else {
        toast.success("FAQ updated successfully");
      }
      refetch(); 
      setFaqToDelete(null);
      setIsDeleting(false);
      setPendingAction(null);
    }

    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message || "Something went wrong.");
      }
      setIsDeleting(false);
      setPendingAction(null);
    }
  }, [isSuccess, error]);

  const toggleQuestions = (id: any) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, active: !q.active } : q))
    );
  };

  const handleQuestionChange = (id: any, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, question: value } : q))
    );
  };

  const handleAnswerChange = (id: any, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, answer: value } : q))
    );
  };

  const newFaqHandler = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        answer: "",
        active: true,
      },
    ]);
  };

  // opens confirmation modal instead of deleting immediately
  const requestDelete = (id: any, index: number, question: string) => {
    setFaqToDelete({ id, index, question });
  };

  // actually persists the delete to the DB right away  doesn't wait for "Save"
  const confirmDelete = async () => {
    if (!faqToDelete) return;

    const remaining = faqToDelete.id
      ? questions.filter((q) => q._id !== faqToDelete.id)
      : questions.filter((_, i) => i !== faqToDelete.index);

    if (!faqToDelete.id) {
      setQuestions(remaining);
      toast.success("Question removed");
      setFaqToDelete(null);
      return;
    }

    setIsDeleting(true);
    setPendingAction("delete");
    await editLayout({
      type: "FAQ",
      faq: remaining.map(({ question, answer }) => ({ question, answer })),
    });
  };

  const areQuestionUnchanged = (originalQuestions: any[], newQuestions: any[]) => {
    return JSON.stringify(originalQuestions) === JSON.stringify(newQuestions);
  };

  const isAnyQuestionEmpty = (questions: any[]) => {
    return questions.some((q) => q.question === "" || q.answer === "");
  };

  const handleEdit = async () => {
    if (
      !areQuestionUnchanged(data?.layout?.faq, questions) &&
      !isAnyQuestionEmpty(questions)
    ) {
      setPendingAction("save");
      await editLayout({
        type: "FAQ",
        faq: questions.map(({ question, answer }) => ({ question, answer })),
      });
    }
  };

  const hasChanges =
    questions.length > 0 &&
    data?.layout?.faq &&
    !areQuestionUnchanged(data.layout.faq, questions);

  const hasEmptyField = isAnyQuestionEmpty(questions);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="relative mx-auto flex h-full w-full max-w-[900px] flex-col gap-6 px-4 py-6 pb-28 sm:px-6 sm:py-8 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[26px] font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Edit FAQ
            </h1>
            <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {questions.length} {questions.length === 1 ? "Question" : "Questions"}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-[#94a3b8]">
            Add, edit, or remove frequently asked questions shown on your site.
          </p>
        </div>
      </div>

      {hasEmptyField && questions.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-600 dark:text-amber-400">
          Every question needs both a question and an answer before saving.
        </div>
      )}

      {/* FAQ List */}
      <div className="flex flex-col gap-4">
        {questions.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-[20px] border border-dashed p-16 text-center"
            style={{
              borderColor: isDark ? "rgba(255,255,255,.12)" : "#e2e8f0",
              backgroundColor: isDark ? "#111827" : "#ffffff",
            }}
          >
            <HelpCircle className="h-8 w-8 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              No FAQs yet. Add your first question below.
            </p>
          </div>
        ) : (
          questions.map((q, index) => (
            <div
              key={q._id || `new-${index}`}
              className="overflow-hidden rounded-[20px] border transition-all duration-200"
              style={{
                backgroundColor: isDark ? "#111827" : "#ffffff",
                borderColor: isDark ? "rgba(255,255,255,.08)" : "#e5e7eb",
                boxShadow: isDark
                  ? "0 1px 2px rgba(0,0,0,.2)"
                  : "0 4px 16px rgba(15,23,42,.04)",
              }}
            >
              {/* Question row */}
              <div className="flex items-center gap-3 p-5">
                <button
                  type="button"
                  onClick={() => toggleQuestions(q._id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800"
                >
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${
                      q.active ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div className="flex flex-1 items-center gap-2 overflow-hidden">
                  <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    Q{index + 1}
                  </span>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(q._id, e.target.value)}
                    placeholder="Type your question..."
                    className="flex-1 border-none bg-transparent text-[15px] font-semibold text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
                  />
                  {!q._id && (
                    <span className="shrink-0 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                      Unsaved
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => requestDelete(q._id, index, q.question)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors duration-200 hover:bg-rose-500/10 hover:text-rose-500 dark:text-slate-500 dark:hover:bg-rose-500/20 dark:hover:text-rose-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Answer area */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  q.active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    className="mx-5 mb-5 border-t px-0 pt-4"
                    style={{
                      borderColor: isDark ? "rgba(255,255,255,.06)" : "#f1f5f9",
                    }}
                  >
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Answer
                    </label>
                    <textarea
                      value={q.answer}
                      onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                      placeholder="Type the answer..."
                      rows={4}
                      className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition-colors duration-150 focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add new FAQ */}
      <button
        type="button"
        onClick={newFaqHandler}
        className="flex items-center justify-center gap-2 rounded-[20px] border-2 border-dashed px-5 py-4 text-sm font-semibold transition-all duration-200 hover:bg-emerald-500/5"
        style={{
          borderColor: isDark ? "rgba(16,185,129,.3)" : "#a7f3d0",
          color: isDark ? "#34d399" : "#059669",
        }}
      >
        <Plus size={18} />
        Add New Question
      </button>

      {/* Sticky Save Bar */}
      
      {hasChanges && (
  <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-4 sm:px-4 sm:pb-6">
    <div
      className="flex w-full max-w-[900px] flex-col gap-4 rounded-2xl border p-4 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4"
      style={{
        backgroundColor: isDark
          ? "rgba(17,24,39,0.95)"
          : "rgba(255,255,255,0.95)",
        borderColor: isDark
          ? "rgba(255,255,255,.08)"
          : "#e5e7eb",
      }}
    >
      <p className="text-center text-sm font-medium text-slate-600 dark:text-slate-300 sm:text-left">
        You have unsaved changes
      </p>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <button
          type="button"
          onClick={() => setQuestions(data?.layout?.faq || [])}
          disabled={isSaving}
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto"
        >
          Discard
        </button>

        <button
          type="button"
          onClick={handleEdit}
          disabled={isSaving || hasEmptyField}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition-all hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSaving && pendingAction === "save" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Changes</span>
          )}
        </button>
      </div>
    </div>
  </div>
)}

      {/* Delete Confirmation Modal */}
      <DeleteFaqModal
        open={!!faqToDelete}
        onClose={() => setFaqToDelete(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        question={faqToDelete?.question || ""}
      />
    </div>
  );
};

export default EditFAQ;

