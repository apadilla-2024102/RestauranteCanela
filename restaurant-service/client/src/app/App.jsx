import { AuthProvider } from '../features/auth/store/authStore.jsx';
import { AppRouter } from './router/AppRouter.jsx';
import { Toaster } from '../shared/components/ui/Toaster.jsx';

export const App = () => {
  return (
    <AuthProvider>
      <Toaster />
      <AppRouter />
    </AuthProvider>
  );
};
