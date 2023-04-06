import { ImageWithFallback } from '@components/imageWithFallback';

import { activeAccountAtom } from '@stores/account';
import { DEFAULT_AVATAR } from '@stores/constants';

import { useAtomValue } from 'jotai';
import { useRouter } from 'next/router';

export default function ChatList() {
  const router = useRouter();

  const activeAccount: any = useAtomValue(activeAccountAtom);
  const accountProfile = JSON.parse(activeAccount.metadata);

  const openChats = () => {
    router.push({
      pathname: '/chats/[pubkey]',
      query: { pubkey: activeAccount.pubkey },
    });
  };

  return (
    <div className="flex flex-col gap-px">
      <div
        onClick={() => openChats()}
        className="inline-flex items-center gap-2 rounded-md px-2.5 py-2 hover:bg-zinc-900"
      >
        <div className="relative h-5 w-5 shrink overflow-hidden rounded bg-white">
          <ImageWithFallback
            src={accountProfile.picture || DEFAULT_AVATAR}
            alt={activeAccount.pubkey}
            fill={true}
            className="rounded object-cover"
          />
        </div>
        <div>
          <h5 className="text-sm font-medium text-zinc-400">
            {accountProfile.display_name || accountProfile.name} <span className="text-zinc-500">(you)</span>
          </h5>
        </div>
      </div>
    </div>
  );
}
