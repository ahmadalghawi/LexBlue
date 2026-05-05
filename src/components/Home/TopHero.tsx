import {ArrowRight, CloudCheck, Monitor} from "lucide-react";
import Link from "next/link";

export function TopHero() {
    return (
        <div className='px-6 xl:px-16 py-16 grow h-max shadow-md '>
            <div className='flex flex-row gap-32 max-w-7xl mx-auto'>
                <div className='max-w-[578px] grow m-auto'>
                    <div className='rounded-2xl my-8 text-sm font-bold px-3 py-1 w-max bg-primary/20'>
                        <p>ENGINEERING & TECH</p>
                    </div>

                    <div className='text-[54px]/14 sm:text-[72px]/18 '>
                        <h1 className='font-bold font-headline'>Artisanal Digital Craft:</h1>
                        <div className='h-[16px]'/>
                        <h1 className='font-bold text-primary font-label text-[54px]/15 sm:text-[72px]/24'>Mastering the Tech Stack.</h1>
                    </div>

                    <p className='mt-6 mb-12'>
                        Build your future with curated engineering paths, from system architecture to elegant code, we master the complexity of the modern IT landscape.
                    </p>

                    <div className='w-full flex'>
                        <Link href={"/learn"}
                              className='w-3/8 mx-auto'>
                            <button className='select-none rounded-lg ring-1 w-full bg-primary text-background ring-ring p-4 hover:drop-shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer'>Start your journey</button>
                        </Link>
                        <Link href={"/courses"}
                              className='w-3/8 mx-auto'>
                            <button className='select-none rounded-lg ring-1 w-full bg-background p-4 hover:drop-shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer'>Browse Courses</button>
                        </Link>
                    </div>
                </div>

                <div className='xl:block hidden grow'>
                    <img
                        src='https://images.unsplash.com/photo-1565021324739-7493c5a74a13?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                        alt='Home_Blue_Computer'
                        className='aspect-auto min-w-[536px] min-h-[670px] max-w-[536px] max-h-[670px] m-auto rounded-2xl drop-shadow-lg drop-shadow-primary/35'
                    />
                </div>
            </div>
        </div>
    );
}