import { Image } from '@shared/image';

import { displayNpub } from '@utils/shortenKey';
import { Profile } from '@utils/types';

export function MentionItem({ profile }: { profile: Profile }) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={profile.picture || profile.image}
        alt={profile.pubkey}
        className="shirnk-0 h-8 w-8 rounded-md object-cover"
      />
      <div className="flex flex-col gap-px">
        <h5 className="max-w-[15rem] text-sm font-medium leading-none text-white">
          {profile.ident}
        </h5>
        <span className="text-sm leading-none text-white/50">
          {displayNpub(profile.pubkey, 16)}
        </span>
      </div>
    </div>
  );
}
