import { Transition } from "@headlessui/react";
import { getAccounts, getActiveAccount } from "@libs/storage";
import { ActiveAccount } from "@shared/accounts/active";
import { InactiveAccount } from "@shared/accounts/inactive";
import { PlusIcon, VerticalDotsIcon } from "@shared/icons";
import { Link } from "@shared/link";
import { useState } from "react";
import useSWR from "swr";

const allFetcher = () => getAccounts();
const fetcher = () => getActiveAccount();

export function MultiAccounts() {
	const { data: accounts }: any = useSWR("allAccounts", allFetcher);
	const { data: activeAccount }: any = useSWR("activeAccount", fetcher);

	const [open, setOpen] = useState(false);

	const toggleMenu = () => {
		setOpen((isOpen) => !isOpen);
	};

	return (
		<div className="flex flex-col gap-2 rounded-xl p-2 border-t border-zinc-800/50 bg-zinc-900/80 backdrop-blur-md">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
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
				<button
					type="button"
					onClick={() => toggleMenu()}
					className="inline-flex items-center justify-center w-5 h-5 rounded hover:bg-zinc-800"
				>
					<VerticalDotsIcon className="w-4 h-4 text-zinc-100" />
				</button>
			</div>
			<Transition
				show={open}
				enter="transition-transform ease-in-out duration-75"
				enterFrom="translate-y-16"
				enterTo="translate-y-0"
				leave="transition-transform ease-in-out duration-150"
				leaveFrom="translate-y-0"
				leaveTo="translate-y-16"
				className="flex flex-col items-start justify-start gap-1 pt-1.5 border-t border-zinc-800 transform"
			>
				<Link
					href="/app/settings"
					className="w-full py-2 px-2 rounded hover:bg-zinc-800 text-zinc-100 text-start text-sm"
				>
					Settings
				</Link>
				<Link
					href="/app/logout"
					className="w-full py-2 px-2 rounded hover:bg-zinc-800 text-zinc-100 text-start text-sm"
				>
					Logout
				</Link>
			</Transition>
		</div>
	);
}
