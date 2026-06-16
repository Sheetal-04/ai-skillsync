import { useContext, useEffect } from 'react'
import toast from 'react-hot-toast'
import { AuthContext } from '../auth.context.jsx'
import { login, register, logout } from '../services/auth.api.js'

const errorMessage = (error, fallback) => error?.response?.data?.message || fallback

export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext)

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
            toast.success('Welcome back!')
            return true
        } catch (error) {
            console.log(error)
            toast.error(errorMessage(error, 'Login failed. Please check your credentials.'))
            return false
        }
        finally {
            setLoading(false)
        }
    }
    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            toast.success('Account created successfully!')
            return true
        } catch (error) {
            console.log(error)
            toast.error(errorMessage(error, 'Registration failed. Please try again.'))
            return false
        }
        finally {
            setLoading(false)
        }
    }
    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
            toast.success('Logged out.')
        } catch (error) {
            console.log(error)
            toast.error(errorMessage(error, 'Logout failed. Please try again.'))
        }
        finally {
            setLoading(false)
        }
    }
    const handleGetme = async () => {
        setLoading(true)
        try {
            const data = await getMe()
            setUser(data.user)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }
    // useEffect(() => {
    //     const getAndSetUser = async () => {
    //         try {

    //             const data = await getMe()
    //             setUser(data.user)
    //         } catch (err) {
    //             console.log(err)
    //         } finally {
    //             setLoading(false)
    //         }
    //     }
    //     getAndSetUser()
    // }, [])
    return { user, loading, handleRegister, handleLogin, handleLogout }
}