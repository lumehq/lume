/* eslint-disable @typescript-eslint/no-explicit-any */
import ActiveLink from '@components/activeLink';
import CreatePost from '@components/navigatorBar/createPost';

import PlusIcon from '@assets/icons/Plus';

export default function NavigatorBar() {
  return (
    <div className="flex h-full flex-col flex-wrap justify-between overflow-hidden px-2 pt-12 pb-4">
      {/* main */}
      <div className="flex flex-col gap-4">
        {/* Create post */}
        <div className="flex flex-col gap-2">
          <CreatePost />
        </div>
        {/* Newsfeed */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold text-zinc-400">Newsfeed</h3>
            <button
              type="button"
              className="group flex h-6 w-6 items-center justify-center rounded-full hover:bg-zinc-900">
              <PlusIcon className="h-4 w-4 text-zinc-400 group-hover:text-zinc-100" />
            </button>
          </div>
          <div className="flex flex-col gap-1 text-zinc-500">
            <ActiveLink
              href={`/feed/following`}
              activeClassName="rounded-lg ring-1 ring-white/10 dark:bg-zinc-900 dark:text-white"
              className="flex h-10 items-center gap-1 px-2.5 text-sm font-medium">
              <span>#</span>
              <span>following</span>
            </ActiveLink>
            <ActiveLink
              href={`/feed/global`}
              activeClassName="rounded-lg ring-1 ring-white/10 dark:bg-zinc-900 dark:text-white"
              className="flex h-10 items-center gap-1 px-2.5 text-sm font-medium">
              <span>#</span>
              <span>global</span>
            </ActiveLink>
          </div>
        </div>
        {/* Messages */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold text-zinc-400">Direct Messages</h3>
            <button
              type="button"
              className="group flex h-6 w-6 items-center justify-center rounded-full hover:bg-zinc-900">
              <PlusIcon className="h-4 w-4 text-zinc-400 group-hover:text-zinc-100" />
            </button>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

/* Channels
<div className="flex flex-col gap-2">
  <div className="flex items-center justify-between px-2">
    <h3 className="text-sm font-bold text-zinc-400">Channels</h3>
    <button
      type="button"
      className="group flex h-6 w-6 items-center justify-center rounded-full hover:bg-zinc-900">
      <PlusIcon className="h-4 w-4 text-zinc-400 group-hover:text-zinc-100" />
    </button>
  </div>
  <div></div>
</div>
*/
