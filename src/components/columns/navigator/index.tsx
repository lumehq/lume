import ActiveLink from '@components/activeLink';
import Messages from '@components/columns/navigator/messages';

import { PlusIcon } from '@radix-ui/react-icons';
import useLocalStorage from '@rehooks/local-storage';

export default function NavigatorColumn() {
  const [follows] = useLocalStorage('follows');

  return (
    <div className="flex h-full flex-col gap-4 pt-4">
      {/* Newsfeed */}
      <div className="flex flex-col gap-1 px-2">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-300">Newsfeed</h3>
          <button
            type="button"
            className="group flex h-6 w-6 items-center justify-center rounded-full hover:bg-zinc-900"
          >
            <PlusIcon className="h-3 w-3 text-zinc-500 group-hover:text-zinc-100" />
          </button>
        </div>
        <div className="flex flex-col gap-1 text-zinc-400">
          <ActiveLink
            href={`/newsfeed/following`}
            activeClassName="ring-1 ring-white/10 dark:bg-zinc-900 dark:text-white hover:dark:bg-zinc-800"
            className="flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium hover:bg-zinc-900"
          >
            <div className="inline-flex h-5 w-5 items-center justify-center">
              <span className="h-4 w-3.5 rounded bg-gradient-to-br from-fuchsia-500 via-purple-300 to-pink-300"></span>
            </div>
            <span>following</span>
          </ActiveLink>
          <ActiveLink
            href={`/newsfeed/circle`}
            activeClassName="ring-1 ring-white/10 dark:bg-zinc-900 dark:text-white hover:dark:bg-zinc-800"
            className="flex h-8 items-center gap-2.5 rounded-md px-2.5 text-sm font-medium hover:bg-zinc-900"
          >
            <div className="inline-flex h-5 w-5 items-center justify-center">
              <span className="h-4 w-3.5 rounded bg-gradient-to-br from-amber-500 via-orange-200 to-yellow-300"></span>
            </div>
            <span>circle</span>
          </ActiveLink>
        </div>
      </div>
      {/* Messages */}
      <div className="flex flex-col gap-1 px-2">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-300">Messages</h3>
          <button
            type="button"
            className="group flex h-6 w-6 items-center justify-center rounded-full hover:bg-zinc-900"
          >
            <PlusIcon className="h-3 w-3 text-zinc-500 group-hover:text-zinc-100" />
          </button>
        </div>
        <div className="flex flex-col">
          <Messages data={follows} />
        </div>
      </div>
    </div>
  );
}
