import { Image } from '@shared/image';

import { useProfile } from '@utils/hooks/useProfile';

export function InactiveAccount({ data }: { data: any }) {
  const { user } = useProfile(data.npub);

  return (
    <div className="relative h-9 w-9 shrink-0">
      <Image src={user?.image} alt={data.npub} className="h-9 w-9 rounded object-cover" />
    </div>
  );
}
