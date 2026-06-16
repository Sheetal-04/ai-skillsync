import { useAuth } from '../hooks/useAuth'
import { Navigate, Outlet } from 'react-router'
import Loader from '../../../components/Loader.jsx'

const PublicOnly = () => {
    const { loading, user } = useAuth()
    if (loading) {
        return <Loader message='Loading...' />
    }
    if (user) {
        return <Navigate to="/" replace />
    }
    return <Outlet />
}

export default PublicOnly
