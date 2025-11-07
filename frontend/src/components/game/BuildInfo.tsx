import React from 'react';
import { APP_VERSION } from '@/config/version';

export const BuildInfo: React.FC = () => {
  const gitCommit = __GIT_COMMIT_HASH__;

  return (
    <div className='fixed bottom-4 left-4 z-40'>
      <h3 className='font-family-vt323 text-xl text-pacman-yellow'>
        {APP_VERSION} 
      </h3>
      <h3 className='font-family-vt323 text-md text-gray-600'>
      	Build #{gitCommit}
      </h3>
    </div>
  );
};
