import destr from 'destr';
import Image from 'next/image';
import { memo } from 'react';

export const InactiveAccount = memo(function InactiveAccount({ user }: { user: any }) {
  const userData = destr(user.metadata);

  const setCurrentUser = () => {
    console.log('clicked');
  };

  return (
    <button onClick={() => setCurrentUser()} className="relative h-11 w-11 shrink rounded-md">
      <Image src={userData.picture} alt="user's avatar" fill={true} className="rounded-md object-cover" />
    </button>
  );
});
