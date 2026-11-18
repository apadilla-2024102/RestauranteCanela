import { Toaster as SonnerToaster } from 'sonner';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';

export const Toaster = () => {
  const isDark = useMediaQuery('(prefers-color-scheme: dark)');
  const isMobile = useMediaQuery('(max-width: 640px)');

  return (
    <SonnerToaster
      theme={isDark ? 'dark' : 'light'}
      position={isMobile ? 'top-center' : 'bottom-right'}
      closeButton={false}
      gap={8}
      toastOptions={{ className: 'toast' }}
    />
  );
};
