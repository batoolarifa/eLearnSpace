"use client";

import React from "react";
import Loader from "../../components/Loader/Loader";
import { useLoadUserQuery } from "../../../redux/features/api/apiSlice";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import CourseContent from "../../components/Course/CourseContent";

type Props = {
    params: Promise<{ id: string }>;
};

const Page = ({ params }: Props) => {

    const { id } = React.use(params);


    const { isLoading, error, data } = useLoadUserQuery(undefined, {});

    useEffect(() => {
    if (!isLoading) {

        if (error || !data?.user) {
            redirect("/");
            return;
        }

        const isPurchased = data.user.courses.find(
            (item: any) => item._id === id
        );

        if (!isPurchased) {
            redirect("/");
        }
    }

}, [data, error, isLoading, id]);
    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    <CourseContent id={id}  user= {data?.user}/>
                </div>
            )}
        </>
    );
};

export default Page;