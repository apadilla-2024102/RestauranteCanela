import { AuthProvider } from '../features/auth/store/authStore.jsx';
import { AppRouter } from './router/AppRouter.jsx';
import { Toaster } from 'react-hot-toast';

export const App = () => {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '14px',
            padding: '14px 18px',
            background: '#111827',
            color: '#ffffff',
            fontWeight: 600,
          },
        }}
      />
      <AppRouter />
    </AuthProvider>
  );
};
