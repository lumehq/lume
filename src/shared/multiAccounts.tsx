import { Transition } from "@headlessui/react";
import { getActiveAccount } from "@libs/storage";
import { ActiveAccount } from "@shared/accounts/active";
import { VerticalDotsIcon } from "@shared/icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";

export function MultiAccounts() {
	const {
		status,
		data: activeAccount,
		isFetching,
	} = useQuery(["activeAccount"], async () => {
		return await getActiveAccount();
	});

	const [open, setOpen] = useState(false);

	const toggleMenu = () => {
		setOpen((isOpen) => !isOpen);
	};

	return (
		<div className="flex flex-col gap-2 rounded-xl p-2 border-t border-zinc-800/50 bg-zinc-900/80 backdrop-blur-md">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					{status === "loading" || isFetching ? (
						<div className="group relative flex h-9 w-9 shrink animate-pulse items-center justify-center rounded-lg bg-zinc-900" />
					) : (
						<ActiveAccount data={activeAccount} />
					)}
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
					to="/app/settings"
					className="w-full py-2 px-2 rounded hover:bg-zinc-800 text-zinc-100 text-start text-sm"
				>
					Settings
				</Link>
				<Link
					to="/app/logout"
					className="w-full py-2 px-2 rounded hover:bg-zinc-800 text-zinc-100 text-start text-sm"
				>
					Logout
				</Link>
			</Transition>
		</div>
	);
}
