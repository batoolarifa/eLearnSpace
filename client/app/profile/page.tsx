'use client'

import { FC, useState, useEffect } from "react";
import Protected from "../hooks/useProtected";
import Header from "../components/Header";
import Profile from "../components/Profile/Profile";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";



const Page: FC = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5)
  const [route, setRoute] = useState("Login");
  const {user} = useSelector((state: any) => state.auth);

  
useEffect(() => {
  document.title = user?.name
    ? `${user.name} • eLearnSpace`
    : "Profile | eLearnSpace";
}, [user]);


  return (
    <div>
    <Protected>
    <Header
      open={open}
      setOpen={setOpen}
      activeItem={activeItem}
      setRoute={setRoute}
      route={route}
    />
    <Profile user = {user} />
    <Footer />

      </Protected>
     
    </div>
  );
};

export default Page;




