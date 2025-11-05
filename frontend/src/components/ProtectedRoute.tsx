import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Container } from '@/components/ui';
import { PacMan } from '@/components/decorative';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Container className='bg-black'>
        <div className='text-center'>
          <PacMan className='mx-auto mb-4' />
          <p className="text-pacman-yellow font-[\'Press_Start_2P\'] text-sm">
            Loading...
          </p>
        </div>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};
