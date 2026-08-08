"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { toast } from "react-hot-toast";
import { ImagePlus, Pencil, Loader2 } from "lucide-react";
import {
  useGetHeroDataQuery,
  useEditLayoutMutation,
} from "../../../../redux/features/layout/layoutApi";

const EditHero = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data, refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isSuccess, error, isLoading: isUpdating }] =
    useEditLayoutMutation();

  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");

  const [original, setOriginal] = useState({
    image: "",
    title: "",
    subTitle: "",
  });

  useEffect(() => {
    if (data) {
      const fetchedImage = data?.layout?.banner?.image?.url || "";
      const fetchedTitle = data?.layout?.banner?.title || "";
      const fetchedSubTitle = data?.layout?.banner?.subTitle || "";

      setImage(fetchedImage);
      setTitle(fetchedTitle);
      setSubTitle(fetchedSubTitle);

      setOriginal({
        image: fetchedImage,
        title: fetchedTitle,
        subTitle: fetchedSubTitle,
      });
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Hero banner updated successfully.");
      refetch();
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage?.data?.message || "Failed to update hero banner.");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, error]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const hasChanges =
    image !== original.image ||
    title !== original.title ||
    subTitle !== original.subTitle;

  const handleUpdate = async () => {
    if (!hasChanges) return;

    await editLayout({
      type: "Banner",
      image,
      title,
      subTitle,
    });
  };

  const handleDiscard = () => {
    setImage(original.image);
    setTitle(original.title);
    setSubTitle(original.subTitle);
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Edit Hero Banner
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-[#94a3b8]">
            Update the homepage banner image, title and subtitle shown to visitors.
          </p>
        </div>

        {hasChanges && (
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleDiscard}
              disabled={isUpdating}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-150 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={isUpdating}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition-all duration-150 hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Card */}
      <div
        className="rounded-[20px] border p-6 shadow-sm sm:p-8"
        style={{
          backgroundColor: isDark ? "#111827" : "#ffffff",
          borderColor: isDark ? "rgba(255,255,255,.08)" : "#e5e7eb",
          boxShadow: isDark ? "0 1px 2px rgba(0,0,0,.2)" : "0 10px 30px rgba(15,23,42,.06)",
        }}
      >
        <div className="flex flex-col items-center gap-10 1000:flex-row 1000:items-center">
          {/* Image upload / preview */}
          <div className="flex w-full flex-col items-center 1000:w-1/2">
            <div className="group relative flex h-[280px] w-full max-w-[420px] items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40">
              {image ? (
                <Image
                  src={image}
                  alt="Hero banner preview"
                  fill
                  sizes="420px"
                  className="object-contain p-4"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
                  <ImagePlus size={32} strokeWidth={1.5} />
                  <p className="text-sm font-medium">No image uploaded</p>
                </div>
              )}

              <label
                htmlFor="heroImageInput"
                className="absolute bottom-3 right-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-emerald-500 text-white opacity-0 shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:bg-emerald-600 group-hover:opacity-100"
              >
                <Pencil size={16} />
              </label>
              <input
                id="heroImageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
              Recommended size: 800x800px, PNG or JPG
            </p>
          </div>

          {/* Text fields */}
          <div className="w-full space-y-6 1000:w-1/2">
            <div>
              <label
                htmlFor="heroTitle"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Title
              </label>
              <textarea
                id="heroTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                rows={3}
                placeholder="e.g. Learn New Skills with eLearnSpace"
                className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-colors duration-150 focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="heroSubTitle"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Subtitle
              </label>
              <textarea
                id="heroSubTitle"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                rows={4}
                placeholder="e.g. Master web development, AI, machine learning..."
                className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-colors duration-150 focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div
        className="rounded-[20px] border p-6 sm:p-8"
        style={{
          backgroundColor: isDark ? "#111827" : "#ffffff",
          borderColor: isDark ? "rgba(255,255,255,.08)" : "#e5e7eb",
        }}
      >
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Live Preview
        </p>
        <div className="flex flex-col items-center gap-8 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-cyan-100 p-8 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 1000:flex-row">
          <div className="w-full text-center 1000:w-1/2 1000:text-left">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
              Learn • Build • Grow
            </p>
            <h2 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white sm:text-3xl">
              {title || "Your title will appear here"}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300 1000:mx-0">
              {subTitle || "Your subtitle will appear here"}
            </p>
          </div>
          <div className="flex w-full items-center justify-center 1000:w-1/2">
            {image ? (
              <Image
                src={image}
                alt="Hero preview"
                width={220}
                height={220}
                className="h-auto max-w-[200px] rounded-lg object-contain drop-shadow-xl"
              />
            ) : (
              <div className="flex h-[160px] w-[160px] items-center justify-center rounded-lg bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600">
                <ImagePlus size={28} strokeWidth={1.5} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHero;