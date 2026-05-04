
export function EmailList()
{
    return (
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
    );
}