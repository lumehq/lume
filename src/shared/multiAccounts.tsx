import { getAccounts, getActiveAccount } from "@libs/storage";
import { ActiveAccount } from "@shared/accounts/active";
import { InactiveAccount } from "@shared/accounts/inactive";
import { BellIcon, PlusIcon } from "@shared/icons";
import { APP_VERSION } from "@stores/constants";
import useSWR from "swr";

const allFetcher = () => getAccounts();
const fetcher = () => getActiveAccount();

export function MultiAccounts() {
	const { data: accounts }: any = useSWR("allAccounts", allFetcher);
	const { data: activeAccount }: any = useSWR("activeAccount", fetcher);

	return (
		<div className="flex shrink-0 w-[68px] h-full flex-col items-center justify-between border-r border-zinc-900 pb-4 pt-11">
			<div className="flex flex-col items-center">
				<div className="flex flex-col gap-2">
					<>
						{!activeAccount ? (
							<div className="group relative flex h-10 w-10 shrink animate-pulse items-center justify-center rounded-lg bg-zinc-900" />
						) : (
							<ActiveAccount data={activeAccount} />
						)}
					</>
					<div>
						<button
							type="button"
							className="group relative flex h-11 w-11 shrink items-center justify-center rounded-md bg-zinc-900 hover:bg-zinc-800"
						>
							<BellIcon
								width={16}
								height={16}
								className="text-zinc-400 group-hover:text-zinc-100"
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
									<InactiveAccount key={account.pubkey} data={account} />
								),
							)
						)}
					</>
					<button
						type="button"
						className="group relative flex h-10 w-10 shrink items-center justify-center rounded-md border border-dashed border-transparent hover:border-zinc-600"
					>
						<PlusIcon
							width={16}
							height={16}
							className="text-zinc-400 group-hover:text-zinc-100"
						/>
					</button>
				</div>
			</div>
			<div className="flex flex-col gap-0.5 text-center">
				<span className="text-base font-black uppercase leading-tight text-zinc-600">
					Lume
				</span>
				<span className="text-base font-medium text-zinc-700">
					v{APP_VERSION}
				</span>
			</div>
		</div>
	);
}
