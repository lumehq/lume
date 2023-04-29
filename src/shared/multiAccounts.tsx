import ActiveAccount from '@lume/shared/accounts/active';
import InactiveAccount from '@lume/shared/accounts/inactive';
import LumeIcon from '@lume/shared/icons/lume';
import PlusIcon from '@lume/shared/icons/plus';
import { APP_VERSION } from '@lume/stores/constants';
import { getAccounts } from '@lume/utils/storage';

import useSWR from 'swr';

const fetcher = () => getAccounts();

export default function MultiAccounts() {
  const { data, error }: any = useSWR('allAccounts', fetcher);

  return (
    <div className="flex h-full flex-col items-center justify-between px-2 pb-4 pt-3">
      <div className="flex flex-col gap-3">
        <a
          href="/app/newsfeed/following"
          className="group relative flex h-11 w-11 shrink cursor-pointer items-center justify-center rounded-lg bg-zinc-900 hover:bg-zinc-800"
        >
          <LumeIcon className="h-6 w-auto text-zinc-400 group-hover:text-zinc-200" />
        </a>
        <>
          {error && <div>failed to load</div>}
          {!data ? (
            <div className="group relative flex h-11 w-11 shrink animate-pulse cursor-pointer items-center justify-center rounded-lg bg-zinc-900"></div>
          ) : (
            data.map((account: { is_active: number; pubkey: string }) => {
              if (account.is_active === 1) {
                return <ActiveAccount key={account.pubkey} user={account} />;
              } else {
                return <InactiveAccount key={account.pubkey} user={account} />;
              }
            })
          )}
        </>
        <a
          href="/onboarding"
          className="group relative flex h-11 w-11 shrink cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-zinc-600 hover:border-zinc-400"
        >
          <PlusIcon width={16} height={16} className="text-zinc-400 group-hover:text-zinc-200" />
        </a>
      </div>
      <div className="flex flex-col gap-0.5 text-center">
        <span className="text-sm font-black uppercase leading-tight text-zinc-600">Lume</span>
        <span className="text-xs font-medium text-zinc-700">v{APP_VERSION}</span>
      </div>
    </div>
  );
}
