import { DEFAULT_AVATAR } from '@stores/constants';

import { memo } from 'react';

export const InactiveAccount = memo(function InactiveAccount({ user }: { user: any }) {
  const userData = JSON.parse(user.metadata);

  const setCurrentUser = () => {
    console.log('clicked');
  };

  return (
    <button onClick={() => setCurrentUser()} className="relative h-11 w-11 shrink rounded-lg">
      <img src={userData.picture || DEFAULT_AVATAR} alt="user's avatar" className="h-11 w-11 rounded-lg object-cover" />
    </button>
  );
});
