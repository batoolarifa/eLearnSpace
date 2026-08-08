import Ratings from '../../utils/Ratings';
import {format} from "timeago.js"
import React, { FC, useState } from 'react'
import { IoCheckmarkDoneOutline}  from 'react-icons/io5';
import { useSelector } from 'react-redux';
import CoursePlayer from '../../utils/CoursePlayer';
import Link from "next/link";
import { style } from '@mui/system';
import { styles } from '../../styles/style';
import CourseContentList from "../Course/CourseContentList";
import { IoCloseOutline } from "react-icons/io5";
import {Elements} from "@stripe/react-stripe-js";
import CheckOutForm from "../Payment/CheckOutForm";
import  Image  from "next/image";
import defaultImage from "../../../public/assets/avatar.jpg";
import { VscVerifiedFilled } from 'react-icons/vsc';


type Props = {
    data: any;
    stripePromise: any;
    clientSecret: string;
     setRoute: any;
    setLoginOpen: any;
}

const CourseDetails: FC<Props> = ({ data, stripePromise, clientSecret, setLoginOpen, setRoute}) => {

    const [open, setOpen] = useState(false);
    const { user} = useSelector((state: any) => state.auth);

    const discountPercentage = 
    ((data?.estimatedPrice - data?.price) / data?.estimatedPrice) * 100;

    const discountPercentagePrice = discountPercentage.toFixed(0);

    const isPurchased = user && user?.courses?.find((item: any) => item._id === data._id);

    const handleOrder = () => {
          if (!user) {
            setRoute("Login");
            setLoginOpen(true);
            return;
          }

          setOpen(true); // Stripe popup
        };

    

  return (
    <div>
     <div className='w-[90%] 800:w-[90%] m-auto py-5'>
         <div className="w-full flex flex-col-reverse 800:flex-row">
           <div className="w-full 800:w-[65%] 800:pr-5">
            <h1 className='text-[25px] font-poppins font-[600] text-black dark:text-white'>
                {data.name}
            </h1>

            <div className='flex items-center justify-between pt-3'>
                <div className='flex items-center'>
                    <Ratings rating={data.ratings} />
                    <h5 className='text-black dark:text-white'>
                        {data.reviews?.length} Reviews
                    </h5>
            </div>
            <h5 className='text-black dark:text-white'>{data.purchased} Students</h5>
          </div>

          <br />
          
          <h1 className='text-[25px] font-poppins font-[600] text-black dark:text-white'> What you will learn from this course?</h1>
         <div>
            {data?.benefits?.map((item: any, index: number) => (
                             <div key={index} className='w-full flex 800:items-center py-2'>
                                 <div className='w-[15px] mr-1'> 
                                     <IoCheckmarkDoneOutline size = {20}  className = "text-black dark:text-white"/>
                                     </div> 
                                     <p className='pl-2 text-black dark:text-white'>{item.title} </p>
                                </div>
                         ))}

                         <br />
                          <br />
                      </div>

        <h1 className='text-[25px] font-poppins font-[600] text-black dark:text-white'> What are the prerequisites for this course?</h1>
         <div>
            {data?.prerequisites?.map((item: any, index: number) => (
                             <div key={index} className='w-full flex 800:items-center py-2'>
                                 <div className='w-[15px] mr-1'> 
                                     <IoCheckmarkDoneOutline size = {20}  className = "text-black dark:text-white"/>
                                     </div> 
                                     <p className='pl-2 text-black dark:text-white'>{item.title} </p>
                                </div>
                         ))}
            </div>

            <br />
            <br />
             
            <div>
            <h1 className='text-[25px] font-poppins font-[600] text-black dark:text-white'> Course Overview</h1>
            <CourseContentList 
                   data={data?.courseData}
                   isDemo={true}
                /> 
             </div>

             <br />
            <br />


              <div className='w-full'>
                <h1 className='text-[25px] font-poppins font-[600]  text-black dark:text-white'>
                    Course Details
                     </h1>
                     <p className='text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden  text-black dark:text-white'>
                     {
                        data?.description
                     }
                     </p>
                     </div>
                    <br />
                    <br />
                    
                    <div className="w-full">
  {/* Rating Summary */}
  <div className="flex flex-col gap-3 800:flex-row 800:items-center mb-8">
    <Ratings rating={data?.ratings} />

    <h5 className="text-[25px] font-poppins font-[600] text-black dark:text-white">
      {Number.isInteger(data?.ratings)
        ? data?.ratings.toFixed(1)
        : data?.ratings.toFixed(2)}{" "}
      Course Rating • {data?.reviews?.length} Reviews
    </h5>
  </div>

  {/* Reviews */}
  <div className="space-y-2">
    {data?.reviews &&
      [...data.reviews].reverse().map((item: any, index: number) => (
        <div
          key={index}
          className="w-full py-6 border-b border-slate-200 dark:border-slate-700 last:border-none"
        >
          <div className="flex gap-4">
            {/* Avatar */}
            <div className="w-[50px] h-[50px] flex-shrink-0">

              <Image
                src={item?.user?.avatar?.url || defaultImage}
                alt={item?.user?.name || "User Avatar"}
                width={52}
                height={52}
                className="w-[52px] h-[52px] rounded-full object-cover flex-shrink-0"
              />
                   

  
            </div>

            {/* Review Content */}
            <div className="flex-1">
              {/* Name + Rating */}
              <div className="flex flex-col gap-2 800:flex-row 800:items-center">
                <h5 className="text-[18px] font-semibold text-black dark:text-white">
                  {item.user.name}
                </h5>

                <Ratings rating={item.rating} />
              </div>

              {/* Comment */}
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                {item.comment}
              </p>

              {/* Date */}
              <small className="mt-3 block text-slate-500 dark:text-slate-400">
                {format(item.createdAt)}
              </small>

              
              {item?.commentReplies?.length > 0 && (
  <div className="mt-5 space-y-4">
    {item.commentReplies.map((reply: any, replyIndex: number) => (
      <div
        key={reply._id || `${item._id}-reply-${replyIndex}`}
        className="flex gap-3 ml-8"
      >
        <Image
          src={reply?.user?.avatar?.url || defaultImage}
          alt={reply?.user?.name || "Admin"}
          width={42}
          height={42}
          className="w-[42px] h-[42px] rounded-full object-cover flex-shrink-0"
        />

        <div>
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-black dark:text-white">
              {reply.user.name}
            </h5>

            {reply.user.role === "admin" && (
              <VscVerifiedFilled
                size={16}
                className="text-blue-500 flex-shrink-0"
              />
            )}
          </div>

          <p className="mt-1 text-slate-600 dark:text-slate-300">
            {reply.comment}
          </p>

          <small className="text-slate-500 dark:text-slate-400">
            {format(reply.createdAt)}
          </small>
        </div>
      </div>
    ))}
  </div>
)}
            </div>
          </div>
        </div>
      ))}
  </div>
</div>
                
                
                
                
                
               
               
                </div>
                     <div className="w-full 800:w-[35%] relative">
          <div className='sticky top-[100px] left-0 z-50 w-full'>
            <CoursePlayer  
               videoUrl={data?.demoUrl}
               title={data?.title}
              />

              <div className='flex items-center'>
                <h1 className=' pt-5 text-[25px] text-black dark:text-white'>
                  {data.price === 0 ? "Free" : data.price + "$"}
                  </h1>

              <h5 className=' pl-3 text-[20px] mt-2 line-through opacity-80 text-black dark:text-white'>
                  {data.estimatedPrice}$
                  </h5>

              <h4 className=' pl-5 pt-4  text-[22px]  text-black dark:text-white'>
                  {discountPercentagePrice}% Off
                  </h4>
                  </div>

                  <div className="flex item-center">
                    {isPurchased ? (
                      <Link
                      className={`${styles.button} !w-[180px] my-3 font-poppins cursor-pointer !bg-[crimson]`}
                      href={`/course-access/${data._id}`}
                      >
                        Enter to Course
                      </Link>

                    ) :   (
                       <div
                          className={`${styles.button} !w-[180px] my-3 font-poppins cursor-pointer !bg-[crimson]`}
                          onClick={handleOrder}
                       > 
                          Buy Now {data.price}$
                       </div>

                    )}
                    </div>

                    <br />

                    
            <p className='pb-1'>• Source code included</p>
            <p className='pb-1'>• Full lifetime access</p>
            <p className='pb-1'>• Certificate of completion</p>
            <p className='pb-3'>• Premium Support</p>
        





          </div>
          </div>   

            



        </div> 

   
        </div>    
            
            <>
             {

              open &&  (

                <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center">
                <div className="w-[500px] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow p-3"   style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                    <div className="w-full flex justify-end">
                      <IoCloseOutline
                         size = {40}
                         className ="text-black cursor-pointer"
                         onClick = {() => setOpen(false)}
                      />
                    </div>

                    <div className="w-full">
                      {
                        stripePromise  && clientSecret  && (
                          <Elements stripe={stripePromise} 
                            options={{
                                  clientSecret, 
                                  appearance: { theme: "stripe" }, 
                                  }}>
                            <CheckOutForm setOpen={setOpen} data={data} user={user} />
                            </Elements>
                        )
                      }
                    </div>


                  </div>
                </div>
              )
             }
            </>
         </div>
    
  )
}

export default CourseDetails;
