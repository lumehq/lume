import { Image } from '@lume/shared/image';
import { DEFAULT_AVATAR } from '@lume/stores/constants';

export default function ActiveAccount({ user }: { user: any }) {
  const userData = JSON.parse(user.metadata);

  return (
    <button className="relative h-10 w-10 overflow-hidden rounded-lg">
      <Image
        src={userData.picture || DEFAULT_AVATAR}
        alt="user's avatar"
        loading="auto"
        className="h-10 w-10 object-cover"
      />
    </button>
  );
}
