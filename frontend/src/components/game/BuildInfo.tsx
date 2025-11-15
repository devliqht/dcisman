import React, { useState } from 'react';
import { APP_VERSION } from '@/config/version';
import { ChangelogModal } from '@/components/common/ChangelogModal';

export const BuildInfo: React.FC = () => {
  const gitCommit = __GIT_COMMIT_HASH__;
  const [showChangelog, setShowChangelog] = useState(false);

  return (
    <>
      <div className='fixed bottom-4 left-4 z-40'>
        <h3 className='font-family-vt323 text-xl text-pacman-yellow'>
          {APP_VERSION}
        </h3>
        <h3 className='font-family-vt323 text-md text-gray-600'>
          Build #{gitCommit}
        </h3>
        <button
          onClick={() => setShowChangelog(true)}
          className='font-family-vt323 text-4xl text-ghost-cyan hover:text-white transition-colors cursor-pointer underline'
        >
          Changelog
        </button>
      </div>
      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
    </>
  );
};
