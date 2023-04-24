import { DEFAULT_AVATAR } from '@stores/constants';

import { usePageContext } from '@utils/hooks/usePageContext';
import { useProfileMetadata } from '@utils/hooks/useProfileMetadata';
import { shortenKey } from '@utils/shortenKey';

import { twMerge } from 'tailwind-merge';

export const ChatListItem = ({ pubkey }: { pubkey: string }) => {
  const profile = useProfileMetadata(pubkey);
  const pageContext = usePageContext();

  const searchParams: any = pageContext.urlParsed.search;
  const pagePubkey = searchParams.pubkey;

  return (
    <a
      href={`/chat?pubkey=${pubkey}`}
      className={twMerge(
        'inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-zinc-900',
        pagePubkey === pubkey ? 'dark:bg-zinc-900 dark:text-zinc-100 hover:dark:bg-zinc-800' : ''
      )}
    >
      <div className="relative h-5 w-5 shrink rounded">
        <img src={profile?.picture || DEFAULT_AVATAR} alt={pubkey} className="h-5 w-5 rounded object-cover" />
      </div>
      <div>
        <h5 className="text-sm font-medium text-zinc-400">
          {profile?.display_name || profile?.name || shortenKey(pubkey)}
        </h5>
      </div>
    </a>
  );
};
