/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import { memo } from 'react';

export const Account = memo(function Account({ user, current }: { user: any; current: string }) {
  const userData = JSON.parse(user.metadata);

  const setCurrentUser = () => {
    console.log('clicked');
  };

  return (
    <button
      onClick={() => setCurrentUser()}
      className={`relative h-11 w-11 shrink overflow-hidden rounded-full ${
        current === user.pubkey ? 'ring-1 ring-fuchsia-500 ring-offset-4 ring-offset-black' : ''
      }`}>
      {userData?.picture !== undefined ? (
        <Image src={userData.picture} alt="user's avatar" fill={true} className="rounded-full object-cover" />
      ) : (
        <div className="h-11 w-11 animate-pulse rounded-full bg-zinc-700" />
      )}
    </button>
  );
});
