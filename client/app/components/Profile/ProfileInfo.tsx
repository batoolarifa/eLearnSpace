"use client";

import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import { AiOutlineCamera } from "react-icons/ai";
import avatarDefault from "../../../public/assets/avatar.jpg";
import { useEditProfileMutation, useUpdateAvatarMutation } from "../../../redux/features/user/userApi";
import { useLoadUserQuery } from "../../../redux/features/api/apiSlice";
import toast from "react-hot-toast";

type Props = {
  avatar: string | null;
    user: any;
  
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user?.name || "");
  const [updateAvatar, {isSuccess, error}] = useUpdateAvatarMutation()
  const [editProfile, {isSuccess: success, error: profileInfoError}] = useEditProfileMutation();
  const { refetch } = useLoadUserQuery(undefined, {});

  const imageHandler = async (e: any) => {
  
    const file = e.target.files?.[0];

  if (!file) return;

  const fileReader = new FileReader();

  fileReader.onload = async () => {
    if (typeof fileReader.result !== "string") return;

    try {
      await updateAvatar({
        avatar: fileReader.result,
      }).unwrap();

      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  fileReader.readAsDataURL(file);
};



  useEffect(()  => {

    if(error || profileInfoError){
        console.log(error)
    }

    if(success) {
      toast.success("Profile updated successfully!")
    }
  }, [isSuccess, error, success, profileInfoError])

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if(name !== ""){
     await editProfile({
        name: name
      })
    }

  }

  return (
    <div className="flex-1 ml-8 mt-[80px] mb-[80px]">

      <div className="w-full rounded-[5px] border border-[#0000001c] dark:border-[#ffffff1d] bg-white dark:bg-slate-900 shadow-sm p-8">

        <h2 className="text-2xl font-[600] text-black dark:text-white font-Poppins">
          My Profile
        </h2>

        <p className="mt-2 text-[15px] text-gray-500 dark:text-gray-400">
          Update your personal information and profile picture.
        </p>

        
        {/* Avatar */}

        <div className="flex justify-center mt-10">

          <div className="relative ">

            <div className="relative w-36 h-36 rounded-full overflow-hidden border-[4px] border-white dark:border-slate-200 ring-2 ring-emerald-500 shadow-xl">
            <Image
              src={avatar || user?.avatar?.url || avatarDefault}
              alt="Profile"
              fill
              sizes="144px"
              className="object-cover"
              priority
            />
          </div>

            <label
              htmlFor="avatar"
              className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center cursor-pointer hover:bg-emerald-600 duration-300"
            >
              <AiOutlineCamera
                className="text-white"
                size={22}
              />
            </label>

            <input
              type="file"
              id="avatar"
              className="hidden"
              onChange={imageHandler}
            />

          </div>

        </div>

        {/* Inputs */}

        
        <form onSubmit={handleSubmit}>

        <div className="mt-12">

        

          <div className="mb-7">

            <label className="block text-[15px] font-[500] text-black dark:text-white mb-2">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[50px] rounded-lg border border-gray-300 dark:border-slate-700 bg-transparent px-4 text-black dark:text-white outline-none focus:border-emerald-500 duration-300"
            />

          </div>

          <div>

            <label className="block text-[15px] font-[500] text-black dark:text-white mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full h-[50px] rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 px-4 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />

            <p className="mt-2 text-sm text-gray-500">
              Email address cannot be changed.
            </p>

          </div>

        </div>

        <button
          className="mt-10 w-full h-[50px] rounded-lg bg-emerald-500 hover:bg-emerald-600 duration-300 text-white font-[600]"
        >
          Update Profile
        </button>

        </form>

      </div>

    </div>
  );
};

export default ProfileInfo;