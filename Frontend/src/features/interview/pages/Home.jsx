import React, { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { useNavigate } from 'react-router'
import Loader from '../../../components/Loader.jsx'

const Home = () => {
    const { loading, generateReport, reports } = useInterview()
    const { handleLogout } = useAuth()

    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ resumeName, setResumeName ] = useState("")
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const onLogout = async () => {
        await handleLogout()
        navigate('/login', { replace: true })
    }

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[ 0 ]

        if (!jobDescription.trim()) {
            toast.error('Please provide the target job description')
            return
        }
        if (!resumeFile && !selfDescription.trim()) {
            toast.error('Please upload a resume or add a self-description')
            return
        }

        const report = await generateReport({ jobDescription, selfDescription, resumeFile })
        if (report?._id) {
            navigate(`/interview/${report._id}`)
        }
    }

    if (loading) {
        return <Loader message='Loading your interview plan...' />
    }

    return (
        <>
            {/* Background Layers */}
            <div className='fixed inset-0 cyber-grid pointer-events-none'></div>
            <div className='fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(0,105,111,0.1)_0%,transparent_60%)]'></div>

            <main className='relative z-10 min-h-screen px-margin-mobile md:px-margin-desktop py-12'>

                {/* Top bar: logout */}
                <div className='max-w-container-max mx-auto flex justify-end mb-6'>
                    <button
                        onClick={onLogout}
                        title='Logout'
                        className='w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/20 text-on-surface-variant hover:text-error hover:border-error/40 transition-all'>
                        <span className='material-symbols-outlined text-[20px]'>logout</span>
                    </button>
                </div>

                {/* Header */}
                <header className='max-w-4xl mx-auto mb-12 md:mb-16 text-center fade-in'>
                    <div className='inline-block px-3 py-1 bg-primary/5 border border-primary/10 rounded-full mb-6'>
                        <p className='text-label-sm font-label-sm text-primary-fixed uppercase tracking-widest'>Command Center v2.0</p>
                    </div>
                    <h2 className='text-headline-lg-mobile md:text-headline-lg font-headline-lg mb-4'>
                        Create Your Custom{' '}
                        <span className='text-secondary-container whitespace-nowrap'>
                            Interview Plan
                            <span className='material-symbols-outlined align-middle ml-2' style={{ fontSize: '0.7em', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                        </span>
                    </h2>
                    <p className='text-body-lg text-on-surface-variant max-w-2xl mx-auto'>
                        Let our AI analyze the job requirements and your unique profile to build a winning strategy.
                    </p>
                </header>

                {/* Input Panels */}
                <section className='max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-gutter'>

                    {/* Left Panel: Job Description */}
                    <div className='glass-surface p-6 md:p-8 rounded-xl relative scanline-overlay overflow-hidden fade-in'>
                        <div className='flex items-center justify-between mb-6 md:mb-8'>
                            <div className='flex items-center gap-3'>
                                <span className='material-symbols-outlined text-primary-fixed'>work</span>
                                <h3 className='text-headline-md font-headline-md'>Target Job Description</h3>
                            </div>
                            <span className='bg-error/10 text-error text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-tighter border border-error/20'>Required</span>
                        </div>
                        <div className='relative cyber-glow-primary'>
                            <textarea
                                onChange={(e) => { setJobDescription(e.target.value) }}
                                maxLength={5000}
                                className='w-full h-[300px] md:h-[400px] bg-surface-container-low/50 border border-outline-variant/30 rounded-lg p-4 md:p-6 font-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:ring-0 focus:border-primary-fixed/50 transition-all custom-scrollbar resize-none'
                                placeholder="Paste the full job description here... e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                            />
                            <div className='absolute bottom-4 right-4 text-mono-data text-label-sm text-on-surface-variant/50'>{jobDescription.length} / 5000 chars</div>
                        </div>
                    </div>

                    {/* Right Panel: Profile */}
                    <div className='glass-surface p-6 md:p-8 rounded-xl relative overflow-hidden flex flex-col fade-in'>
                        <div className='flex items-center gap-3 mb-6 md:mb-8'>
                            <span className='material-symbols-outlined text-primary-fixed'>person_search</span>
                            <h3 className='text-headline-md font-headline-md'>Your Profile</h3>
                        </div>

                        {/* Upload Resume */}
                        <div className='mb-6'>
                            <div className='flex items-center gap-2 mb-4'>
                                <span className='text-label-sm font-label-sm uppercase tracking-widest text-on-surface'>Upload Resume</span>
                                <span className='bg-primary/10 text-primary-fixed text-[10px] font-bold px-2 py-0.5 rounded tracking-tighter'>BEST RESULTS</span>
                            </div>
                            <label
                                htmlFor='resume'
                                className='border-2 border-dashed border-outline-variant/30 rounded-lg p-8 md:p-10 flex flex-col items-center justify-center bg-surface-container-lowest/50 hover:bg-surface-container-low/50 hover:border-primary-fixed/40 transition-all cursor-pointer group'>
                                <div className='w-16 h-16 bg-primary-fixed/5 rounded-[50%] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                    <span className='material-symbols-outlined text-secondary-container text-4xl'>{resumeName ? 'check_circle' : 'cloud_upload'}</span>
                                </div>
                                {resumeName ? (
                                    <>
                                        <p className='text-body-md font-bold text-primary-fixed break-all text-center'>{resumeName}</p>
                                        <p className='text-label-sm text-on-surface-variant/60 mt-1'>Click to replace</p>
                                    </>
                                ) : (
                                    <>
                                        <p className='text-body-md font-bold text-on-surface group-hover:text-primary-fixed transition-colors'>Click to upload or drag &amp; drop</p>
                                        <p className='text-label-sm text-on-surface-variant/60 mt-1'>PDF or DOCX (Max 5MB)</p>
                                    </>
                                )}
                                <input
                                    ref={resumeInputRef}
                                    onChange={(e) => { setResumeName(e.target.files?.[ 0 ]?.name || "") }}
                                    hidden type='file' id='resume' name='resume' accept='.pdf,.docx' />
                            </label>
                        </div>

                        {/* OR Divider */}
                        <div className='relative flex items-center justify-center my-2'>
                            <div className='w-full border-t border-outline-variant/10'></div>
                            <span className='absolute px-4 bg-surface text-label-sm font-mono-data text-on-surface-variant/40'>OR</span>
                        </div>

                        {/* Quick Self-Description */}
                        <div className='flex-1 mt-4'>
                            <p className='text-label-sm font-label-sm uppercase tracking-widest text-on-surface mb-4'>Quick Self-Description</p>
                            <div className='relative cyber-glow-primary'>
                                <textarea
                                    onChange={(e) => { setSelfDescription(e.target.value) }}
                                    id='selfDescription'
                                    name='selfDescription'
                                    className='w-full h-[120px] bg-surface-container-low/50 border border-outline-variant/30 rounded-lg p-4 font-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:ring-0 focus:border-primary-fixed/50 transition-all resize-none'
                                    placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                                />
                            </div>
                            <div className='mt-4 p-4 bg-primary/5 rounded-lg flex gap-3 border border-primary/10'>
                                <span className='material-symbols-outlined text-primary-fixed text-xl'>info</span>
                                <p className='text-label-sm leading-relaxed text-on-surface-variant'>
                                    Either a <span className='text-on-surface font-bold italic'>Resume</span> or a <span className='text-on-surface font-bold italic'>Self Description</span> is required to generate a personalized plan.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bottom Action Bar */}
                <div className='max-w-container-max mx-auto mt-gutter flex flex-col md:flex-row items-center justify-between gap-6 glass-surface p-6 rounded-xl'>
                    <p className='text-label-sm font-mono-data text-on-surface-variant text-center md:text-left'>AI-Powered Strategy Generation • Approx 30s</p>
                    <button
                        onClick={handleGenerateReport}
                        className='cyber-glow-button w-full md:w-auto px-10 py-4 bg-secondary-container text-on-secondary-container font-headline-md text-headline-md rounded-lg flex items-center justify-center gap-3 active:scale-95'>
                        <span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                        <span>Analyze &amp; Generate Strategy</span>
                    </button>
                </div>

                {/* Recent Plans */}
                {reports?.length > 0 && (
                    <section className='max-w-container-max mx-auto mt-20 md:mt-24'>
                        <h3 className='text-headline-md font-headline-md mb-8 flex items-center gap-3'>
                            <span className='material-symbols-outlined text-primary-fixed'>history</span>
                            My Recent Interview Plans
                        </h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter'>
                            {reports.map(report => {
                                const highScore = report.matchScore >= 80
                                return (
                                    <div
                                        key={report._id}
                                        onClick={() => navigate(`/interview/${report._id}`)}
                                        className={`glass-surface p-6 rounded-xl border-l-4 transition-all cursor-pointer ${highScore ? 'border-l-primary-fixed/40 hover:border-l-primary-fixed' : 'border-l-error/40 hover:border-l-error'}`}>
                                        <div className='flex justify-between items-start mb-4 gap-2'>
                                            <h4 className='font-bold text-on-surface'>{report.title || 'Untitled Position'}</h4>
                                            <span className='text-mono-data text-[10px] text-on-surface-variant whitespace-nowrap'>ID: {report._id.slice(-6).toUpperCase()}</span>
                                        </div>
                                        <p className='text-label-sm text-on-surface-variant mb-4'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                        <div className='flex items-center justify-between'>
                                            <span className={`text-label-sm font-bold uppercase tracking-widest ${highScore ? 'text-primary-fixed' : 'text-secondary-container'}`}>Match Score: {report.matchScore}%</span>
                                            <span className='material-symbols-outlined text-on-surface-variant'>chevron_right</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className='max-w-container-max mx-auto mt-20 md:mt-24 py-8 border-t border-outline-variant/10 text-center'>
                    <p className='text-label-sm font-label-sm font-bold text-primary-fixed uppercase tracking-widest mb-2'>SkillSync AI</p>
                    <p className='text-label-sm text-on-surface-variant'>Powered by AI</p>
                </footer>
            </main>
        </>
    )
}

export default Home
