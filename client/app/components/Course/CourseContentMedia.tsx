import { styles } from '../../styles/style';
import CoursePlayer from '../../utils/CoursePlayer';
import React, { useEffect, useState } from 'react'
import { AiFillStar, AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineStar } from 'react-icons/ai';
import defaultImage from "../../../public/assets/avatar.jpg";
import Image from "next/image";
import toast from 'react-hot-toast';
import { useAddAnswerInQuestionMutation, useAddNewQuestionMutation, useAddReplyInReviewMutation, useAddReviewInCourseMutation, useGetCourseDetailsQuery } from '../../../redux/features/courses/coursesApi';
import {format} from "timeago.js"
import { BiMessage } from 'react-icons/bi';
import { VscVerifiedFilled } from 'react-icons/vsc';
import {socket} from "../../lib/socket";


type Props = {
    data: any;
    id: string;
    activeVideo: number
    setActiveVideo: (activeVideo: number) => void;
    user: any;
    refetch: any;
}

const CourseContentMedia = ({data, id, activeVideo, setActiveVideo, user, refetch}: Props) => {

  const [activeBar, setActiveBar] = useState(0);
  const [question, setQuestion] = useState("");
  
  const [rating, setRating] = useState<number>(0)
  const [review, setReview] = useState("")

  const {data: courseData, refetch: courseRefetch } = useGetCourseDetailsQuery(id, {refetchOnMountOrArgChange: true});


  const [addnewQuestion, {isSuccess, error, isLoading: questionCreationLoading}] = useAddNewQuestionMutation({});
  const [addAnswerInQuestion, {isSuccess: answerSuccess, error: answerError, isLoading: answerCreationLoading}] = useAddAnswerInQuestionMutation();

  const [addReviewInCourse, {isSuccess: reviewSuccess, error:reviewError, isLoading: reviewCreationLoading}]  = useAddReviewInCourseMutation()

  const [addReplyInReview, {isSuccess: replySuccess, error: replyError, isLoading: replyCreationLoading}] = useAddReplyInReviewMutation()

  const course = courseData?.course;

  const [activeQuestionReply, setActiveQuestionReply] = useState<string | null>(null);

  const [activeReviewReply, setActiveReviewReply] = useState<string | null>(null);


  const handleQuestion = () => {
    if(question.length === 0 ) {
      toast.error("Question can't be empty")
    } else {

      addnewQuestion({
        question,
      courseId: id,
      contentId: data[activeVideo]._id
      });
    }
  };


  const handleAnswerSubmit = async (answerText: string, questionId: string) => {
     addAnswerInQuestion({
       answer: answerText,
       courseId: id,
       contentId: data[activeVideo]._id,
       questionId
     })
  }

  const handleReviewSubmit = async() => {
    if(review.length === 0) {
      toast.error("Review can't be empty");
    } else {

      addReviewInCourse({review, rating, courseId: id});

    }
  }

  const handleReviewReply = (replyText: string, reviewId: string) => {
    if(replyText.trim().length === 0) {
      toast.error("Reply can't be empty");
      return;
    }

    addReplyInReview({
      comment: replyText,
      courseId: id,
      reviewId,
    });
  }



  useEffect(() => {

    if(isSuccess) {
      setQuestion("")
      refetch();
      toast.success("Question added successfully")

      socket.emit("notification", {
                title: "New Question Received",
                message: `You have a new question in ${data[activeVideo].title}`,
                userId: user._id,
              });
    }
    if(answerSuccess){
      refetch();
      toast.success("Answer added successfully")
      if( user.role !== "admin"){
        socket.emit("notification", {
                title: "New Question Reply Received",
                message: `You have a new question reply in ${data[activeVideo].title}`,
                userId: user._id,
              });
      }
    }

    if(error) {
      if("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }

     if(answerError) {
      if("data" in answerError) {
        const errorMessage = answerError as any;
        toast.error(errorMessage.data.message);
      }
     }

     if(reviewSuccess) {
      setReview("")
      setRating(0);
      courseRefetch();
      toast.success("Review added successfully")

      socket.emit("notification", {
                  title: "New Review Received",
                   message: `${user?.name} has given a review on ${courseData?.course?.name}`,
                  userId: user._id,
              });


      
     }

      if(reviewError) {
      if("data" in reviewError) {
        const errorMessage = reviewError as any;
        toast.error(errorMessage.data.message);
      }
     }

     if(replySuccess) {
      courseRefetch();
      toast.success("Reply added successfully")
     }

     if(replyError) {
      if("data" in replyError) {
        const errorMessage = replyError as any;
        toast.error(errorMessage.data.message);
      }
     }



  }, [isSuccess, error, answerSuccess, answerError, reviewSuccess, reviewError, replySuccess, replyError])


  const isReviewExists = course?.reviews?.find(
    (item: any) =>  item.user._id === user._id
  )


  return (
    <div className='w-[95%] 800:w-[86%] py-4 m-auto'>
        <CoursePlayer 
         title={data[activeVideo]?.title}
         videoUrl={data[activeVideo]?.videoUrl}
        />

        <div className="w-full flex items-center justify-between my-5">
  <button
    className={`
      flex items-center gap-2
      px-6 py-3 rounded-full
      bg-blue-600 text-white font-medium
      transition-all duration-200
      ${
        activeVideo === 0
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-blue-700 cursor-pointer"
      }
    `}
    disabled={activeVideo === 0}
    onClick={() => setActiveVideo(activeVideo - 1)}
  >
    <AiOutlineArrowLeft size={18} />
    Prev Lesson
  </button>

  {/* Next */}
  <button
    className={`
      flex items-center gap-2
      px-6 py-3 rounded-full
      bg-blue-600 text-white font-medium
      transition-all duration-200
      ${
        activeVideo === data.length - 1
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-blue-700 cursor-pointer"
      }
    `}
    disabled={activeVideo === data.length - 1}
    onClick={() => setActiveVideo(activeVideo + 1)}
  >
    Next Lesson
    <AiOutlineArrowRight size={18} />
  </button>
</div>

<h1 className = 'pt-2 text-[25px] font-[600]'> {data[activeVideo].title}</h1>
<br/>


   <div className="w-full p-4 flex items-center justify-between
bg-white dark:bg-white/5
backdrop-blur-md
border border-gray-200 dark:border-white/10
rounded-xl">
  {["Overview", "Resources", "Q&A", "Reviews"].map((text, index) => (
    <h5
      key={index}
      className={`800:text-[18px] font-medium transition-all duration-200 cursor-pointer ${
        activeBar === index
          ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 pb-1"
          : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300"
      }`}
      onClick={() => setActiveBar(index)}
    >
      {text}
    </h5>
  ))}
</div>

  <br />

  {
    activeBar === 0 && (
      <p className='text-[18px] whitespace-pre-line mb-3'>
        {data[activeVideo]?.description}
      </p>
    )}

    {
    
    activeBar ===  1 && (
        <div>
          {data[activeVideo]?.links.map((item: any, index: number) => (
            <div  key={index} className="mb-5">
              <h2 className='800:text-[20px] 800:inline-block dark:text-white text-black'>
                {item.title && item.title + " :"}
            </h2>


            <a  className='inline-block text-[#4395c4] 800:text-[20px] 800:pl-2 ' href={item.url} >
                 {item.url}
            </a>
            </div>
          ))}
        </div>
    )}

 {activeBar === 2 && (
  <div className="mt-8">

    {/* Heading */}
    <div className="mb-5">
      <h3 className="text-[20px] font-semibold text-black dark:text-white">
         Ask the Instructor
      </h3>

      <p className="mt-1 text-[14px] text-gray-500 dark:text-gray-400">
       Have a question about this lesson? Ask here.
      </p>
    </div>

    {/* User Input */}
    <div className="flex items-start gap-4">

      <Image
        src={user.avatar ? user.avatar.url : defaultImage}
        alt={user?.name || "User Avatar"}
        width={52}
        height={52}
        className="w-[52px] h-[52px] rounded-full object-cover"
      />

      <div className="flex-1">

             <textarea
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Write your question here..."
          className="
            w-full
            resize-none
            rounded-xl
            border
            border-gray-300
            dark:border-gray-700
            bg-white
            dark:bg-[#0b0d10]
            p-4
            text-[16px]
            text-black
            dark:text-white
            placeholder:text-gray-400
            outline-none
            transition-all
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-500/10
          "
        />
              {question.trim() && (
          <div className="flex justify-end gap-3 mt-5">

            <button
              onClick={() => setQuestion("")}
              className="
                px-5 py-2
                rounded-full
                text-gray-600
                dark:text-gray-300
                hover:bg-gray-100
                dark:hover:bg-[#1d2433]
                transition
              "
            >
              Cancel
            </button>

            <button
              className="
                px-7 py-2
                rounded-full
                bg-blue-600
                hover:bg-blue-700
                text-white
                font-medium
                transition
                disabled:bg-gray-400
                disabled:cursor-not-allowed
              "
               onClick={handleQuestion}
                disabled={questionCreationLoading}
            >
               {questionCreationLoading ? "Posting..." : "Post Question"}
            </button>

          </div>
        )}

      </div>

    </div>

    <div className="mt-10 border-b border-gray-200 dark:border-gray-700" />
    <div>  

      <CommentReply
        data = {data}
        activeVideo = {activeVideo}
        handleAnswerSubmit={handleAnswerSubmit}
        answerCreationLoading={answerCreationLoading}
         activeQuestionReply={activeQuestionReply}
     setActiveQuestionReply={setActiveQuestionReply}
      
      />
    </div>

  </div>
)}

{activeBar === 3 && (

<div className="mt-8">

{!isReviewExists && (
<div className="flex items-start gap-4">

<Image
src={user.avatar ? user.avatar.url : defaultImage}
alt={user?.name || "User Avatar"}
width={52}
height={52}
className="rounded-full object-cover w-[52px] h-[52px]"
/>

<div className="flex-1">

<h3 className="text-[20px] font-semibold text-black dark:text-white">
Write a Review
</h3>

<p className="text-[14px] text-gray-500 dark:text-gray-400 mt-1">
Share your experience with this course.
</p>

<div className="flex gap-2 mt-5">

{[1,2,3,4,5].map((i)=>

rating >= i ?

<AiFillStar
key={i}
size={30}
color="#F6BA00"
className="cursor-pointer transition hover:scale-110"
onClick={()=>setRating(i)}
/>

:

<AiOutlineStar
key={i}
size={30}
color="#F6BA00"
className="cursor-pointer transition hover:scale-110"
onClick={()=>setRating(i)}
/>

)}

</div>

<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">

{["","Poor","Fair","Good","Very Good","Excellent"][rating]}

</p>

<textarea
  rows={4}
  value={review}
  onChange={(e)=>setReview(e.target.value)}
  placeholder="Share your thoughts..."
  className="
    mt-5
    w-full
    resize-none
    rounded-xl
    border
    border-gray-300
    dark:border-gray-700
    bg-white
    dark:bg-[#0b0d10]
    p-4
    text-[16px]
    text-black
    dark:text-white
    placeholder:text-gray-400
    outline-none
    transition-all
    focus:border-blue-500
    focus:ring-4
    focus:ring-blue-500/10
  "
/>

{(review.trim() !== "" || rating > 0) && (

<div className="flex justify-end gap-3 mt-5">

<button
onClick={()=>{
setReview("");
setRating(0);
}}
className="
px-5
py-2
rounded-full
text-gray-600
dark:text-gray-300
hover:bg-gray-100
dark:hover:bg-[#1d2433]
transition
"
>
Cancel
</button>

<button
disabled={!review.trim() || rating===0 || reviewCreationLoading}
onClick={ reviewCreationLoading ? () =>  {}: handleReviewSubmit}
className={`
px-7
py-2
rounded-full
font-medium
transition

${
review.trim() && rating>0

?

"bg-blue-600 hover:bg-blue-700 text-white"

:

"bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"

}

${
  reviewCreationLoading && 'cursor-no-drop'
}
`}
>

 {reviewCreationLoading ? "Submitting..." : "Submit Review"}
</button>

</div>

)}

</div>

</div>
)}

<div className="mt-10 border-b border-gray-200 dark:border-gray-700"/>

   <div className="mt-8 flex flex-col gap-5">
  {course?.reviews?.map((item: any) => (
    <ReviewItem
      key={item._id}
      item={item}
      user={user}
      handleReviewReply={handleReviewReply}
      replyCreationLoading={replyCreationLoading}
      activeReviewReply={activeReviewReply}
     setActiveReviewReply={setActiveReviewReply}
    />
  ))}
</div>


</div>

)}
 
  
</div>
  )
}


const CommentReply = ({
  data,
  activeVideo,
  handleAnswerSubmit,
  answerCreationLoading,
   activeQuestionReply,
  setActiveQuestionReply,
}: any) => {

  return (
    
    <>
    <div className="w-full my-3">
      {
        data[activeVideo].questions.map((item: any, questionIndex: number) => (
           <CommentItem 
           key = {item._id || `question-${questionIndex}`}
           data = {data}
           activeVideo= {activeVideo}
           item= {item}
           handleAnswerSubmit = {handleAnswerSubmit}
           answerCreationLoading={answerCreationLoading}
            activeQuestionReply={activeQuestionReply}
            setActiveQuestionReply={setActiveQuestionReply}

             />
        ))
      }
    </div>
    </>

  )
}


const CommentItem = ({
      data,
      item,
      handleAnswerSubmit,
      answerCreationLoading,
      activeQuestionReply,
      setActiveQuestionReply,
}: any ) => {

  const [answerText, setAnswerText] = useState("");
  const replyActive = activeQuestionReply === item._id;

  return (
    <>
     <div className="  w-full
      p-5
      rounded-xl
      border
      border-gray-200
      dark:border-white/10
      bg-white
      dark:bg-white/5
      shadow-sm
      my-4 mb-4 ">
      <div className="flex mb-2">
        <div className="w-[50px] h-[50px]">
          <Image
          src={item?.user?.avatar?.url || defaultImage}
          alt={item?.user?.name || "User"}
          width={50}
          height={50}
          className="w-[50px] h-[50px] rounded-full object-cover"
        />
        </div>

        <div className="pl-3">
          <h5 className="text-[20px]">{item?.user.name}</h5>
          <p>{item?.question}</p>
          <small className=' text-[#000000b8] dark:text-[#ffffff83] '>{format(item?.createdAt)} •</small>
        </div>
      </div>


        <div className="w-full flex">
          <span
           className='800:pl-16 dark:text-[#ffffff83]  text-[#0000008] cursor-pointer mr-2 '
          onClick={() => {
          setAnswerText("");

          if (replyActive) {
            setActiveQuestionReply(null);
          } else {
            setActiveQuestionReply(item._id);
          }
        }}
          >
            {!replyActive ? item.questionReplies.length !==0 ? "All Replies"  : "Add Reply" : "Hide Replies"}
            </span>

            <BiMessage size={20} className= 'cursor-pointer dark:text-[#ffffff83] text-[#000000b8]' />
            <span className='pl-1 mt-[-4px] cursor-pointer dark:text-[#ffffff83] text-[#000000b8]'>
              {item.questionReplies.length}
            </span>
        </div>


        {
          replyActive && (
            <>
            {
              item.questionReplies.map((reply:any, replyIndex: number) => (
                <div className="w-full flex pl-4 800:pl-16 my-5 text-black dark:text-white" key={reply._id || `${item._id}-reply-${replyIndex}`}>
                   <Image
                  src={reply?.user?.avatar?.url || defaultImage}
                  alt={reply?.user?.name || "User"}
                  width={50}
                  height={50}
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />

                
        <div className="pl-2">
          <div className="flex items-center"> 
          <h5 className="text-[20px]">{reply?.user.name}</h5>
          { reply?.user?.role === "admin" && <VscVerifiedFilled size={18} className='ml-1 text-blue-500 flex-shrink-0 font-[20px]' />}
          </div>
          <p>{reply?.answer}</p>
          <small className=' text-[#000000b8] dark:text-[#ffffff83] '>
            {format(reply.createdAt)} •
          </small>
        </div>
          </div>
          ))}

              <>
             
                <div className="w-full flex items-center gap-3 mt-4 800:pl-12">
                  <input
                    type="text"
                    placeholder="Write your answer..."
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    className="
                      flex-1
                      bg-transparent
                      border
                      border-gray-300
                      dark:border-gray-700
                      rounded-full
                      px-5
                      py-3
                      text-[16px]
                      text-black
                      dark:text-white
                      placeholder:text-gray-400
                      outline-none
                      focus:border-blue-500
                      transition-all
                    "
                  />

                  <button
                    type="button"
                    onClick={() => {
                      handleAnswerSubmit(answerText, item._id);
                      setAnswerText("");
                    }}
                    className="
                      px-6
                      py-3
                      rounded-full
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      font-medium
                      shadow-md
                      hover:shadow-lg
                      transition-all
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                    disabled={!answerText.trim() || answerCreationLoading}
                  >
                    Submit
                  </button>
                </div>

              
              
              </>
            
            </>
          )
        }
     </div>
    </>
  )

}


const ReviewItem = ({
  item,
  user,
  handleReviewReply,
  replyCreationLoading,
  activeReviewReply,
  setActiveReviewReply,
}: any) => {

  const [replyText, setReplyText] = useState("");
  const replyBoxActive = activeReviewReply === item._id;

  const isAdmin = user?.role === "admin";
  const hasReplies = item?.commentReplies?.length > 0;

  return (
    <div
      className="
        w-full
        p-5
        rounded-xl
        border
        border-gray-200
        dark:border-white/10
        bg-white
        dark:bg-white/5
        shadow-sm
      "
    >
      <div className="flex gap-4">
        <Image
          src={item?.user?.avatar?.url || defaultImage}
          alt={item?.user?.name || "User"}
          width={50}
          height={50}
          className="rounded-full object-cover w-[50px] h-[50px] flex-shrink-0"
        />

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h5 className="font-semibold text-black dark:text-white">
              {item.user.name}
            </h5>

            {item.user.role === "admin" && (
              <VscVerifiedFilled className="text-blue-500" size={18} />
            )}
          </div>

          <div className="flex my-1.5">
            {[1, 2, 3, 4, 5].map((i) =>
              i <= item.rating ? (
                <AiFillStar key={i} size={16} color="#F6BA00" />
              ) : (
                <AiOutlineStar key={i} size={16} color="#F6BA00" />
              )
            )}
          </div>

          <p className="text-[15px] leading-relaxed text-black dark:text-white">
            {item.comment}
          </p>

          <small className="text-gray-500 dark:text-gray-400">
            {format(item.createdAt)}
          </small>
                    {/* only for admins, not visible to anyone else */}
          {isAdmin && (
            <>
              <div className="w-full flex items-center mt-4">
                <span
                  className="cursor-pointer mr-2 text-[#000000b8] dark:text-[#ffffff83]"
                  onClick={() => {
                    setReplyText("");

                    if (replyBoxActive) {
                      setActiveReviewReply(null);
                    } else {
                      setActiveReviewReply(item._id);
                    }
                  }}
                >
                  {!replyBoxActive
                    ? hasReplies
                      ? "All Replies"
                      : "Add Reply"
                    : "Hide Replies"}
                </span>

                <BiMessage
                  size={20}
                  className="cursor-pointer text-[#000000b8] dark:text-[#ffffff83]"
                  onClick={() => {
                    setReplyText("");

                    if (replyBoxActive) {
                      setActiveReviewReply(null);
                    } else {
                      setActiveReviewReply(item._id);
                    }
                  }}
                />

                <span className="pl-1 mt-[-2px] text-[#000000b8] dark:text-[#ffffff83]">
                  {item?.commentReplies?.length || 0}
                </span>
              </div>
              {replyBoxActive && (
                <>
                  {item?.commentReplies?.map((reply: any, replyIndex: number) => (
                    <div
                      className="w-full flex ml-2 800:ml-10 my-4 text-black dark:text-white"
                      key={reply._id || `${item._id}-reply-${replyIndex}`}
                    >
                      <Image
                        src={reply?.user?.avatar?.url || defaultImage}
                        alt={reply?.user?.name || "User"}
                        width={40}
                        height={40}
                        className="w-[40px] h-[40px] rounded-full object-cover flex-shrink-0"
                      />

                      <div className="pl-2">
                        <div className="flex items-center">
                          <h5 className="text-[16px] font-medium">
                            {reply?.user?.name}
                          </h5>
                          {reply?.user?.role === "admin" && (
                            <VscVerifiedFilled
                              size={16}
                              className="ml-1 text-blue-500 flex-shrink-0"
                            />
                          )}
                        </div>
                        <p>{reply?.comment}</p>
                        <small className="text-[#000000b8] dark:text-[#ffffff83]">
                          {format(reply.createdAt)}
                        </small>
                      </div>
                    </div>
                  ))}

                  <div className="w-full flex items-end gap-3 mt-4">
                    <input
                      type="text"
                      placeholder="Write your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="
                        flex-1
                        bg-transparent
                        border
                        border-gray-300
                        dark:border-gray-700
                        rounded-full
                        px-5
                        py-3
                        text-[16px]
                        text-black
                        dark:text-white
                        placeholder:text-gray-400
                        outline-none
                        focus:border-blue-500
                        transition-all
                      "
                    />

                    <button
                      type="button"
                      onClick={() => {
                        handleReviewReply(replyText, item._id);
                        setReplyText("");
                      }}
                      disabled={!replyText.trim() || replyCreationLoading}
                      className="
                        px-6
                        py-3
                        rounded-full
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        font-medium
                        shadow-md
                        hover:shadow-lg
                        transition-all
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                      "
                    >
                      {replyCreationLoading ? "Posting..." : "Submit"}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseContentMedia