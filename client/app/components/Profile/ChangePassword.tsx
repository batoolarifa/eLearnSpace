"use client";

import { useUpdatePasswordMutation } from "../../../redux/features/user/userApi";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [updatePassword, {isSuccess, error}] = useUpdatePasswordMutation();


  const handleSubmit = async(e: any) => {
    e.preventDefault();
    if(oldPassword ==="" || newPassword === " " || confirmPassword === "") {
      toast.error("Please fill all the fields")

    }

    if( newPassword !== confirmPassword) {
      toast.error("Password do not match")
    } else {
      await updatePassword({ oldPassword, newPassword});
    }
  };

  useEffect(() => {
    if(isSuccess){
      toast.success("Password updated successfully");
    }

    if(error){
          if("data" in error){
            const errorData = error as any;
            toast.error(errorData.data.message);
          }
     } 
}, [ isSuccess, error])

  return (
    <div className="flex-1 ml-8 mt-[80px] mb-[80px]">
      <div className="w-full rounded-[5px] border border-[#0000001c] dark:border-[#ffffff1d] bg-white dark:bg-slate-900 shadow-sm p-8">

        <h2 className="text-2xl font-[600] font-Poppins text-black dark:text-white">
          Change Password
        </h2>

        <p className="mt-2 text-[15px] text-gray-500 dark:text-gray-400">
          Keep your account secure by using a strong password that you don&apos;t
          use anywhere else.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-7"
        >

          {/* Old Password */}

          <div>
            <label className="block mb-2 text-[15px] font-[500] text-black dark:text-white">
              Current Password
            </label>

            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter your current password"
                className="w-full h-[52px] rounded-lg border border-gray-300 dark:border-slate-700 bg-transparent px-4 pr-12 text-black dark:text-white outline-none focus:border-emerald-500 duration-300"
              />

              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showOld ? (
                  <AiOutlineEyeInvisible
                    size={22}
                    className="text-gray-500"
                  />
                ) : (
                  <AiOutlineEye
                    size={22}
                    className="text-gray-500"
                  />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}

          <div>
            <label className="block mb-2 text-[15px] font-[500] text-black dark:text-white">
              New Password
            </label>

            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full h-[52px] rounded-lg border border-gray-300 dark:border-slate-700 bg-transparent px-4 pr-12 text-black dark:text-white outline-none focus:border-emerald-500 duration-300"
              />

              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showNew ? (
                  <AiOutlineEyeInvisible
                    size={22}
                    className="text-gray-500"
                  />
                ) : (
                  <AiOutlineEye
                    size={22}
                    className="text-gray-500"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}

          <div>
            <label className="block mb-2 text-[15px] font-[500] text-black dark:text-white">
              Confirm New Password
            </label>

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="w-full h-[52px] rounded-lg border border-gray-300 dark:border-slate-700 bg-transparent px-4 pr-12 text-black dark:text-white outline-none focus:border-emerald-500 duration-300"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showConfirm ? (
                  <AiOutlineEyeInvisible
                    size={22}
                    className="text-gray-500"
                  />
                ) : (
                  <AiOutlineEye
                    size={22}
                    className="text-gray-500"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Security Tip */}

          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-emerald-500">
                Password Tip:
              </span>{" "}
              Use at least 8 characters with uppercase letters, lowercase
              letters, numbers, and special characters for better security.
            </p>
          </div>

          <button
            type="submit"
            className="mt-4 w-full h-[52px] rounded-lg bg-emerald-500 hover:bg-emerald-600 duration-300 text-white font-[600] shadow-md"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;