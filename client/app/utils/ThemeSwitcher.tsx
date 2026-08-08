'use client'

import { FC, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {BiMoon, BiSun} from "react-icons/bi";


export const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const {theme, setTheme} = useTheme();

    useEffect(() => setMounted(true), []);

    if(!mounted) { return null}

    return (
        <div className="flex items-center justify-center mx-4">
            { 
                theme === "light" ?  (
                <BiMoon
                className="cursor-pointer  text-black dark:text-white"
                        size={25}
                onClick={() => setTheme("dark")}
                />
            )  :  
               (
                <BiSun 
                size={25}
                className="cursor-pointer  text-black dark:text-white"
                onClick={() => setTheme("light")}
               
               />
                
            )}

        </div>
    )
      
};




// 'use client'

// import { FC, useState } from "react";


// type Props = {
//     open: boolean,
//     setOpen: (open: boolean) => void;
//     activeItem: number;
// }

// const Header: FC <Props> = ({activeItem}) => {
      
// };

// export default Header;
