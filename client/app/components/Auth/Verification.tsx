import { styles } from '../../../app/styles/style';
import { useActivationMutation } from '../../../redux/features/auth/authApi';
import React, { FC, useEffect, useRef, useState } from 'react'
import {toast} from "react-hot-toast"
import { VscWorkspaceTrusted } from 'react-icons/vsc';
import { useSelector } from 'react-redux';


type Props = {
  setRoute: (route: string) => void;
}


type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification: FC <Props> = ({setRoute}) => {
  const {token} = useSelector((state: any) => state.auth);
  const [activation, {isSuccess, error}] = useActivationMutation();
  const [invalidError, setInvalidError] = useState<boolean>(false);


  useEffect(() => {
    if(isSuccess){
      toast.success("Account activated successfully");
      setRoute("Login");
    };

    if(error){
      if("data" in error){
        const errorData = error as any;
        toast.error(errorData.data.message);
        setInvalidError(true);
      }
      else {
        console.log("An error occured:", error);
      }
    }
  }, [isSuccess, error, setRoute])


  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];



  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: ""
  })



  const verificationHandler = async () => {
    const verificationNumber  = Object.values(verifyNumber).join("");
    if (verificationNumber.length !== 4){
      setInvalidError(true);
      return;

    }

    await activation({
      activationToken: token,
      activationCode: verificationNumber,
    });
  };



  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = {...verifyNumber, [index]: value};
       setVerifyNumber(newVerifyNumber);

       if(value === "" && index > 0){
        inputRefs[index-1].current?.focus();

       } else if (value.length ===1  && index < 3) {
        inputRefs[index+1].current?.focus();
       }
    };




  return (
  
     <div className="w-full">
      <h1 className={styles.title}>
        Verify Your Email
      </h1>

      <p className="mt-2 text-center text-[15px] leading-7 text-slate-600 dark:text-slate-400">
        Enter the 4-digit verification code we sent to your email
        </p>

      <div className="mt-8 flex justify-center">
        <div
          className="
            flex
            h-24
            w-24
            items-center
            justify-center
            rounded-full
            bg-emerald-100
            dark:bg-emerald-500/15
          "
        >
          <VscWorkspaceTrusted
            size={42}
            className="text-emerald-600 dark:text-emerald-400"
          />
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-4">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            key={key}
            ref={inputRefs[index]}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className={`
              h-16
              w-16
              rounded-xl
              border-2
              bg-transparent
              text-center
              text-xl
              font-semibold
              text-slate-900
              outline-none
              transition-all
              duration-200
              focus:scale-105
              dark:text-white

              ${
                invalidError
                  ? "shake border-red-500"
                  : "border-slate-300 dark:border-slate-700 focus:border-emerald-600 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20"
              }
            `}
          />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          className={styles.button}
          onClick={verificationHandler}
        >
          Verify OTP
        </button>
      </div>

      <p className="mt-8 text-center text-[14px] text-black dark:text-white">
        Already verified your account?
        <span
          className="cursor-pointer pl-1 text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400"
          onClick={() => setRoute("Login")}
        >
          Sign in
        </span>
      </p>
    </div>
  );
};
  
export default Verification
