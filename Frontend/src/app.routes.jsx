import { createBrowserRouter, RouterProvider } from 'react-router';
import Login from './features/auth/pages/Login.jsx';
import Register from './features/auth/pages/Register.jsx';
import Protected from './features/auth/components/Protected.jsx';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Protected><h1> welcome to app </h1></Protected>,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    }
]);