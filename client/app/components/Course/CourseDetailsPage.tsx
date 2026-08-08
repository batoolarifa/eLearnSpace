import { useGetCourseDetailsQuery } from "../../../redux/features/courses/coursesApi";
import Loader from "../Loader/Loader";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import CourseDetails from "./CourseDetails";
import {
  useCreatePaymentIntentMutation,
  useGetStripePublishableKeyQuery,
} from "../../../redux/features/orders/orderApi";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";

const CourseDetailsPage = () => {
  const params = useParams();
  const id = params?.id;

  const [route, setRoute] = useState("Login");
  const { user } = useSelector((state: any) => state.auth);
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetCourseDetailsQuery(id);
  const { data: config } = useGetStripePublishableKeyQuery({});
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [createPaymentIntent, { data: paymentIntentData }] =
    useCreatePaymentIntentMutation();

  useEffect(() => {
    if (data?.course?.name) {
      document.title = `${data.course.name} • ELearnSpace`;
    }

    if (config?.publishableKey) {
      setStripePromise(loadStripe(config.publishableKey));
    }

    if (user && data?.course?.price !== undefined) {
      const amount = Math.round(data.course.price * 100);
      createPaymentIntent(amount);
    }

    return () => {
      document.title = "ELearnSpace";
    };
  }, [data, config, user]);

  useEffect(() => {
    if (paymentIntentData) {
      setClientSecret(paymentIntentData?.client_secret);
    }
  }, [paymentIntentData]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header
            open={open}
            setOpen={setOpen}
            activeItem={1}
            setRoute={setRoute}
            route={route}
          />

          {data?.course && stripePromise && (
            <CourseDetails
              data={data.course}
              stripePromise={stripePromise}
              clientSecret={clientSecret}
               setRoute={setRoute}
               setLoginOpen={setOpen}
              
            />
          )}

          <Footer />
        </div>
      )}
    </>
  );
};

export default CourseDetailsPage;