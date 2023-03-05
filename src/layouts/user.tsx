import ActiveLink from '@components/activeLink';
import AccountColumn from '@components/columns/account';

import { useLocalStorage } from '@rehooks/local-storage';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [currentUser]: any = useLocalStorage('current-user');

  return (
    <div className="flex h-full w-full flex-row">
      <div className="relative h-full w-[70px] shrink-0 border-r border-zinc-900">
        <div data-tauri-drag-region className="absolute top-0 left-0 h-12 w-full" />
        <AccountColumn />
      </div>
      <div className="grid grow grid-cols-4">
        <div className="col-span-1">
          <div className="flex h-full flex-col flex-wrap justify-between overflow-hidden px-2 pt-3 pb-4">
            {/* main */}
            <div className="flex flex-col gap-4">
              {/* menu */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-bold text-zinc-400">Menu</h3>
                </div>
                <div className="flex flex-col gap-1 text-zinc-500">
                  <ActiveLink
                    href={`/profile/${currentUser.pubkey}`}
                    activeClassName="ring-1 ring-white/10 dark:bg-zinc-900 dark:text-white"
                    className="flex h-10 items-center gap-1 rounded-lg px-2.5 text-sm font-medium hover:bg-zinc-900"
                  >
                    <span>Personal Page</span>
                  </ActiveLink>
                  <ActiveLink
                    href={`/profile/update?pubkey=${currentUser.pubkey}`}
                    activeClassName="ring-1 ring-white/10 dark:bg-zinc-900 dark:text-white"
                    className="flex h-10 items-center gap-1 rounded-lg px-2.5 text-sm font-medium hover:bg-zinc-900"
                  >
                    <span>Update Profile</span>
                  </ActiveLink>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-3 m-3 ml-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-input shadow-black/20">
          <div className="h-full w-full rounded-lg">{children}</div>
        </div>
      </div>
    </div>
  );
}
