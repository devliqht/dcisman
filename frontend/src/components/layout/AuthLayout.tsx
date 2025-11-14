import React from 'react';
import { Container } from '@/components/ui';
import DotGrid from '@/components/DotGrid';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
  <>
  <div style={{ width: '100%', height: '100%', position: 'fixed', zIndex: '-10' }}>
    <DotGrid
      dotSize={10}
      gap={15}
      baseColor="#000047"
      activeColor="#2121DE"
      proximity={120}
      shockRadius={250}
      shockStrength={5}
      resistance={750}
      returnDuration={1.5}
    />
  </div>
    <Container className="relative overflow-hidden">
        <div className='relative z-10 w-full max-w-2xl flex flex-col items-center p-8'>
          {children}
        </div>
    </Container>
  </>
  );
};
