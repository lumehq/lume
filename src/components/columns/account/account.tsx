import Image from 'next/image';
import { memo } from 'react';

export const Account = memo(function Account({ user }: { user: any }) {
  const userData = JSON.parse(user.metadata);

  const setCurrentUser = () => {
    console.log('clicked');
  };

  return (
    <button onClick={() => setCurrentUser()} className="relative h-11 w-11 shrink rounded-full">
      <Image src={userData.picture} alt="user's avatar" fill={true} className="rounded-full object-cover" />
    </button>
  );
});
