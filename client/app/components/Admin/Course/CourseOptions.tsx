import React, { FC } from "react";
import { IoMdCheckmark } from "react-icons/io";

type Props = {
  active: number;
  setActive: (active: number) => void;
};

const CourseOptions: FC<Props> = ({ active, setActive }) => {
  const options = [
    "Course Information",
    "Course Options",
    "Course Content",
    "Course Preview",
  ];

  return (
    <div>
      {options.map((option, index) => (
        <div key={index} className="w-full flex py-5">
          <div
            className={`relative flex h-[35px] w-[35px] items-center justify-center rounded-full ${
              active + 1 > index ? "bg-blue-500" : "bg-[#384766]"
            }`}
          >
            <IoMdCheckmark className="text-[25px] text-white" />

            {index !== options.length - 1 && (
              <div
                className={`absolute bottom-[-100%] h-[30px] w-1 ${
                  active + 1 > index ? "bg-blue-500" : "bg-[#384766]"
                }`}
              />
            )}
          </div>

          <h5
            className={`pl-3 text-[20px] ${
              active === index
                ? "text-black dark:text-white"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {option}
          </h5>
        </div>
      ))}
    </div>
  );
};

export default CourseOptions;