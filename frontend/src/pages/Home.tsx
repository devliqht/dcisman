import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { MainLayout } from '../components/layout';
import { Button, Card, Container } from '../components/ui';

export const Home: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <MainLayout>
      <Container>
        <Card className='max-w-md w-full text-center'>
          <h1 className='text-pacman-yellow font-family-arcade text-2xl mb-6'>
            Welcome to DCISMan!
          </h1>
          <p className='text-white font-family-vt323 text-2xl mb-4'>
            Hello, {user?.username}!
          </p>
          <div className='text-ghost-cyan font-family-vt323 text-xl mb-6'>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>
          </div>
          <Button onClick={handleLogout} variant='danger'>
            Logout
          </Button>
        </Card>
      </Container>
    </MainLayout>
  );
};
