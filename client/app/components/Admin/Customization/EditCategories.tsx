

"use client";

import {
  useGetHeroDataQuery,
  useEditLayoutMutation,
} from "@/redux/features/layout/layoutApi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";
import { Plus, Trash2, Tag, Loader2, X, AlertTriangle } from "lucide-react";
import Loader from "../../../components/Loader/Loader";

const DeleteCategoryModal = ({
  open,
  onClose,
  onConfirm,
  isDeleting,
  title,
  isDark,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title: string;
  isDark: boolean;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#111827]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-500/10">
              <AlertTriangle size={20} className="text-rose-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Delete Category
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                This action cannot be undone.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg p-2 transition hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to permanently remove this category?
          </p>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {title || "Untitled category"}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5 dark:border-slate-700">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-xl bg-rose-500 px-5 py-2.5 font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Category"}
          </button>
        </div>
      </div>
    </div>
  );
};

const EditCategories = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isSuccess, error, isLoading: isUpdating }] =
    useEditLayoutMutation();

  const [categories, setCategories] = useState<any[]>([]);
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: any;
    index: number;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingAction, setPendingAction] = useState<"save" | "delete" | null>(null);

  useEffect(() => {
    if (data) {
      setCategories(data?.layout?.categories || []);
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      if (pendingAction === "delete") {
        toast.success("Category deleted successfully");
      } else {
        toast.success("Categories updated successfully");
      }
      refetch();
      setCategoryToDelete(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, error]);

  const handleCategoriesAdd = (id: any, value: string) => {
    setCategories((prevCategory: any[]) =>
      prevCategory.map((i: any) => (i._id === id ? { ...i, title: value } : i))
    );
  };

  const handleNewCategoryChange = (index: number, value: string) => {
    setCategories((prevCategory: any[]) =>
      prevCategory.map((i: any, idx: number) =>
        idx === index ? { ...i, title: value } : i
      )
    );
  };

  const newCategoriesHandler = () => {
    if (categories.length > 0 && categories[categories.length - 1].title === "") {
      toast.error("Category title cannot be empty");
      return;
    }
    setCategories((prevCategory: any[]) => [...prevCategory, { title: "" }]);
  };

  // opens the confirm modal instead of deleting silently
  const requestDelete = (id: any, index: number, title: string) => {
    setCategoryToDelete({ id, index, title });
  };

  // this is the actual fix — deletion now persists to Mongo immediately
  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    const remaining = categoryToDelete.id
      ? categories.filter((c) => c._id !== categoryToDelete.id)
      : categories.filter((_, i) => i !== categoryToDelete.index);

    // Never-saved row (no _id) — nothing exists in DB yet, just drop locally
    if (!categoryToDelete.id) {
      setCategories(remaining);
      toast.success("Category removed");
      setCategoryToDelete(null);
      return;
    }

    setIsDeleting(true);
    setPendingAction("delete");
    await editLayout({
      type: "Categories",
      categories: remaining.map(({ title }) => ({ title })),
    });
  };

  const areCategoriesUnchanged = (originalCategories: any[], newCategories: any[]) => {
    return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
  };

  const isAnyCategoryTitleEmpty = (categoriesList: any[]) => {
    return categoriesList.some((q) => q.title === "");
  };

  const editCategoriesHandler = async () => {
    if (
      !areCategoriesUnchanged(data?.layout?.categories, categories) &&
      !isAnyCategoryTitleEmpty(categories)
    ) {
      setPendingAction("save");
      await editLayout({
        type: "Categories",
        categories: categories.map(({ title }) => ({ title })),
      });
    }
  };

  const hasChanges =
    data?.layout?.categories &&
    !areCategoriesUnchanged(data.layout.categories, categories);

  const hasEmptyField = isAnyCategoryTitleEmpty(categories);
  const isSaveDisabled = isUpdating || !hasChanges || hasEmptyField;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-[900px] flex-col gap-6 px-4 py-6 pb-28 sm:px-6 sm:py-8 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[26px] font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Edit Categories
            </h1>
            <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {categories.length} {categories.length === 1 ? "Category" : "Categories"}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-[#94a3b8]">
            Manage the course categories shown across your platform.
          </p>
        </div>
      </div>

      {hasEmptyField && categories.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-600 dark:text-amber-400">
          Every category needs a title before saving.
        </div>
      )}

      {/* Categories Card */}
      <div
        className="rounded-[20px] border p-6 shadow-sm sm:p-8"
        style={{
          backgroundColor: isDark ? "#111827" : "#ffffff",
          borderColor: isDark ? "rgba(255,255,255,.08)" : "#e5e7eb",
          boxShadow: isDark
            ? "0 1px 2px rgba(0,0,0,.2)"
            : "0 10px 30px rgba(15,23,42,.06)",
        }}
      >
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
            <Tag className="h-8 w-8 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              No categories yet. Add your first one below.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {categories.map((category, index) => (
              <div
                key={category._id || `new-${index}`}
                className="group flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-150"
                style={{
                  borderColor: isDark ? "rgba(255,255,255,.08)" : "#e2e8f0",
                  backgroundColor: isDark ? "rgba(255,255,255,.02)" : "#f8fafc",
                }}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Tag size={15} />
                </span>

                <input
                  type="text"
                  value={category.title}
                  onChange={(e) =>
                    category._id
                      ? handleCategoriesAdd(category._id, e.target.value)
                      : handleNewCategoryChange(index, e.target.value)
                  }
                  placeholder="Category title..."
                  className="flex-1 border-none bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
                />

                {!category._id && (
                  <span className="shrink-0 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                    Unsaved
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => requestDelete(category._id, index, category.title)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 opacity-0 transition-all duration-150 hover:bg-rose-500/10 hover:text-rose-500 group-hover:opacity-100 dark:text-slate-500 dark:hover:bg-rose-500/20 dark:hover:text-rose-400"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add new category */}
        <button
          type="button"
          onClick={newCategoriesHandler}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed px-5 py-3 text-sm font-semibold transition-all duration-200 hover:bg-emerald-500/5"
          style={{
            borderColor: isDark ? "rgba(16,185,129,.3)" : "#a7f3d0",
            color: isDark ? "#34d399" : "#059669",
          }}
        >
          <Plus size={16} />
          Add New Category
        </button>
      </div>

      {/* Sticky Save Bar — only for title edits / additions, not deletes */}
      {hasChanges && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-6">
          <div
            className="flex w-full max-w-[900px] items-center justify-between gap-4 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-md"
            style={{
              backgroundColor: isDark ? "rgba(17,24,39,0.95)" : "rgba(255,255,255,0.95)",
              borderColor: isDark ? "rgba(255,255,255,.08)" : "#e5e7eb",
            }}
          >
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              You have unsaved changes
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCategories(data?.layout?.categories || [])}
                disabled={isUpdating}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-150 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={editCategoriesHandler}
                disabled={isSaveDisabled}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition-all duration-150 hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdating && pendingAction === "save" ? (
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
      <DeleteCategoryModal
        open={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title={categoryToDelete?.title || ""}
        isDark={isDark}
      />
    </div>
  );
};

export default EditCategories;