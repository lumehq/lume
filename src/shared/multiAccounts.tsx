import { getAccounts, getActiveAccount } from "@libs/storage";
import { ActiveAccount } from "@shared/accounts/active";
import { InactiveAccount } from "@shared/accounts/inactive";
import { BellIcon, PlusIcon } from "@shared/icons";
import useSWR from "swr";

const allFetcher = () => getAccounts();
const fetcher = () => getActiveAccount();

export function MultiAccounts() {
	const { data: accounts }: any = useSWR("allAccounts", allFetcher);
	const { data: activeAccount }: any = useSWR("activeAccount", fetcher);

	return (
		<div className="flex items-center gap-2 rounded-xl p-2 border-t border-zinc-800/50 bg-zinc-900/80 backdrop-blur-md">
			{!activeAccount ? (
				<div className="group relative flex h-9 w-9 shrink animate-pulse items-center justify-center rounded-lg bg-zinc-900" />
			) : (
				<ActiveAccount data={activeAccount} />
			)}
			{!accounts ? (
				<div className="group relative flex h-9 w-9 shrink animate-pulse items-center justify-center rounded-lg bg-zinc-900" />
			) : (
				accounts.map((account: { is_active: number; pubkey: string }) => (
					<InactiveAccount key={account.pubkey} data={account} />
				))
			)}
			<button
				type="button"
				className="group relative flex h-9 w-9 shrink items-center justify-center rounded border border-dashed border-zinc-600 hover:border-zinc-400"
			>
				<PlusIcon
					width={16}
					height={16}
					className="text-zinc-400 group-hover:text-zinc-100"
				/>
			</button>
		</div>
	);
}
