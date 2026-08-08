"use client";

import { useState, useEffect } from "react";
import FAQ from "../components/FAQ/FAQ";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Page() {

      const [open, setOpen] = useState(false);
      const [activeItem, setActiveItem] = useState(5)
      const [route, setRoute] = useState("Login");
      
      
        useEffect(() => {
          document.title = "FAQ • eLearnSpace";
        }, []);  

  return (
       <>

         <Header
               open={open}
               setOpen={setOpen}
               activeItem={4}
               route={route}
               setRoute={setRoute}
             />
       
      <FAQ />

      
      <Footer />

      </>



  )
}