'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function withAuth(Component: React.ComponentType) {
  return function ProtectedRoute(props: any) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return; // Do nothing while loading
      if (!session) router.replace('/login');
    }, [session, status, router]);

    if (status === 'loading') {
      // Show loading indicator while the session is being fetched
      return (
        <div className="min-h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!session) {
      // This shouldn't be displayed since we redirect, but just in case
      return null;
    }

    // Session is verified, render the protected component
    return <Component {...props} />;
  };
}