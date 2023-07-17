import { VerticalDotsIcon } from '@shared/icons';
import { Image } from '@shared/image';

import { DEFAULT_AVATAR } from '@stores/constants';

import { formatCreatedAt } from '@utils/createdAt';
import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export function ThreadUser({ pubkey, time }: { pubkey: string; time: number }) {
  const { status, user } = useProfile(pubkey);
  const createdAt = formatCreatedAt(time);

  if (status === 'loading') {
    return <div className="h-4 w-4 animate-pulse rounded bg-zinc-700"></div>;
  }

  return (
    <div className="flex items-center gap-3">
      <Image
        src={user?.picture || user?.image || DEFAULT_AVATAR}
        fallback={DEFAULT_AVATAR}
        alt={pubkey}
        className="relative z-20 inline-block h-11 w-11 rounded-lg"
      />
      <div className="lex flex-1 items-baseline justify-between">
        <div className="inline-flex w-full items-center justify-between">
          <h5 className="truncate font-semibold leading-none text-zinc-100">
            {user?.nip05?.toLowerCase() || user?.name || user?.display_name}
          </h5>
          <button
            type="button"
            className="inline-flex h-5 w-max items-center justify-center rounded px-1 hover:bg-zinc-800"
          >
            <VerticalDotsIcon className="h-4 w-4 rotate-90 transform text-zinc-200" />
          </button>
        </div>
        <div className="inline-flex items-center gap-2">
          <span className="leading-none text-zinc-500">{createdAt}</span>
          <span className="leading-none text-zinc-500">·</span>
          <span className="leading-none text-zinc-500">{displayNpub(pubkey, 16)}</span>
        </div>
      </div>
    </div>
  );
}
