import ActiveAccount from "@shared/accounts/active";
import InactiveAccount from "@shared/accounts/inactive";

import BellIcon from "@icons/bell";
import PlusIcon from "@icons/plus";

import { APP_VERSION } from "@stores/constants";

import { getAccounts, getActiveAccount } from "@utils/storage";

import useSWR from "swr";

const allFetcher = () => getAccounts();
const fetcher = () => getActiveAccount();

export default function MultiAccounts() {
	const { data: accounts }: any = useSWR("allAccounts", allFetcher);
	const { data: activeAccount }: any = useSWR("activeAccount", fetcher);

	return (
		<div className="flex shrink-0 w-[68px] h-full flex-col items-center justify-between border-r border-zinc-900 pb-4 pt-3">
			<div className="flex flex-col items-center">
				<div className="flex flex-col gap-2">
					<>
						{!activeAccount ? (
							<div className="group relative flex h-10 w-10 shrink animate-pulse items-center justify-center rounded-lg bg-zinc-900" />
						) : (
							<ActiveAccount user={activeAccount} />
						)}
					</>
					<div>
						<button
							type="button"
							className="group relative flex h-10 w-10 shrink items-center justify-center rounded-lg bg-zinc-900 hover:bg-zinc-800"
						>
							<BellIcon
								width={16}
								height={16}
								className="text-zinc-400 group-hover:text-zinc-200"
							/>
						</button>
					</div>
				</div>
				<div className="my-2 h-px w-2/3 bg-zinc-800" />
				<div className="flex flex-col gap-3">
					<>
						{!accounts ? (
							<div className="group relative flex h-10 w-10 shrink animate-pulse items-center justify-center rounded-lg bg-zinc-900" />
						) : (
							accounts.map(
								(account: { is_active: number; pubkey: string }) => (
									<InactiveAccount key={account.pubkey} user={account} />
								),
							)
						)}
					</>
					<button
						type="button"
						className="group relative flex h-10 w-10 shrink items-center justify-center rounded-lg border-2 border-dashed border-transparent hover:border-zinc-600"
					>
						<PlusIcon
							width={16}
							height={16}
							className="text-zinc-400 group-hover:text-zinc-200"
						/>
					</button>
				</div>
			</div>
			<div className="flex flex-col gap-0.5 text-center">
				<span className="text-sm font-black uppercase leading-tight text-zinc-600">
					Lume
				</span>
				<span className="text-xs font-medium text-zinc-700">
					v{APP_VERSION}
				</span>
			</div>
		</div>
	);
}
