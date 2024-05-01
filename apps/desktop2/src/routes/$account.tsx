import { ComposeFilledIcon, PlusIcon, SearchIcon } from "@lume/icons";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { cn } from "@lume/utils";
import { Account } from "@lume/types";
import { User } from "@lume/ui";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/$account")({
	component: Screen,
});

function Screen() {
	const navigate = Route.useNavigate();
	const { ark, platform } = Route.useRouteContext();

	return (
		<div className="flex h-screen w-screen flex-col">
			<div
				data-tauri-drag-region
				className={cn(
					"flex h-11 shrink-0 items-center justify-between pr-2",
					platform === "macos" ? "ml-2 pl-20" : "pl-4",
				)}
			>
				<div className="flex items-center gap-3">
					<Accounts />
					<button
						type="button"
						onClick={() => navigate({ to: "/landing" })}
						className="inline-flex size-8 items-center justify-center rounded-full bg-black/10 text-neutral-800 hover:bg-black/20 dark:bg-white/10 dark:text-neutral-200 dark:hover:bg-white/20"
					>
						<PlusIcon className="size-5" />
					</button>
					<button
						type="button"
						onClick={() => ark.open_search()}
						className="inline-flex size-8 items-center justify-center rounded-full bg-black/10 text-neutral-800 hover:bg-black/20 dark:bg-white/10 dark:text-neutral-200 dark:hover:bg-white/20"
					>
						<SearchIcon className="size-4" />
					</button>
				</div>
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => ark.open_editor()}
						className="inline-flex h-8 w-max items-center justify-center gap-1 rounded-full bg-blue-500 px-3 text-sm font-medium text-white hover:bg-blue-600"
					>
						<ComposeFilledIcon className="size-4" />
						New Post
					</button>
					<div id="toolbar" />
				</div>
			</div>
			<div className="flex-1">
				<Outlet />
			</div>
		</div>
	);
}

export function Accounts() {
	const navigate = Route.useNavigate();
	const { ark } = Route.useRouteContext();
	const { account } = Route.useParams();

	const [accounts, setAccounts] = useState<Account[]>([]);

	const changeAccount = async (npub: string) => {
		if (npub === account) return;
		const select = await ark.load_selected_account(npub);
		if (select)
			return navigate({ to: "/$account/home", params: { account: npub } });
	};

	useEffect(() => {
		async function getAllAccounts() {
			const data = await ark.get_all_accounts();
			if (data) setAccounts(data);
		}

		getAllAccounts();
	}, []);

	return (
		<div data-tauri-drag-region className="flex items-center gap-3">
			{accounts.map((user) => (
				<button
					key={user.npub}
					type="button"
					onClick={() => changeAccount(user.npub)}
				>
					<User.Provider pubkey={user.npub}>
						<User.Root
							className={cn(
								"rounded-full",
								user.npub === account
									? "ring-1 ring-teal-500 ring-offset-2 ring-offset-neutral-200 dark:ring-offset-neutral-950"
									: "",
							)}
						>
							<User.Avatar
								className={cn(
									"aspect-square h-auto rounded-full object-cover",
									user.npub === account ? "w-7" : "w-8",
								)}
							/>
						</User.Root>
					</User.Provider>
				</button>
			))}
		</div>
	);
}
