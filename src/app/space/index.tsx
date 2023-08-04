import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { FeedBlock } from '@app/space/components/blocks/feed';
import { HashtagBlock } from '@app/space/components/blocks/hashtag';
import { ImageBlock } from '@app/space/components/blocks/image';
import { NetworkBlock } from '@app/space/components/blocks/network';
import { ThreadBlock } from '@app/space/components/blocks/thread';
import { UserBlock } from '@app/space/components/blocks/user';
import { FeedModal } from '@app/space/components/modals/feed';
import { HashtagModal } from '@app/space/components/modals/hashtag';
import { ImageModal } from '@app/space/components/modals/image';

import { getBlocks } from '@libs/storage';

import { LoaderIcon } from '@shared/icons';

import { Block } from '@utils/types';

export function SpaceScreen() {
  const { status, data: blocks } = useQuery(
    ['blocks'],
    async () => {
      return await getBlocks();
    },
    {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  const renderBlock = useCallback(
    (block: Block) => {
      switch (block.kind) {
        case 0:
          return <ImageBlock key={block.id} params={block} />;
        case 1:
          return <FeedBlock key={block.id} params={block} />;
        case 2:
          return <ThreadBlock key={block.id} params={block} />;
        case 3:
          return <HashtagBlock key={block.id} params={block} />;
        case 5:
          return <UserBlock key={block.id} params={block} />;
        default:
          break;
      }
    },
    [blocks]
  );

  return (
    <div className="scrollbar-hide flex h-full w-full flex-nowrap divide-x divide-white/5 overflow-x-auto overflow-y-hidden">
      <NetworkBlock />
      {status === 'loading' ? (
        <div className="flex w-[350px] shrink-0 flex-col">
          <div className="flex w-full flex-1 items-center justify-center p-3">
            <LoaderIcon className="h-5 w-5 animate-spin text-white/10" />
          </div>
        </div>
      ) : (
        blocks.map((block) => renderBlock(block))
      )}
      <div className="flex w-[350px] shrink-0 flex-col">
        <div className="inline-flex h-full w-full flex-col items-center justify-center gap-1">
          <FeedModal />
          <ImageModal />
          <HashtagModal />
        </div>
      </div>
      <div className="w-[250px] shrink-0" />
    </div>
  );
}
