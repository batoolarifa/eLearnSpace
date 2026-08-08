import { useGetCourseContentQuery } from '../../../redux/features/courses/coursesApi';
import React, { useEffect, useState } from 'react'
import Loader from '../Loader/Loader';
import CourseContentMedia  from "./CourseContentMedia";
import Header from "../Header";
import CourseContentList from './CourseContentList';

type Props = {
    id: string;
    user: any;
}


const CourseContent = ({id, user}: Props)  => {

    const {data:contentData, isLoading, refetch} = useGetCourseContentQuery(id, { refetchOnMountOrArgChange: true});
    const [open, setOpen] = useState(false)

    const data = contentData?.content;
    const[activeVideo, setActiveVideo] = useState(0);
    const[route, setRoute] = useState('Login');

    useEffect(() => {
        if (data && data[activeVideo]) {
          document.title = data[activeVideo].title;
        }
      }, [data, activeVideo]);
        
  return (
    <>
    
     {
        isLoading ?   (
         
          <Loader />   
        
        ) : (   
                <>
                    <Header
                        open={open}
                        setOpen={setOpen}
                        activeItem={1}
                        setRoute={setRoute}
                        route={route}
                      />
                  
                <div className="w-full grid 800:grid-cols-10">
                  <div className='col-span-7'>
                      <CourseContentMedia  
                      data= {data} 
                      id={id}
                      activeVideo = {activeVideo}
                      setActiveVideo={setActiveVideo}
                      user={user}
                      refetch={refetch}
                      
                      />
                     </div>

                     <div className='hidden 800:block 800:col-span-3'>
                      <CourseContentList 
                         setActiveVideo={setActiveVideo}
                         data= {data}
                         activeVideo={activeVideo}
                       />

                     </div>
                 
                </div>

                </>
            ) 
        }
    
    </>
  )
}

export default CourseContent;
