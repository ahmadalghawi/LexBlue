import {ArrowRight, CloudCheck, Star, Monitor} from "lucide-react";
import Link from "next/link";

import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import {Course} from "@/types";
import {useEffect, useState} from "react";

export function HomeHighlightedCourseCards({ CardGap } : { CardGap: number })
{
    const [highlightedCourse, setHighlightedCourse] = useState<Course>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchAll = async () => {
        setIsLoading(true)
        try
        {
            console.log("Started fetching courses!");
            const sentQuery = query(collection(db, "courses"), where("rating", ">=", 4));
            const snap = await getDocs(sentQuery);

            const courses = snap.docs.map((d)=>({ id: d.id, ...d.data() } as Course));
            const num = Math.floor(Math.random() * courses.length);
            const pickedCourse = courses[num];
            setHighlightedCourse(pickedCourse);
        }
        catch (e)
        {
            console.error("Homepage: Failed to load courses", e);
        }
        finally
        {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchAll();
    }, []);

    if (isLoading)
    {
        return (
            <div className='w-full flex flex-col xl:flex-row' style={{gap: CardGap}}>
                <div className=' xl:w-4/6 min-h-[386px] bg-background xl:rounded-2xl p-8 flex flex-col gap-2'>
                </div>
                <div className='min-w-[416px] mx-auto xl:mx-0 xl:w-2/6 h-1/2 bg-primary rounded-2xl text-background p-8'> {/*w-[357px] h-[148px]*/}
                    <div className='flex gap-2'>
                    </div>
                </div>
            </div>
        );
    }

    if (!highlightedCourse)
    {
        return (
        <div className='w-full flex flex-col xl:flex-row' style={{gap: CardGap}}>
            <div className=' xl:w-4/6 min-h-[386px] bg-background xl:rounded-2xl p-8 flex flex-col gap-2'>
                <p> There was an error loading courses! </p>
            </div>
            <div className='min-w-[416px] mx-auto xl:mx-0 xl:w-2/6 h-1/2 bg-primary rounded-2xl text-background p-8'> {/*w-[357px] h-[148px]*/}
                <div className='flex gap-2'>
                </div>
            </div>
        </div>
        );
    }

    return (
        <div className='w-full flex flex-col xl:flex-row' style={{gap: CardGap}}>
            <div className=' xl:w-4/6 min-h-[256px] bg-background xl:rounded-2xl p-8 flex flex-col gap-2'> {/*w-[738px] h-[400px]*/}
                <div className='flex gap-8'>
                    <div>
                        <div className='flex gap-2'>
                            <Monitor/>
                            <p>HIGHLIGHTED COURSE</p>
                        </div>

                        {/* TODO: Pick a course instead of index 0! */}
                        <div style={{display: isLoading ? "none" : "block"}}>
                            <h1 className='text-4xl font-bold'>{highlightedCourse.title}</h1>
                            <p>{highlightedCourse.longDescription}</p>
                        </div>
                    </div>
                    <div className='max-h-[196px] min-w-1/3 hidden xl:block'>
                        <img src={highlightedCourse.thumbnailUrl}
                             className='h-full ml-auto rounded-2xl ring-2 ring-primary'/>
                    </div>
                </div>
                <div className='mt-16 flex'>
                    <div className='mt-auto'>
                        <p>Instructor: {highlightedCourse.instructorName}</p>
                    </div>
                    <div className='ml-auto '>
                        <Link href={`/courses/${highlightedCourse.id}`} className=''>
                            <button className='w-[48px] h-[48px] bg-muted-foreground/50  rounded-full group/arrowParent hover:scale-[102%] transition-transform cursor-pointer'>
                                <ArrowRight className='m-auto h-full group-hover/arrowParent:translate-x-0.5 transition-transform'/>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className='sm:min-w-[416px] mx-auto xl:mx-0 xl:w-2/6 h-1/2 bg-primary rounded-2xl text-background p-8'> {/*w-[357px] h-[148px]*/}
                <CloudCheck className='scale-125'/>
                <div className='flex gap-2'>
                    <h1 className='font-bold text-3xl '>{highlightedCourse.rating}</h1>
                    <Star className='my-auto'/>
                </div>
                <p className='text-background/75'>COURSE RATING</p>
            </div>
        </div>
    );
}