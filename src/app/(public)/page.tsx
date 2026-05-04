import {ArrowRight, CloudCheck, Monitor, Shield} from "lucide-react";
import Link from "next/link";
import {TopHero} from "@/components/Home/TopHero";
import {HomeCourseHighlight} from "@/components/Home/HomeCourseHighlight";
import {EmailList} from "@/components/Home/EmailList";

export const metadata = {
  title: "LexBlue | Home",
  description: "Discover the best programming courses.",
};

export default function HomePage() {

/*  function HandleEmailListSignup(aEvent : React.SyntheticEvent<HTMLFormElement>)
  {

  }*/

  return (
      <div className='flex flex-col'>
        <TopHero/>
        <HomeCourseHighlight/>
        <EmailList/>
      </div>
  );
}

/* TEMP Source: https://images.unsplash.com/photo-1565021324739-7493c5a74a13?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D */
    /*<div className="container mx-auto p-8 flex justify-center items-center h-[60vh]">
      <h1 className="text-4xl font-headline font-bold text-primary">LexBlues</h1>
    </div>*/
