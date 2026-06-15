import { useAuth } from '../hooks/useAuth'
import { Navigate, Outlet } from 'react-router'

const PublicOnly = () => {
    const { loading, user } = useAuth()
    if (loading) {
        return <main><h1>Loading ...</h1></main>
    }
    if (user) {
        return <Navigate to="/" replace />
    }
    return <Outlet />
}

export default PublicOnly
