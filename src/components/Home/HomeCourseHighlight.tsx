"use client";

import {ArrowRight, CloudCheck, Monitor, Shield} from "lucide-react";
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import {Course} from "@/types";
import {useEffect, useState} from "react";
import Link from "next/link";

export function HomeCourseHighlight()
{

    const [fetchedCourses, setFetchedCourses] = useState<Course[]>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchAll = async () => {
        setIsLoading(true)
        try
        {
            const sentQuery = query(collection(db, "courses"));
            const snap = await getDocs(sentQuery);
            setFetchedCourses(snap.docs.map((d)=>({ id: d.id, ...d.data() } as Course)))
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
        return ( <></>);
    }

    return (
        <div className='grow h-max bg-secondary/25 '>
            <div className='m-16 max-w-7xl mx-auto'>
                <div className='mx-auto xl:mx-0 w-2/3'>
                    <h1 className='text-[36px] font-bold'>Master the Digital Infrastructre</h1>
                    <div className='w-[96px] border-b-4 rounded-full border-primary'/>
                </div>

                <div className='flex flex-col xl:max-h-[800px] mt-16 gap-8'>
                    <div className='h-[55%] flex flex-col xl:flex-row gap-8'>
                        <div className=' xl:w-4/6 min-h-[256px] bg-background xl:rounded-2xl p-8 flex flex-col gap-2'> {/*w-[738px] h-[400px]*/}
                            <div className='flex gap-8'>
                                <div>
                                    <div className='flex gap-2'>
                                        <Monitor/>
                                        <p>HIGHLIGHTED COURSE</p>
                                    </div>

                                    {/* TODO: Pick a course instead of index 0! */}
                                    <div style={{display: isLoading ? "none" : "block"}}>
                                        <h1 className='text-4xl font-bold'>{fetchedCourses[0].title}</h1>
                                        <p>{fetchedCourses[0].longDescription}</p>
                                    </div>
                                </div>
                                <div className='max-h-[196px] min-w-1/3' style={{display: isLoading ? "none" : "block"}}>
                                    <img src={fetchedCourses[0].thumbnailUrl}
                                         className='h-full ml-auto rounded-2xl ring-2 ring-primary'/>
                                </div>
                            </div>
                            <div className='mt-16 flex'>
                                <div className='mt-auto'>
                                    <p>Instructor: {fetchedCourses[0].instructorName}</p>
                                </div>
                                <div className='ml-auto ' style={{display: isLoading ? "none" : "block"}}>
                                    <Link href={`/courses/${fetchedCourses[0].id}`} className=''>
                                        <button className='w-[48px] h-[48px] bg-muted-foreground/50  rounded-full group/arrowParent hover:scale-[102%] transition-transform cursor-pointer'>
                                            <ArrowRight className='m-auto h-full group-hover/arrowParent:translate-x-0.5 transition-transform'/>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className='min-w-[416px] mx-auto xl:mx-0 xl:w-2/6 h-1/2 bg-primary rounded-2xl text-background p-8'> {/*w-[357px] h-[148px]*/}
                            <CloudCheck className='scale-125'/>
                            <h1 className='font-bold text-3xl '>98%</h1>
                            <p className='text-background/75'>JOB PLACEMENT</p>
                        </div>

                    </div>
                    <div className='h-[45%]'>
                        <div className='flex flex-col xl:flex-row gap-8 h-full'>
                            <div className='min-h-[345px] w-[345px] mx-auto xl:mx-0 xl:w-4/6 flex flex-col xl:grid xl:grid-cols-2 gap-8'>
                                <div className='grow bg-background rounded-2xl p-8 flex flex-col'>
                                    <div className='rounded-lg bg-secondary w-[48px] h-[48px] mb-4'>
                                        <Shield className='h-full m-auto'/>
                                    </div>
                                    <h1 className='font-bold text-2xl/12'>Cybersecurity</h1>
                                    <p className='text-foreground/50'>Protecting the artisanal web through elite defensive tactics.</p>
                                </div>
                                <div className='min-h-[345px] grow rounded-2xl flex flex-col
                    bg-[url(https://images.unsplash.com/photo-1683322499436-f4383dd59f5a?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] '>
                                    <div className='rounded-2xl bg-gradient-to-t from-primary/30 to-background-50/0 h-1/3 flex p-8 mt-auto'>

                                        <p className='text-white text-xl font-bold mt-auto'>Cloud Infra 2026</p>
                                    </div>
                                </div>

                            </div>

                            <div className='min-h-[200px] xl:w-2/6 h-1/2 bg-background xl:rounded-2xl p-8 flex flex-col text-foreground'>
                                <p className='text-sm text-foreground/65'>IN PROGRESS</p>
                                <h1 className='text-3xl font-bold'>Rust: System Performance</h1>
                                <div className='w-full h-3 bg-accent rounded-2xl mt-auto'>
                                    <div className='h-full bg-primary rounded-2xl w-2/3'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}