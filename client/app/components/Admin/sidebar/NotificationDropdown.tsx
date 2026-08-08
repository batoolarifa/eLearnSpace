"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import {
  useGetAllNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "@/redux/features/notifications/notificationsApi";
import { socket } from "../../../lib/socket";


function getTimeAgo(date: string) {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );

  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours} hour ago`;

  const days = Math.floor(hours / 24);

  return `${days} day ago`;
}



export default function NotificationDropdown() {

  const { data, refetch } = useGetAllNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });



  const [
    updateNotificationStatus
  ] = useUpdateNotificationStatusMutation();



  const [open,setOpen] = useState(false);

  const [notifications,setNotifications] = useState<any[]>([]);



  const [audio] = useState(
    new Audio(
      "https://res.cloudinary.com/dxwgbrmmo/video/upload/v1785916946/universfield-soft-bell-ding-485895_zhdfsd.mp3"
    )
  );



  const playNotificationSound = () => {

    audio.play().catch((error)=>{
      console.log(
        "Audio error:",
        error
      );
    });

  };





  // Initial notifications load
  useEffect(()=>{

    if(data?.notifications){

      const unread =
      data.notifications.filter(
        (notification:any)=>
          notification.status === "unread"
      );


      setNotifications(unread);

    }


  },[data]);







  // Socket listener
  useEffect(()=>{


    const handleNewNotification = (
      notification:any
    )=>{


      


      // update UI instantly
      setNotifications((prev)=>[
        notification,
        ...prev
      ]);



      playNotificationSound();



      // keep data synced
      refetch();

    };



    socket.on(
      "newNotification",
      handleNewNotification
    );



    return()=>{

      socket.off(
        "newNotification",
        handleNewNotification
      );

    };


  },[refetch]);







  // Single notification read
  const markSingleRead = async(
    id:string
  )=>{


    try{


      // remove instantly
      setNotifications((prev)=>
        prev.filter(
          (notification)=>
            notification._id !== id
        )
      );



      await updateNotificationStatus(id)
      .unwrap();



    }catch(error){


      console.log(
        "Single update error:",
        error
      );


      refetch();


    }


  };







  // Mark all read
  const markAllRead = async()=>{


    try{


      const ids =
      notifications.map(
        (notification)=>
          notification._id
      );



      // remove instantly
      setNotifications([]);



      await Promise.all(

        ids.map((id)=>
          updateNotificationStatus(id)
          .unwrap()
        )

      );



    }catch(error){


     


      refetch();


    }


  };







  const unreadCount =
  notifications.length;




  const dropdownRef =
  useRef<HTMLDivElement>(null);






  // outside click
  useEffect(()=>{


    const handleClickOutside =
    (event:MouseEvent)=>{


      if(
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ){

        setOpen(false);

      }


    };



    document.addEventListener(
      "mousedown",
      handleClickOutside
    );



    return()=>{

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };


  },[]);



return (
  <div
    className="relative"
    ref={dropdownRef}
  >

    <button
      onClick={() => setOpen((prev) => !prev)}
      className="
      relative flex h-9 w-9 items-center justify-center
      rounded-lg border border-slate-200
      text-gray-500 hover:bg-slate-100
      dark:border-white/10 dark:text-gray-300
      dark:hover:bg-[#1e293b]
      "
    >
      <Bell size={17} />

      {unreadCount > 0 && (
        <span
          className="
          absolute -right-2 -top-2
          flex h-5 w-5 items-center justify-center
          rounded-full bg-emerald-500
          text-[10px] font-bold text-white
          "
        >
          {unreadCount}
        </span>
      )}
    </button>


    {open && (
      <div
        className="
        absolute right-0 mt-3 w-96 overflow-hidden
        rounded-2xl border border-slate-200
        bg-white shadow-2xl
        dark:border-white/10 dark:bg-[#0f172a]
        "
      >

        <div
          className="
          flex items-center justify-between
          border-b px-5 py-4
          dark:border-white/10
          "
        >

          <h3 className="font-semibold">
            Notifications
          </h3>


          {notifications.length > 0 && (
            <button
              onClick={markAllRead}
              className="
              flex items-center gap-1
              text-xs font-medium
              text-emerald-600 hover:underline
              "
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          )}

        </div>


        <div
          className="
          max-h-[420px]
          overflow-y-auto
          "
        >

          {notifications.length === 0 ? (

            <div
              className="
              p-10 text-center
              text-sm text-gray-500
              "
            >
              No unread notifications
            </div>

          ) : (

            notifications.map((notification) => (

              <div
                key={notification._id}
                onClick={() => markSingleRead(notification._id)}
                className="
                cursor-pointer border-b px-5 py-4
                transition hover:bg-slate-50
                dark:border-white/5
                dark:hover:bg-white/5
                bg-emerald-50/40
                dark:bg-emerald-500/10
                "
              >

                <div className="flex items-start gap-3">

                  <span
                    className="
                    mt-2 h-2.5 w-2.5
                    rounded-full bg-emerald-500
                    "
                  />


                  <div className="flex-1">

                    <div
                      className="
                      flex items-center justify-between
                      "
                    >

                      <h4
                        className="
                        font-semibold
                        text-slate-800
                        dark:text-white
                        "
                      >
                        {notification.title}
                      </h4>


                      <span
                        className="
                        text-xs text-gray-400
                        "
                      >
                        {getTimeAgo(notification.createdAt)}
                      </span>

                    </div>


                    <p
                      className="
                      mt-1 text-sm
                      text-gray-500
                      dark:text-gray-400
                      "
                    >
                      {notification.message}
                    </p>


                  </div>

                </div>

              </div>

            ))

          )}

        </div>

      </div>
    )}

  </div>
)}