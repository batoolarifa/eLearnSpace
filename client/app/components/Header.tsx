'use client'

import Link from "next/link";
import { FC, useState,  MouseEvent, useEffect  } from "react";
import NavItems  from "../utils/NavItems";
import {ThemeSwitcher} from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModal from "../utils/CustomModal";
import Login from "../components/Auth/Login";;
import SignUp from "../components/Auth/SignUp";
import Verification from "../components/Auth/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import avatar from "../../public/assets/avatar.jpg";
import { useSession } from "next-auth/react";
import { useLogoutQuery, useSocialAuthMutation } from "../../redux/features/auth/authApi";
import toast from "react-hot-toast";
import { useLoadUserQuery } from "../../redux/features/api/apiSlice";


type Props = {
    open: boolean,
    setOpen: (open: boolean) => void;
    activeItem: number;
    route: string;
    setRoute: (route: string) => void;
}

const Header: FC <Props> = ({activeItem, setOpen, route, open, setRoute}) => {
    const [active, setActive] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);
    
    
    const {data: userData, isLoading, refetch} = useLoadUserQuery(undefined, {});
    const {data} = useSession();
    const [socialAuth, { isSuccess, error, isLoading: socialAuthLoading }] =
    useSocialAuthMutation();
    const [logout, setLogout] = useState(false);
    
        const {} = useLogoutQuery(undefined, {
            skip: !logout ? true : false, 
        });
    

    useEffect(() => {
            const handleSocialAuth = async () => {
                if (!isLoading) {
                    if (!userData && data?.user?.email) {
                        try {
                            await socialAuth({
                                email: data.user.email,
                                name: data.user.name || "",
                                avatar: data.user.image || "",
                            }).unwrap();

                            await refetch();
                        } catch (error) {
                            console.error("Social auth failed:", error);
                        }
                    }

                    if (data === null) {
                        if (isSuccess) {
                            toast.success("Login successfully");
                        }
                    }

                    if (data === null && !userData) {
                        setLogout(true);
                    }
                }
            };

            handleSocialAuth();
        }, [data, userData, isLoading, socialAuth, refetch, isSuccess]);


    if(typeof window !== "undefined"){
        window.addEventListener("scroll", () => {
            if(window.scrollY > 80) {
                setActive(true);
            }

            else {
                setActive(false);
            }
        });
    }

    const handleClose = (e:  MouseEvent<HTMLDivElement>) => {
        
        if(e.target instanceof HTMLElement && e.target.id === "screen") {
        {
            setOpenSidebar(false)
        }
        }
    }


  return (
    <div className="w-full relative">
        
        <div
        className={`${
            active
            ? "fixed top-0 left-0 w-full h-[80px] bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black border-b border-gray-200 dark:border-[#ffffff1c] shadow-xl transition duration-500"
            : "w-full h-[80px] bg-white dark:bg-[#0f172a] border-b border-gray-200 dark:border-[#ffffff1c]"
        }`}
        >
          <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
            <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
                <Link href={"/"}
                className={`text-[25px] font-poppins font-[500] text-black dark:text-white`}
                >
                eLearnSpace
                
                </Link>
                </div> 

                <div className="flex items-center">
                 <NavItems 
                   activeItem =  {activeItem}
                   isMobile={false}
                 /> 

                 <ThemeSwitcher /> 

                 {/* only for mobile */}

                 <div className="800:hidden">
                    <HiOutlineMenuAlt3 
                    size={25}
                    className="cursor-pointer dark:text-white text-black"
                    onClick={() => setOpenSidebar(true)}
                    />
                 </div>
                
                {
                isLoading || socialAuthLoading 
                            ? (
                        <div className="w-9 h-9 rounded-full border-2 border-gray-300 dark:border-gray-700 animate-pulse" />
                    ) : userData ? (
                        <Link href="/profile">
                            <div
                                className={`relative w-9 h-9 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                                    activeItem === 5
                                        ? "border-emerald-500"
                                        : "border-gray-200 dark:border-gray-700"
                                }`}
                            >
                                <Image
                                    src={userData?.user?.avatar?.url || avatar}
                                    alt="Profile"
                                    fill
                                    sizes="36px"
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </Link>
                    ) : (
                        <HiOutlineUserCircle
                            size={25}
                            className="hidden 800:block cursor-pointer dark:text-white text-black"
                            onClick={() => setOpen(true)}
                        />
                    )
                }

                <br />
                <br />

                </div>  


            </div>           
            </div>  

            {/* mobile sidebar */}

            {
                openSidebar && (
                    <div className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
                    onClick={handleClose}
                    id = "screen"
                    >

                <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900/95 top-0 right-0">
                  <NavItems 
                   activeItem =  {activeItem}
                   isMobile={true}
                 /> 

                  {
                    isLoading || socialAuthLoading ? (
                    <div className="ml-5 w-9 h-9 rounded-full border-2 border-gray-300 dark:border-gray-700 animate-pulse" />
                            ) : userData ? (
                        <Link href="/profile">
                            <div
                                className={`relative ml-5 w-9 h-9 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                                    activeItem === 5
                                        ? "border-emerald-500"
                                        : "border-gray-200 dark:border-gray-700"
                                }`}
                            >
                                <Image
                                    src={userData?.user?.avatar?.url || avatar}
                                    alt="Profile"
                                    fill
                                    sizes="36px"
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </Link>
                    ) : (
                        <HiOutlineUserCircle
                            size={25}
                            className="ml-6 cursor-pointer dark:text-white text-black"
                            onClick={() => setOpen(true)}
                        />
                    )
                }

                <br />
                <br />
                
                <p className="text[16px] px-2 pl-5 text-black dark:text-white">
                    Copyright &copy; {new Date().getFullYear()} eLearnSpace
                </p>
                </div>

                    </div>
                )
            }
        </div>
     
        {
            route === "Login" && (
              <>
              {
                open && (
                    <CustomModal 
                    open={open}
                    setOpen={setOpen}
                    setRoute={setRoute}
                    activeItem={activeItem}
                    component={Login}
                    refetch = {refetch}
                  
                     
                    
                    />
                )
              }
              </>
            )
        }


        {
            route === "Sign-Up" && (
              <>
              {
                open && (
                    <CustomModal 
                    open={open}
                    setOpen={setOpen}
                    setRoute={setRoute}
                    activeItem={activeItem}
                    component={SignUp}
                     
                    
                    />
                )
              }
              </>
            )
        }


        {
            route === "Verification" && (
              <>
              {
                open && (
                    <CustomModal 
                    open={open}
                    setOpen={setOpen}
                    setRoute={setRoute}
                    activeItem={activeItem}
                    component={Verification}
                     
                    
                    />
                )
              }
              </>
            )
        }



        
    </div>
  );
};

export default Header;
