import React from 'react'

/**
 * Full-screen themed loading state used across the app.
 * Matches the SkillSync "command center" dark aesthetic.
 */
const Loader = ({ message = 'Loading...' }) => {
    return (
        <>
            {/* Background Layers */}
            <div className='fixed inset-0 grid-bg pointer-events-none'></div>
            <div className='fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(0,105,111,0.1)_0%,transparent_70%)]'></div>

            <main className='relative z-10 min-h-screen flex flex-col items-center justify-center gap-6'>
                <div className='relative w-16 h-16'>
                    {/* Glow */}
                    <div className='absolute inset-0 rounded-[50%] bg-primary-fixed blur-xl opacity-20 animate-pulse'></div>
                    {/* Track */}
                    <div className='absolute inset-0 rounded-[50%] border-2 border-outline-variant/20'></div>
                    {/* Spinner */}
                    <div className='absolute inset-0 rounded-[50%] border-2 border-transparent border-t-primary-fixed animate-spin'></div>
                </div>
                <p className='text-label-sm font-label-sm text-outline uppercase tracking-widest animate-pulse'>{message}</p>
            </main>
        </>
    )
}

export default Loader
