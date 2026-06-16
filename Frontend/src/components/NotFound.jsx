import React from 'react'
import { useNavigate } from 'react-router'

/**
 * Catch-all 404 screen for unknown routes — matches the SkillSync dark theme.
 */
const NotFound = () => {
    const navigate = useNavigate()

    return (
        <>
            {/* Background Layers */}
            <div className='fixed inset-0 cyber-grid pointer-events-none'></div>
            <div className='fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(0,105,111,0.1)_0%,transparent_70%)]'></div>
            <div className='scanline'></div>

            <main className='relative z-10 min-h-screen flex flex-col items-center justify-center gap-6 px-margin-mobile text-center'>
                <p className='text-[96px] md:text-[140px] font-headline-lg font-black leading-none text-primary-fixed'>404</p>
                <div>
                    <h1 className='text-headline-md font-headline-md text-on-surface mb-2'>Signal Lost</h1>
                    <p className='text-body-md text-on-surface-variant max-w-md'>
                        This sector doesn't exist on the grid. The page you're looking for may have been moved or never existed.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className='flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary-container text-on-secondary-container font-bold uppercase tracking-widest text-label-sm cyber-glow-accent hover:opacity-90 transition-all active:scale-95'>
                    <span className='material-symbols-outlined text-[18px]'>home</span>
                    Back to Home
                </button>
            </main>
        </>
    )
}

export default NotFound
