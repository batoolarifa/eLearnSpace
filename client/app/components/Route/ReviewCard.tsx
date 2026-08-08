import Image from "next/image";
import { FC } from "react";
import { Star, Quote } from "lucide-react";

type Props = {
  item: any;
};

const ReviewCard: FC<Props> = ({ item }) => {
  const rating = Math.round(item?.rating ?? 5);

  return (
    <div
      className="
        relative flex h-full flex-col
        rounded-2xl border border-emerald-100 bg-white p-6
        shadow-sm transition-all duration-300
        hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100
        dark:border-slate-800 dark:bg-slate-900
        dark:hover:border-emerald-700 dark:hover:shadow-emerald-900/20
      "
    >
      <Quote className="absolute right-5 top-5 h-8 w-8 text-emerald-100 dark:text-emerald-900/50" />

      {/* Stars */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
            }`}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="mt-4 line-clamp-4 flex-1 text-sm leading-7 text-slate-600 dark:text-slate-300">
        {item?.comment}
      </p>

      {/* Reviewer */}
      <div className="mt-6 flex items-center gap-3 border-t border-emerald-50 pt-4 dark:border-slate-800">
        <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-emerald-100 dark:ring-emerald-900/40">
          <Image
            src={item?.user?.avatar?.url || "/images/default-avatar.png"}
            fill
            alt={item?.user?.name || "Learner"}
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {item?.user?.name || "Anonymous Learner"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {item?.courseName || "ELearnSpace Student"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;