import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { AddBlock } from '@app/space/components/add';
import { FeedBlock } from '@app/space/components/blocks/feed';
import { FollowingBlock } from '@app/space/components/blocks/following';
import { HashtagBlock } from '@app/space/components/blocks/hashtag';
import { ImageBlock } from '@app/space/components/blocks/image';
import { ThreadBlock } from '@app/space/components/blocks/thread';

import { getBlocks } from '@libs/storage';

import { LoaderIcon } from '@shared/icons';

import { Block } from '@utils/types';

export function SpaceScreen() {
  const {
    status,
    data: blocks,
    isFetching,
  } = useQuery(
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
        default:
          break;
      }
    },
    [blocks]
  );

  return (
    <div className="scrollbar-hide flex h-full w-full flex-nowrap overflow-x-auto overflow-y-hidden">
      <FollowingBlock />
      {status === 'loading' ? (
        <div className="flex w-[350px] shrink-0 flex-col border-r border-zinc-900">
          <div
            data-tauri-drag-region
            className="group flex h-11 w-full items-center justify-between overflow-hidden border-b border-zinc-900 px-3"
          />

          <div className="flex w-full flex-1 items-center justify-center p-3">
            <LoaderIcon className="h-5 w-5 animate-spin text-black dark:text-zinc-100" />
          </div>
        </div>
      ) : (
        blocks.map((block: Block) => renderBlock(block))
      )}
      {isFetching && (
        <div className="flex w-[350px] shrink-0 flex-col border-r border-zinc-900">
          <div
            data-tauri-drag-region
            className="group flex h-11 w-full items-center justify-between overflow-hidden border-b border-zinc-900 px-3"
          />

          <div className="flex w-full flex-1 items-center justify-center p-3">
            <LoaderIcon className="h-5 w-5 animate-spin text-black dark:text-zinc-100" />
          </div>
        </div>
      )}
      <div className="flex w-[350px] shrink-0 flex-col border-r border-zinc-900">
        <div className="inline-flex h-full w-full items-center justify-center">
          <AddBlock />
        </div>
      </div>
      <div className="w-[350px] shrink-0" />
    </div>
  );
}
