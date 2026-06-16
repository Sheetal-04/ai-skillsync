import React, { useState, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { getAllInterviewReports } from '../services/interview.api.js'
import { useNavigate, useParams } from 'react-router'
import Loader from '../../../components/Loader.jsx'

const TABS = [
    { id: 'technical', label: 'Technical Questions', icon: 'code' },
    { id: 'behavioral', label: 'Behavioral Questions', icon: 'forum' },
    { id: 'roadmap', label: 'Road Map', icon: 'map' },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    return (
        <div className='glass-panel rounded-xl overflow-hidden'>
            <div className='p-5 md:p-6 flex gap-4 md:gap-6 items-start cursor-pointer transition-all hover:bg-white/5' onClick={() => setOpen(o => !o)}>
                <div className='w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-secondary-container/10 border border-secondary-container/30 text-secondary-container flex items-center justify-center rounded-lg font-bold text-label-sm'>Q{index + 1}</div>
                <div className='flex-1 min-w-0'>
                    <p className='text-body-md text-on-surface font-medium leading-relaxed'>{item.question}</p>
                    {open && (
                        <div className='mt-4 pt-4 border-t border-outline-variant/10 space-y-4 fade-in'>
                            <div>
                                <span className='text-label-sm font-label-sm uppercase tracking-widest text-primary-fixed flex items-center gap-1 mb-2'>
                                    <span className='material-symbols-outlined text-[14px]'>psychology</span>Intention
                                </span>
                                <p className='text-body-md text-on-surface-variant leading-relaxed'>{item.intention}</p>
                            </div>
                            <div>
                                <span className='text-label-sm font-label-sm uppercase tracking-widest text-secondary-container flex items-center gap-1 mb-2'>
                                    <span className='material-symbols-outlined text-[14px]'>lightbulb</span>Model Answer
                                </span>
                                <p className='text-body-md text-on-surface-variant leading-relaxed'>{item.answer}</p>
                            </div>
                        </div>
                    )}
                </div>
                <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${open ? 'rotate-180' : ''}`}>expand_more</span>
            </div>
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='glass-panel rounded-xl p-6'>
        <div className='flex items-center gap-3 mb-4'>
            <span className='px-3 py-1 rounded-full bg-primary/10 text-primary-fixed text-label-sm font-bold border border-primary-fixed/20 whitespace-nowrap'>Day {day.day}</span>
            <h3 className='text-body-lg font-bold text-on-surface'>{day.focus}</h3>
        </div>
        <ul className='space-y-2'>
            {day.tasks.map((task, i) => (
                <li key={i} className='flex gap-3 text-on-surface-variant text-body-md leading-relaxed'>
                    <span className='material-symbols-outlined text-primary-fixed text-[18px] mt-0.5 flex-shrink-0'>check_circle</span>
                    <span>{task}</span>
                </li>
            ))}
        </ul>
    </div>
)

const MatchGauge = ({ score }) => {
    const radius = 80
    const circumference = 2 * Math.PI * radius
    const [ offset, setOffset ] = useState(circumference)

    useEffect(() => {
        const t = setTimeout(() => setOffset(circumference - (score / 100) * circumference), 300)
        return () => clearTimeout(t)
    }, [ score, circumference ])

    return (
        <div className='relative w-44 h-44 md:w-48 md:h-48 flex items-center justify-center'>
            <svg className='w-full h-full'>
                <circle cx='50%' cy='50%' fill='none' r={radius} stroke='rgba(255,255,255,0.05)' strokeWidth='12' />
                <circle
                    className='match-gauge-circle'
                    cx='50%' cy='50%' fill='none' r={radius}
                    stroke='url(#cyanGradient)' strokeLinecap='round' strokeWidth='12'
                    style={{ strokeDasharray: circumference, strokeDashoffset: offset }} />
                <defs>
                    <linearGradient id='cyanGradient' x1='0%' x2='100%' y1='0%' y2='0%'>
                        <stop offset='0%' stopColor='#00dbe7' />
                        <stop offset='100%' stopColor='#74f5ff' />
                    </linearGradient>
                </defs>
            </svg>
            <div className='absolute inset-0 flex flex-col items-center justify-center'>
                <span className='text-[56px] font-black leading-none text-primary-fixed'>{score}</span>
                <span className='text-headline-md font-bold text-primary-fixed mt-[-4px] opacity-60'>%</span>
            </div>
        </div>
    )
}

const severityStyle = (severity) => {
    if (severity === 'high') {
        return { wrap: 'border-secondary-container/40 bg-secondary-container/5', text: 'text-secondary-container', icon: 'error' }
    }
    if (severity === 'medium') {
        return { wrap: 'border-outline-variant/40 bg-surface-variant/20', text: 'text-on-surface-variant', icon: 'warning' }
    }
    return { wrap: 'border-outline-variant/40 bg-surface-variant/20', text: 'text-on-surface-variant', icon: 'info' }
}

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const [ recentReports, setRecentReports ] = useState([])
    const { report, loading, pdfLoading, reportError, getResumePdf } = useInterview()
    const { handleLogout } = useAuth()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    // Fetch the report list independently so it doesn't clash with the
    // single-report loading state used by the main view.
    useEffect(() => {
        let active = true
        getAllInterviewReports()
            .then((res) => { if (active && res?.interviewReports) setRecentReports(res.interviewReports) })
            .catch(() => {})
        return () => { active = false }
    }, [])

    // Still loading (or haven't attempted yet) → spinner; failed → not-found screen.
    if (loading || (!report && !reportError)) {
        return <Loader message='Loading your interview plan...' />
    }

    if (reportError || !report) {
        return (
            <>
                <div className='fixed inset-0 cyber-grid pointer-events-none'></div>
                <main className='relative z-10 min-h-screen flex flex-col items-center justify-center gap-6 px-margin-mobile text-center'>
                    <span className='material-symbols-outlined text-error text-6xl'>error</span>
                    <div>
                        <h1 className='text-headline-md font-headline-md text-on-surface mb-2'>Report not found</h1>
                        <p className='text-body-md text-on-surface-variant'>We couldn't load this interview plan. It may have been removed.</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className='px-6 py-3 rounded-lg bg-secondary-container text-on-secondary-container font-bold uppercase tracking-widest text-label-sm cyber-glow-accent hover:opacity-90 transition-all active:scale-95'>
                        Back to Home
                    </button>
                </main>
            </>
        )
    }

    const otherReports = recentReports.filter((r) => r._id !== interviewId)

    const onLogout = async () => {
        await handleLogout()
        navigate('/login', { replace: true })
    }

    const matchLabel =
        report.matchScore >= 80 ? 'Strong match for this role' :
            report.matchScore >= 60 ? 'Moderate match for this role' : 'Low match for this role'

    const activeCount =
        activeNav === 'technical' ? report.technicalQuestions.length :
            activeNav === 'behavioral' ? report.behavioralQuestions.length :
                report.preparationPlan.length

    return (
        <>
            {/* Background Layers */}
            <div className='fixed inset-0 cyber-grid pointer-events-none'></div>
            <div className='fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(0,105,111,0.1)_0%,transparent_60%)]'></div>

            <div className='relative z-10 min-h-screen'>

                {/* ── Top Header ── */}
                <header className='sticky top-0 z-40 px-margin-mobile md:px-margin-desktop py-4 flex justify-between items-center gap-4 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/10'>
                    <div className='flex items-center gap-3 md:gap-4 min-w-0'>
                        <button
                            onClick={() => navigate('/')}
                            title='New Plan'
                            className='w-10 h-10 flex-shrink-0 bg-primary-container flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(0,242,255,0.15)]'>
                            <span className='material-symbols-outlined text-on-primary-container' style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
                        </button>
                        <div className='min-w-0'>
                            <h2 className='text-headline-md font-headline-md font-black text-primary-fixed tracking-tighter truncate'>{report.title || 'Analytics Command'}</h2>
                            <p className='text-label-sm font-label-sm text-on-surface-variant opacity-70'>Interview Command</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        title='Logout'
                        className='flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-outline-variant/20 text-on-surface-variant hover:text-error hover:border-error/40 transition-all text-sm font-medium'>
                        <span className='material-symbols-outlined text-[18px]'>logout</span>
                        <span className='hidden sm:inline'>Logout</span>
                    </button>
                </header>

                {/* ── Body ── */}
                <div className='p-gutter lg:p-margin-desktop'>
                    <div className='max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start'>

                        {/* Right Sidebar Area (Analytics) — shown first on mobile, right on desktop */}
                        <aside className='lg:col-span-4 lg:order-2 space-y-gutter lg:sticky lg:top-24 order-1'>
                            {/* Match Score Gauge */}
                            <div className='glass-panel rounded-2xl p-6 md:p-8 flex flex-col items-center text-center'>
                                <p className='text-label-sm font-label-sm text-on-surface-variant uppercase tracking-[0.2em] mb-6 md:mb-8'>Match Score</p>
                                <MatchGauge score={report.matchScore} />
                                <div className='mt-6 md:mt-8 px-4 py-2 bg-primary/10 border border-primary-fixed/20 rounded-full'>
                                    <p className='text-label-sm font-label-sm text-primary-fixed uppercase'>{matchLabel}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className='space-y-3'>
                                <button
                                    onClick={() => getResumePdf(interviewId)}
                                    disabled={pdfLoading}
                                    className='w-full py-4 rounded-lg flex items-center justify-center gap-2 bg-primary-fixed/10 border border-primary-fixed/30 text-primary-fixed font-bold uppercase tracking-widest text-label-sm hover:bg-primary-fixed/20 shadow-[0_0_15px_rgba(0,242,255,0.12)] transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed'>
                                    <span className={`material-symbols-outlined text-[20px] ${pdfLoading ? 'animate-spin' : ''}`}>{pdfLoading ? 'progress_activity' : 'download'}</span>
                                    {pdfLoading ? 'Generating...' : 'Download Resume'}
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className='w-full py-4 rounded-lg flex items-center justify-center gap-2 bg-secondary-container text-on-secondary-container font-bold uppercase tracking-widest text-label-sm cyber-glow-accent hover:opacity-90 transition-all active:scale-95'>
                                    <span className='material-symbols-outlined text-[20px]' style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                                    New Interview Plan
                                </button>
                            </div>

                            {/* Skill Gaps */}
                            <div className='glass-panel rounded-2xl p-6 md:p-8'>
                                <p className='text-label-sm font-label-sm text-on-surface-variant uppercase tracking-[0.2em] mb-6'>Skill Gaps Detected</p>
                                <div className='space-y-3'>
                                    {report.skillGaps?.length > 0 ? report.skillGaps.map((gap, i) => {
                                        const s = severityStyle(gap.severity)
                                        return (
                                            <div key={i} className={`p-4 border rounded-lg flex gap-4 ${s.wrap}`}>
                                                <span className={`material-symbols-outlined ${s.text}`}>{s.icon}</span>
                                                <p className={`text-body-md font-medium leading-tight ${s.text}`}>{gap.skill}</p>
                                            </div>
                                        )
                                    }) : (
                                        <p className='text-body-md text-on-surface-variant'>No significant skill gaps detected.</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setActiveNav('roadmap')}
                                    className='w-full mt-8 py-3 border border-outline/30 hover:border-primary-fixed text-on-surface-variant hover:text-primary-fixed transition-all rounded-lg text-label-sm font-label-sm uppercase tracking-widest'>
                                    View Training Roadmap
                                </button>
                            </div>

                            {/* System Status */}
                            <div className='p-4 border border-outline-variant/10 rounded-xl bg-surface-container-lowest flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    <span className='relative flex h-3 w-3'>
                                        <span className='animate-ping absolute inline-flex h-full w-full rounded-[50%] bg-primary-fixed opacity-75'></span>
                                        <span className='relative inline-flex rounded-[50%] h-3 w-3 bg-primary-fixed'></span>
                                    </span>
                                    <span className='text-label-sm font-label-sm text-on-surface-variant opacity-60'>AI ANALYTICS ENGINE ONLINE</span>
                                </div>
                            </div>
                        </aside>

                        {/* Left Content Area (Main Report) */}
                        <div className='lg:col-span-8 lg:order-1 order-2 space-y-gutter'>

                            {/* Tabs */}
                            <div className='flex gap-2 overflow-x-auto custom-scrollbar pb-1'>
                                {TABS.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveNav(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap text-sm font-semibold transition-all border ${activeNav === tab.id
                                            ? 'bg-primary/10 text-primary-fixed border-primary-fixed/30'
                                            : 'text-on-surface-variant border-transparent hover:bg-surface-variant/30 hover:text-primary'}`}>
                                        <span className='material-symbols-outlined text-[18px]'>{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Section header */}
                            <div className='flex items-center gap-4 flex-wrap'>
                                <h3 className='text-headline-lg-mobile font-headline-lg-mobile text-on-surface'>{TABS.find(t => t.id === activeNav)?.label}</h3>
                                <span className='px-3 py-1 rounded-full bg-surface-container-highest text-primary-fixed-dim text-label-sm font-label-sm border border-primary-fixed/20 whitespace-nowrap'>
                                    {activeCount} {activeNav === 'roadmap' ? 'DAYS' : 'QUESTIONS'}
                                </span>
                            </div>

                            {/* Content */}
                            {activeNav === 'technical' && (
                                <div className='space-y-4'>
                                    {report.technicalQuestions.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            )}

                            {activeNav === 'behavioral' && (
                                <div className='space-y-4'>
                                    {report.behavioralQuestions.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            )}

                            {activeNav === 'roadmap' && (
                                <div className='space-y-4'>
                                    {report.preparationPlan.map((day) => (
                                        <RoadMapDay key={day.day} day={day} />
                                    ))}
                                </div>
                            )}

                            {/* Recent Interview Plans */}
                            {otherReports.length > 0 && (
                                <div className='pt-8'>
                                    <h4 className='text-headline-md font-headline-md text-on-surface mb-6 flex items-center gap-3'>
                                        <span className='material-symbols-outlined text-primary-fixed'>history</span>
                                        Recent Interview Plans
                                    </h4>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                        {otherReports.slice(0, 6).map((r) => {
                                            const high = r.matchScore >= 80
                                            return (
                                                <div
                                                    key={r._id}
                                                    onClick={() => navigate(`/interview/${r._id}`)}
                                                    className='glass-panel p-5 rounded-lg flex items-center justify-between gap-4 hover:border-primary-fixed/30 transition-all cursor-pointer'>
                                                    <div className='min-w-0'>
                                                        <p className='text-label-sm font-label-sm text-primary-fixed uppercase tracking-wider mb-1 truncate'>{r.title || 'Untitled Position'}</p>
                                                        <p className='text-label-sm text-on-surface-variant'>{new Date(r.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className='text-right flex-shrink-0'>
                                                        <p className={`text-headline-md font-bold ${high ? 'text-primary-fixed' : 'text-secondary-container'}`}>{r.matchScore}%</p>
                                                        <p className='text-[10px] text-on-surface-variant uppercase font-bold'>Match</p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className='px-margin-mobile md:px-margin-desktop py-10 border-t border-outline-variant/5 text-center'>
                    <p className='text-label-sm font-label-sm font-bold text-primary-fixed uppercase tracking-widest mb-2'>SkillSync AI</p>
                    <p className='text-label-sm text-on-surface-variant opacity-60'>Powered by AI</p>
                </footer>
            </div>
        </>
    )
}

export default Interview
