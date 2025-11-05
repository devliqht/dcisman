import React from 'react';
import { Container } from '@/components/ui';
import { Ghost } from '@/components/decorative';
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
      <div className="absolute top-10 left-10 hidden md:block">
        <Ghost color="#FF0000" />
      </div>
        <div className='absolute top-10 left-10 hidden md:block'>
          <Ghost color='var(--color-ghost-red)' />
        </div>
        <div className='absolute top-20 right-20 hidden md:block'>
          <Ghost color='var(--color-ghost-pink)' delay='0.5s' />
        </div>
        <div className='absolute bottom-20 left-20 hidden md:block'>
          <Ghost color='var(--color-ghost-cyan)' delay='1s' />
        </div>
        <div className='absolute bottom-10 right-10 hidden lg:block'>
          <Ghost color='var(--color-ghost-orange)' delay='1.5s' />
        </div>

        <div className='relative z-10 w-full max-w-2xl flex flex-col items-center p-8'>
          {children}
        </div>
    </Container>
  </>
  );
};
