import { Image } from '@shared/image';

import { DEFAULT_AVATAR } from '@stores/constants';

import { displayNpub } from '@utils/shortenKey';
import { Profile } from '@utils/types';

export function MentionItem({ profile }: { profile: Profile }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 shrink-0 overflow-hidden rounded-md bg-zinc-900">
        <Image
          src={profile.picture || profile.image}
          fallback={DEFAULT_AVATAR}
          alt={profile.pubkey}
          className="h-8 w-8 object-cover"
        />
      </div>
      <div className="flex flex-col gap-px">
        <h5 className="max-w-[15rem] text-sm font-medium leading-none text-zinc-100">
          {profile.ident || (
            <div className="h-3 w-20 animate-pulse rounded-sm bg-zinc-700" />
          )}
        </h5>
        <span className="text-sm leading-none text-zinc-400">
          {displayNpub(profile.pubkey, 16)}
        </span>
      </div>
    </div>
  );
}
