import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { Star, PlayCircle, Users, ArrowRight } from "lucide-react";

type Props = {
  item: any;
  isProfile?: boolean;
};

const CourseCard: FC<Props> = ({ item, isProfile }) => {
  const rating = item?.ratings ? Number(item.ratings).toFixed(1) : "New";
  const reviewCount = item?.reviews?.length ?? 0;
  const lectureCount = item?.courseData?.length ?? 0;
  const studentCount = item?.purchased ?? 0;

  const discount =
    item?.estimatedPrice && item.estimatedPrice > item.price
      ? Math.round(
          ((item.estimatedPrice - item.price) / item.estimatedPrice) * 100
        )
      : null;

  return (
    <Link
      href={!isProfile ? `/course/${item._id}` : `/course-access/${item._id}`}
      className="group block h-full"
    >
      <div
        className="
          flex h-full flex-col
          overflow-hidden rounded-2xl
          border border-emerald-100
          bg-white
          shadow-sm
          transition-all duration-300
          hover:-translate-y-1.5 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100
          dark:border-slate-800 dark:bg-slate-900
          dark:hover:border-emerald-700 dark:hover:shadow-emerald-900/20
        "
      >
        {/* Thumbnail */}
        <div className="relative overflow-hidden">
          <Image
            src={item.thumbnail.url}
            width={500}
            height={300}
            alt={item.name}
            className="
              h-[200px] w-full object-cover
              transition-transform duration-500
              group-hover:scale-110
            "
          />

          {/* Top gradient for badge legibility */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent" />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex gap-2">
            {isProfile ? (
              <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow">
                Enrolled
              </span>
            ) : discount ? (
              <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow">
                {discount}% OFF
              </span>
            ) : null}
          </div>

          {/* Lecture count pill */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <PlayCircle className="h-3.5 w-3.5" />
            {lectureCount} lectures
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 min-h-[56px] text-lg font-bold leading-snug text-slate-900 dark:text-white">
            {item.name}
          </h3>

          {/* Rating + students */}
          <div className="mt-3 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 font-semibold text-amber-500">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {rating}
              {reviewCount > 0 && (
                <span className="font-normal text-slate-400">
                  ({reviewCount})
                </span>
              )}
            </div>

            {studentCount > 0 && (
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Users className="h-4 w-4" />
                {studentCount} enrolled
              </div>
            )}
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {item.description}
          </p>

          {/* Footer: price + CTA */}
          <div className="mt-auto flex items-center justify-between border-t border-emerald-50 pt-4 dark:border-slate-800">
            <div className="flex items-baseline gap-2">
              {isProfile ? (
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  Continue Learning
                </span>
              ) : (
                <>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {item.price === 0 ? "Free" : `$${item.price}`}
                  </span>
                  {item.estimatedPrice > item.price && (
                    <span className="text-sm text-slate-400 line-through">
                      ${item.estimatedPrice}
                    </span>
                  )}
                </>
              )}
            </div>

            <span
              className="
                flex h-9 w-9 items-center justify-center rounded-full
                bg-emerald-50 text-emerald-600
                transition-all duration-300
                group-hover:bg-emerald-600 group-hover:text-white
                dark:bg-emerald-900/40 dark:text-emerald-400
              "
            >
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;