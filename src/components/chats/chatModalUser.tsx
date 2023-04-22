import { DEFAULT_AVATAR } from '@stores/constants';

import { shortenKey } from '@utils/shortenKey';

import { navigate } from 'vite-plugin-ssr/client/router';

export const ChatModalUser = ({ data }: { data: any }) => {
  const profile = JSON.parse(data.metadata);

  const openNewChat = () => {
    navigate(`/chat?pubkey=${data.pubkey}`);
  };

  return (
    <div className="group flex items-center justify-between px-3 py-2 hover:bg-zinc-800">
      <div className="flex items-center gap-2">
        <div className="relative h-10 w-10 shrink-0 rounded-md">
          <img
            src={profile?.picture || DEFAULT_AVATAR}
            alt={data.pubkey}
            className="h-10 w-10 rounded-md object-cover"
          />
        </div>
        <div className="flex w-full flex-1 flex-col items-start text-start">
          <span className="truncate text-sm font-semibold leading-tight text-zinc-200">
            {profile?.display_name || profile?.name}
          </span>
          <span className="text-sm leading-tight text-zinc-400">{shortenKey(data.pubkey)}</span>
        </div>
      </div>
      <div>
        <button
          onClick={() => openNewChat()}
          className="hidden h-8 items-center justify-center rounded-md bg-fuchsia-500 px-3 text-sm font-medium shadow-button hover:bg-fuchsia-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 group-hover:inline-flex"
        >
          Send message
        </button>
      </div>
    </div>
  );
};
