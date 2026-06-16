import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import Loader from '../../../components/Loader.jsx'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await handleLogin({ email, password })
        console.log(response);
        if (response === true) {
            navigate('/')
        }
    }

    if (loading) {
        return <Loader message='Signing you in...' />
    }

    return (
        <>
            {/* Background Layers */}
            <div className='fixed inset-0 grid-bg pointer-events-none'></div>
            <div className='fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(0,105,111,0.1)_0%,transparent_70%)]'></div>
            <div className='scanline'></div>

            <main className='relative z-10 min-h-screen flex items-center justify-center px-margin-mobile md:px-margin-desktop py-12'>
                <div className='w-full max-w-md' id='auth-container'>

                    {/* Logo Section */}
                    <div className='flex flex-col items-center mb-10 fade-in' style={{ animationDelay: '0.1s' }}>
                        <div className='w-20 h-20 mb-4 relative'>
                            <div className='absolute inset-0 bg-primary-fixed blur-2xl opacity-20 animate-pulse'></div>
                            <img alt='SkillSync AI' className='relative z-10 w-full h-full object-contain' src='/skillsync_ai_logo.png' />
                        </div>
                        <h1 className='font-headline-md text-headline-md text-primary-fixed tracking-tight'>SkillSync AI</h1>
                        <p className='text-label-sm font-label-sm text-outline tracking-widest uppercase mt-2'>Interview Command Center</p>
                    </div>

                    {/* Login Card */}
                    <div className='glass-panel rounded-xl p-8 fade-in' style={{ animationDelay: '0.2s' }}>
                        <h2 className='font-headline-md text-headline-md text-on-surface mb-6'>Login</h2>
                        <form className='space-y-5' onSubmit={handleSubmit}>

                            <div className='space-y-2'>
                                <label htmlFor='email' className='text-label-sm font-label-sm text-outline uppercase tracking-wider block'>Email</label>
                                <input
                                    onChange={(e) => { setEmail(e.target.value) }}
                                    type='email' id='email' name='email' placeholder='Enter email address'
                                    className='w-full bg-surface-container-low border border-outline-variant/30 rounded px-4 py-3 text-body-md text-on-surface focus:border-primary-fixed focus:ring-0 focus:outline-none transition-all placeholder:text-outline-variant/50' />
                            </div>

                            <div className='space-y-2 relative'>
                                <label htmlFor='password' className='text-label-sm font-label-sm text-outline uppercase tracking-wider block'>Password</label>
                                <input
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    type={showPassword ? 'text' : 'password'} id='password' name='password' placeholder='••••••••'
                                    className='w-full bg-surface-container-low border border-outline-variant/30 rounded px-4 py-3 text-body-md text-on-surface focus:border-primary-fixed focus:ring-0 focus:outline-none transition-all placeholder:text-outline-variant/50' />
                                <span
                                    onClick={() => setShowPassword((s) => !s)}
                                    className='material-symbols-outlined absolute right-3 bottom-3 text-outline-variant cursor-pointer hover:text-on-surface transition-colors'
                                    style={{ fontSize: '20px' }}>
                                    {showPassword ? 'visibility' : 'visibility_off'}
                                </span>
                            </div>

                            <button className='w-full bg-secondary-container text-on-secondary-container font-headline-md py-4 rounded-lg glow-button active:scale-[0.98] transition-all mt-4'>
                                Login
                            </button>
                        </form>

                        <div className='mt-8 pt-6 border-t border-outline-variant/10 text-center'>
                            <p className='text-body-md text-on-surface-variant'>
                                New recruit?
                                <Link to={'/register'} className='text-primary-fixed-dim hover:text-primary-fixed font-semibold transition-colors ml-1'>Register here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Login
