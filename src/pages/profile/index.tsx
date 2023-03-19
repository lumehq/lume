import BaseLayout from '@layouts/base';
import WithSidebarLayout from '@layouts/withSidebar';

import { RelayContext } from '@components/contexts/relay';

import * as Tabs from '@radix-ui/react-tabs';
import useLocalStorage from '@rehooks/local-storage';
import Image from 'next/image';
import { Author } from 'nostr-relaypool';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useContext, useMemo } from 'react';

export default function Page() {
  const relayPool: any = useContext(RelayContext);

  const [relays]: any = useLocalStorage('relays');
  const [currentUser]: any = useLocalStorage('current-user');

  const user = new Author(relayPool, relays, currentUser.id);
  const userProfile = JSON.parse(currentUser.metadata);

  return (
    <div className="h-full w-full p-px">
      <div className="relative">
        <div className="relative h-64 w-full rounded-t-lg bg-zinc-800">
          {userProfile.banner && (
            <Image src={userProfile.banner} alt="user's banner" fill={true} className="h-full w-full object-cover" />
          )}
        </div>
        <div className="relative -top-8 px-4">
          <button className="relative h-16 w-16">
            <Image src={userProfile.picture} alt="user's avatar" fill={true} className="rounded-lg object-cover" />
          </button>
        </div>
      </div>
      <div className="-mt-4 mb-8 px-4">
        <div>
          <div className="mb-3 flex flex-col">
            <h3 className="text-xl font-bold leading-tight text-zinc-100">{userProfile.display_name}</h3>
            <span className="leading-tight text-zinc-500">@{userProfile.username}</span>
          </div>
          <div className="prose prose-zinc leading-tight dark:prose-invert">{userProfile.about}</div>
        </div>
      </div>
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
        <Tabs.Content className="px-4" value="notes">
          <p>Notes</p>
        </Tabs.Content>
        <Tabs.Content className="px-4" value="followers">
          <p>Followers</p>
        </Tabs.Content>
        <Tabs.Content className="px-4" value="following">
          <p>Following</p>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

Page.getLayout = function getLayout(
  page:
    | string
    | number
    | boolean
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>
    | ReactFragment
    | ReactPortal
) {
  return (
    <BaseLayout>
      <WithSidebarLayout>{page}</WithSidebarLayout>
    </BaseLayout>
  );
};
