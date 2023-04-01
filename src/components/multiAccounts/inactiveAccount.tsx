import { DEFAULT_AVATAR } from '@stores/constants';

import Image from 'next/image';
import { memo } from 'react';

export const InactiveAccount = memo(function InactiveAccount({ user }: { user: any }) {
  const userData = JSON.parse(user.metadata);

  const setCurrentUser = () => {
    console.log('clicked');
  };

  return (
    <button onClick={() => setCurrentUser()} className="relative h-11 w-11 shrink rounded-md">
      <Image
        src={userData.picture || DEFAULT_AVATAR}
        alt="user's avatar"
        fill={true}
        className="rounded-md object-cover"
        priority
      />
    </button>
  );
});
