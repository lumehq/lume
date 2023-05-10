import { Image } from '@shared/image';

import { DEFAULT_AVATAR } from '@stores/constants';

import { usePageContext } from '@utils/hooks/usePageContext';
import { useProfile } from '@utils/hooks/useProfile';
import { shortenKey } from '@utils/shortenKey';

import { twMerge } from 'tailwind-merge';

export default function ChatsListItem({ pubkey }: { pubkey: string }) {
  const pageContext = usePageContext();

  const searchParams: any = pageContext.urlParsed.search;
  const pagePubkey = searchParams.pubkey;

  const { user, isError, isLoading } = useProfile(pubkey);

  return (
    <>
      {isError && <div>error</div>}
      {isLoading && !user ? (
        <div className="inline-flex h-8 items-center gap-2.5 rounded-md px-2.5">
          <div className="relative h-5 w-5 shrink-0 animate-pulse rounded bg-zinc-800"></div>
          <div>
            <div className="h-2.5 w-full animate-pulse truncate rounded bg-zinc-800 text-sm font-medium"></div>
          </div>
        </div>
      ) : (
        <a
          href={`/app/chat?pubkey=${pubkey}`}
          className={twMerge(
            'group inline-flex h-8 items-center gap-2.5 rounded-md px-2.5 hover:bg-zinc-900',
            pagePubkey === pubkey ? 'dark:bg-zinc-900 dark:text-zinc-100 hover:dark:bg-zinc-800' : ''
          )}
        >
          <div className="relative h-5 w-5 shrink-0 rounded">
            <Image
              src={user.picture || DEFAULT_AVATAR}
              alt={pubkey}
              className="h-5 w-5 rounded bg-white object-cover"
            />
          </div>
          <div>
            <h5 className="truncate text-[13px] font-semibold text-zinc-400 group-hover:text-zinc-200">
              {user.display_name || user.name || shortenKey(pubkey)}
            </h5>
          </div>
        </a>
      )}
    </>
  );
}
