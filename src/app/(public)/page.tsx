import {ArrowRight, CloudCheck, Monitor, Shield} from "lucide-react";
import Link from "next/link";

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
        <div className='px-6 xl:px-16 py-16 grow h-max shadow-md '>
          <div className='flex flex-row gap-32 max-w-7xl mx-auto'>
            <div className='max-w-[578px] grow m-auto'>
              <div className='rounded-2xl my-8 text-sm font-bold px-3 py-1 w-max bg-primary/20'>
                <p>ENGINEERING & TECH</p>
              </div>

              <div className='text-[72px]/18 '>
                <h1 className='font-bold font-headline'>Artisanal Digital Craft:</h1>
                <div className='h-[16px]'/>
                <h1 className='font-bold text-primary font-label text-[72px]/24'>Mastering the Tech Stack.</h1>
              </div>

              <p className='mt-6 mb-12'>
                Build your future with curated engineering paths, from system architecture to elegant code, we master the complexity of the modern IT landscape.
              </p>

              <div className='w-full flex'>
                <Link href={"/learn"}
                className='w-3/8 mx-auto'>
                  <button className='select-none rounded-lg ring-1 w-full bg-primary text-background ring-ring p-4 hover:-translate-y-0.5 transition-all cursor-pointer'>Start your journey</button>
                </Link>
                <Link href={"/courses"}
                className='w-3/8 mx-auto'>
                  <button className='select-none rounded-lg ring-1 w-full bg-background p-4 hover:-translate-y-0.5 transition-all cursor-pointer'>Browse Courses</button>
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
        <div className='grow h-max bg-secondary/25 '>
          <div className='m-16 max-w-7xl mx-auto'>
            <div className='mx-auto xl:mx-0 w-2/3'>
              <h1 className='text-[36px] font-bold'>Master the Digital Infrastructre</h1>
              <div className='w-[96px] border-b-4 rounded-full border-primary'/>
            </div>

            <div className='flex flex-col xl:max-h-[800px] mt-16 gap-8'>
              <div className='h-[55%] flex flex-col xl:flex-row gap-8'>
                <div className=' xl:w-4/6 min-h-[256px] bg-background xl:rounded-2xl p-8 flex flex-col gap-2'> {/*w-[738px] h-[400px]*/}
                  <div className='flex gap-2'>
                    <Monitor/>
                    <p>SIGNATURE TRACK</p>
                  </div>
                  <h1 className='text-4xl font-bold'>TITLE OF SOME FEATURED COURSE FETCHED IN THE DATABASE</h1>
                  <div className='mt-auto flex flex-row'>
                      {/*<p className='mt-auto'>Social icons here...</p>*/}
                      <div className='ml-auto'>
                        <button className='bg-muted-foreground/50 w-[48px] h-[48px] rounded-full group/arrowParent hover:scale-[102%] transition-transform cursor-pointer'>
                          <ArrowRight className='m-auto h-full group-hover/arrowParent:translate-x-0.5 transition-transform'/>
                        </button>
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
                      <div className='rounded-2xl bg-gradient-to-t from-primary/50 to-background-50/0 h-1/3 flex p-8 mt-auto'>

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
        <div className='w-full p-6 xl:p-16'>
          <div className='mx-auto w-full text-center'>
            <h1 className='text-4xl font-bold'>Join the LexBlue Stack</h1>
            <div className='text-foreground/70'>
              <p>Weekly deep-dives into engineering culture, emerging stacks, and IT strategy.</p>
              <p>Minimal noise, maximum technical signal.</p>
            </div>

            {/* TODO: Implement email list..? */}
            <div className='flex flex-col gap-2 mx-auto max-w-[512px] mt-8'> {/*onSubmit={HandleEmailListSignup}*/}
              <input type='email' name='emailField' placeholder='Your email'
              className='bg-background text-foreground grow rounded-md ring h-[32px] p-4'/>
              <label htmlFor='emailField' className='my-auto'></label>
              <input type='submit' className='cursor-pointer bg-primary w-max px-4 py-2 rounded-lg mx-auto ring ring-ring text-background hover:-translate-y-0.5 transition-all' value='Sign up'></input>
            </div>

          </div>
        </div>
      </div>
  );
}

/* TEMP Source: https://images.unsplash.com/photo-1565021324739-7493c5a74a13?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D */
    /*<div className="container mx-auto p-8 flex justify-center items-center h-[60vh]">
      <h1 className="text-4xl font-headline font-bold text-primary">LexBlues</h1>
    </div>*/
