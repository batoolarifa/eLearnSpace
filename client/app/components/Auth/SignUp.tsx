"use client"
import React, { FC, useEffect, useState } from 'react'
import {useFormik} from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { styles } from '../../../app/styles/style';
import { useRegisterMutation } from "../../../redux/features/auth/authApi";
import toast from 'react-hot-toast';

type Props = {
    setRoute: (route: string ) => void;
 
};


const schema = Yup.object().shape({
    name: Yup.string().required("Please enter your name!"),
    email: Yup.string().email("Invalid email!").required("Please enter your email!"),
    password: Yup.string().required("Please enter your password!").min(6),
})

const  SignUp: FC<Props> = ({setRoute}) => {
    const [show, setShow] = useState(false);
    const [register, {data, error, isSuccess}] = useRegisterMutation(); 


    useEffect(() => {
        if(isSuccess) {
            const message = data?.message  || "Registration successful";
            toast.success(message);
            setRoute("Verification");
         }

        if(error) {
            if("data" in error) {
                const errorData = error as any;
                toast.error(errorData.data.message);
            }
        }
     
    }, [isSuccess, error , data?.message, setRoute]);

    const formik = useFormik({
        initialValues: { name: "", email: "", password: ""},
        validationSchema: schema,
        onSubmit: async ({ name , email, password})  => {
            const data = {
                name, email, password
            };
            
            await register(data);
        }
        });
    
    const {errors, touched,values, handleChange, handleSubmit} = formik;

    
  return (
    <div className='w-full'>
        <h1 className={`${styles.title}`}>

             Welcome to eLearnSpace
        </h1>

        <form onSubmit={handleSubmit}>
         <div className='mb-3'> 

             <label className={`${styles.label}`}
          htmlFor='text'
           >
            Enter your name
         </label>

         <input 
           type='text'
           name=''
           value={values.name}
           onChange={handleChange}
           id='name'
           placeholder='johndoc'
           className={`${
            errors.name && touched.name && "border-red-500"
           } ${styles.input}`}
         
         />

         {errors.name && touched.name && (
                <span className='text-red-500 pt-2 block'>{errors.name}</span>
            )}

         </div>

         <label className={`${styles.label}`}
          htmlFor='email'
           >
            Enter your email
         </label>

         <input 
           type='email'
           name=''
           value={values.email}
           onChange={handleChange}
           id='email'
           placeholder='name@gmail.com'
           className={`${
            errors.email && touched.email && "border-red-500"
           } ${styles.input}`}
         
         />

         {errors.email && touched.email && (
                <span className='text-red-500 pt-2 block'>{errors.email}</span>
            )}

        <div className='w-full mt-5 relative mb-1'>
        <label className={`${styles.label}`} htmlFor='password'
           >
            Enter your password
         </label>


         <input 
         type={!show ? "password" : "text"}
         name='password'
         value={values.password}
         onChange={handleChange}
         id='password'
         placeholder='password'
          className={`${
            errors.password && touched.password && "border-red-500"
           } ${styles.input}`}
         
         
         />

         {!show ? (
            <AiOutlineEyeInvisible
            className='absolute bottom-3 right-2 z-1 cursor-pointer'
            size={20}
            onClick={() => setShow(true)} 
            />
         ) :
           (

            <AiOutlineEye 
            className='absolute bottom-3 right-2 z-1 cursor-pointer'
            size={20}
            onClick={() => setShow(false)}
            
            />

         )}

       
        </div>

          {errors.password && touched.password && (
                <span className='text-red-500 pt-2 block'>{errors.password}</span>
            )}


        <div
         className='w-full mt-5'>
            <input 
            type='submit'
            value="Sign Up"
            className={`${styles.button}`}
            />

        </div>

        <br />
         <div className="text-center pt-4 font-poppins text-[14px] text-black dark:text-white">
            <p>or join with</p>

            <div className="flex items-center justify-center my-3">
                <FcGoogle size={30} className="cursor-pointer mr-2" />
                <AiFillGithub size={30} className="cursor-pointer ml-2" />
            </div>

            <p className="pt-4">
                 Already have an account?{" "}
                <span
                className="cursor-pointer pl-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                onClick={() =>  setRoute("Login")}
                >
                Sign in
                </span>
            </p>
            </div>
        </form>
        <br />
      
    </div>
  )
}

export default SignUp;
