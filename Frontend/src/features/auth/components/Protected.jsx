import { useAuth } from '../hooks/useAuth'
import { Navigate, Outlet } from 'react-router'
import Loader from '../../../components/Loader.jsx'

const Protected = () => {
    const { loading, user } = useAuth()
    if (loading) {
        return <Loader message='Authenticating...' />
    }
    if (!user) {
        return <Navigate to="/login" replace />
    }
    return <Outlet />

}
export default Protected