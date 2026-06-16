import { RouterProvider } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { router } from './app.routes.jsx';
import { AuthProvider } from './features/auth/auth.context.jsx';
import { InterviewProvider } from './features/interview/interview.context.jsx';

const app = () => {
  return (
    <>
      <AuthProvider>
        <InterviewProvider>
            <RouterProvider router={router} />
        </InterviewProvider>
      </AuthProvider>
      <Toaster
        position='top-center'
        toastOptions={{
          style: {
            background: '#1f1f24',
            color: '#e4e1e9',
            border: '1px solid rgba(132, 148, 149, 0.2)',
            fontSize: '14px',
          },
          error: { iconTheme: { primary: '#ffb4ab', secondary: '#1f1f24' } },
          success: { iconTheme: { primary: '#74f5ff', secondary: '#1f1f24' } },
        }}
      />
    </>
  )
}
export default app;