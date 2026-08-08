


"use client";

import { useLoadUserQuery } from "../../../redux/features/api/apiSlice";
import { useCreateOrderMutation } from "../../../redux/features/orders/orderApi";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import React, { FC, useEffect, useState } from "react";
import { PaymentElement } from "@stripe/react-stripe-js";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import { socket } from "../../lib/socket";

type Props = {
  setOpen: any;
  data: any;
  user: any;
};

const CheckOutForm: FC<Props> = ({ setOpen, data, user }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string>("");
  const [createOrder, {data: orderData, error}] = useCreateOrderMutation();
  const { refetch } = useLoadUserQuery(undefined, {});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message ?? "Something went wrong with your payment.");
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setIsLoading(false);
       const result = await createOrder({
      courseId: data._id,
      payment_info: paymentIntent,
    });

    }
  };

  useEffect(() => {
  if (orderData) {
    const updateUserAndRedirect = async () => {

      socket.emit("notification", {
        title: "New Order",
        message: `You have a new order from ${data?.course?.name}`,
        userId: user._id,
      });

      await refetch();

      redirect(`/course-access/${data._id}`);
    };

    updateUserAndRedirect();
  }

  if (error) {
    if ("data" in error) {
      const errorData = error as any;
      toast.error(errorData.data.message);
    }
  }
}, [orderData, error]);

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[480px]"
    >
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />

      <button
        type="submit"
        disabled={!stripe || isLoading || !elements}
        id="submit"
        className="
          mt-6 flex w-full items-center justify-center rounded-md
          bg-[#635bff] px-4 py-3 text-[15px] font-medium text-white
          transition-colors duration-150
          hover:bg-[#0a2540]
          disabled:cursor-not-allowed disabled:opacity-50
        "
      >
        <span id="button-text">
          {isLoading ? "Processing..." : "Pay now"}
        </span>
      </button>

      {message && (
        <div id="payment-message" className="mt-3 text-sm text-[#df1b41]">
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckOutForm;