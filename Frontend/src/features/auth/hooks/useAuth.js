import { useContext, useEffect } from 'react'
import { AuthContext } from '../auth.context.jsx'
import { login, register, logout, getMe } from '../services/auth.api.js'

export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext)

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
            return true
        } catch (error) {
            console.log(error)
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
            console.log(data)
            setUser(data.user)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
        finally {
            setLoading(false)
        }
    }
    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
            setLoading(false)
        } catch (error) {
            console.log(error)
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
    useEffect(() => {
        const getAndSetUser = async () => {
            try {

                const data = await getMe()
                setUser(data.user)
            } catch (err) { } finally {
                setLoading(false)
            }
        }
        getAndSetUser()
    }, [])
    return { user, loading, handleRegister, handleLogin, handleLogout }
}