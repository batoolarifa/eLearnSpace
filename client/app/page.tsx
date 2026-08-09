'use client';



import { FC, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import Courses  from "./components/Route/Courses";
import Reviews from "./components/Route/Reviews";
import FAQ from "./components/FAQ/FAQ";
import Footer from "./components/Footer"

const Page: FC = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0)
  const [route, setRoute] = useState("Login");
  return (
    <div>
    <Header
      open={open}
      setOpen={setOpen}
      activeItem={activeItem}
      setRoute={setRoute}
      route={route}
    />

    <Hero />
    <Courses />
    <Reviews />
    <FAQ />
    <Footer />
      
     
    </div>
  );
};

export default Page;



