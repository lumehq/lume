'use client';

import NewsfeedLayout from '@components/layouts/newsfeed';
import ProfileFollowers from '@components/profile/followers';
import ProfileFollows from '@components/profile/follows';
import ProfileMetadata from '@components/profile/metadata';
import ProfileNotes from '@components/profile/notes';

import { usePageContext } from '@utils/hooks/usePageContext';

import * as Tabs from '@radix-ui/react-tabs';

export function Page() {
  const pageContext = usePageContext();
  const searchParams: any = pageContext.urlParsed.search;

  const pubkey = searchParams.pubkey;

  return (
    <NewsfeedLayout>
      <div className="scrollbar-hide h-full w-full overflow-y-auto">
        <ProfileMetadata id={pubkey} />
        <Tabs.Root className="flex w-full flex-col" defaultValue="notes">
          <Tabs.List className="flex border-b border-zinc-800">
            <Tabs.Trigger
              className="flex h-10 flex-1 cursor-default select-none items-center justify-center px-5 text-sm font-medium leading-none text-zinc-400 outline-none hover:text-fuchsia-400 data-[state=active]:text-fuchsia-500 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current"
              value="notes"
            >
              Notes
            </Tabs.Trigger>
            <Tabs.Trigger
              className="flex h-10 flex-1 cursor-default select-none items-center justify-center px-5 text-sm font-medium text-zinc-400 outline-none placeholder:leading-none hover:text-fuchsia-400 data-[state=active]:text-fuchsia-500 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current"
              value="followers"
            >
              Followers
            </Tabs.Trigger>
            <Tabs.Trigger
              className="flex h-10 flex-1 cursor-default select-none items-center justify-center px-5 text-sm font-medium leading-none text-zinc-400 outline-none hover:text-fuchsia-400 data-[state=active]:text-fuchsia-500 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current"
              value="following"
            >
              Following
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="notes">
            <ProfileNotes id={pubkey} />
          </Tabs.Content>
          <Tabs.Content value="followers">
            <ProfileFollowers id={pubkey} />
          </Tabs.Content>
          <Tabs.Content value="following">
            <ProfileFollows id={pubkey} />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </NewsfeedLayout>
  );
}
