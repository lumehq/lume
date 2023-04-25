import { DEFAULT_AVATAR } from '@stores/constants';

import { useChannelMetadata } from '@utils/hooks/useChannelMetadata';
import { usePageContext } from '@utils/hooks/usePageContext';

import { twMerge } from 'tailwind-merge';

export const ChannelListItem = ({ data }: { data: any }) => {
  const channel: any = useChannelMetadata(data.event_id, data.pubkey);
  const pageContext = usePageContext();

  const searchParams: any = pageContext.urlParsed.search;
  const pageID = searchParams.id;

  return (
    <a
      href={`/channel?id=${data.event_id}&pubkey=${data.pubkey}`}
      className={twMerge(
        'inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-zinc-900',
        pageID === data.event_id ? 'dark:bg-zinc-900 dark:text-zinc-100 hover:dark:bg-zinc-800' : ''
      )}
    >
      <div className="relative h-5 w-5 shrink-0 rounded bg-zinc-900">
        <img src={channel?.picture || DEFAULT_AVATAR} alt={data.event_id} className="h-5 w-5 rounded object-contain" />
      </div>
      <div>
        <h5 className="truncate text-sm font-medium text-zinc-400">{channel?.name}</h5>
      </div>
    </a>
  );
};
