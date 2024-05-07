import { BellIcon, ComposeFilledIcon, PlusIcon, SearchIcon } from "@lume/icons";
import { Event, Kind } from "@lume/types";
import { User } from "@lume/ui";
import {
	cn,
	decodeZapInvoice,
	displayNpub,
	sendNativeNotification,
} from "@lume/utils";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { UnlistenFn } from "@tauri-apps/api/event";
import { getCurrent } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/$account")({
	beforeLoad: async ({ context }) => {
		const ark = context.ark;
		const accounts = await ark.get_all_accounts();

		return { accounts };
	},
	component: Screen,
});

function Screen() {
	const { ark, platform } = Route.useRouteContext();
	const navigate = Route.useNavigate();

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
				</div>
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => ark.open_editor()}
						className="inline-flex h-8 w-max items-center justify-center gap-1 rounded-full bg-blue-500 px-3 text-sm font-medium text-white hover:bg-blue-600"
					>
						<ComposeFilledIcon className="size-4" />
						New Post
					</button>
					<Bell />
					<button
						type="button"
						onClick={() => ark.open_search()}
						className="inline-flex size-8 items-center justify-center rounded-full text-neutral-800 hover:bg-black/10 dark:text-neutral-200 dark:hover:bg-white/10"
					>
						<SearchIcon className="size-5" />
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

function Accounts() {
	const navigate = Route.useNavigate();
	const { ark, accounts } = Route.useRouteContext();
	const { account } = Route.useParams();

	const changeAccount = async (npub: string) => {
		if (npub === account) return;

		const select = await ark.load_selected_account(npub);

		if (select) {
			return navigate({ to: "/$account/home", params: { account: npub } });
		}
	};

	return (
		<div data-tauri-drag-region className="flex items-center gap-3">
			{accounts.map((user) => (
				<button key={user} type="button" onClick={() => changeAccount(user)}>
					<User.Provider pubkey={user}>
						<User.Root
							className={cn(
								"rounded-full",
								user === account
									? "ring-1 ring-teal-500 ring-offset-2 ring-offset-neutral-200 dark:ring-offset-neutral-950"
									: "",
							)}
						>
							<User.Avatar
								className={cn(
									"aspect-square h-auto rounded-full object-cover",
									user === account ? "w-7" : "w-8",
								)}
							/>
						</User.Root>
					</User.Provider>
				</button>
			))}
		</div>
	);
}

function Bell() {
	const { ark } = Route.useRouteContext();
	const { account } = Route.useParams();

	const [isRing, setIsRing] = useState(false);

	useEffect(() => {
		let unlisten: UnlistenFn = undefined;

		async function listenNotify() {
			unlisten = await getCurrent().listen<string>(
				"activity",
				async (payload) => {
					setIsRing(true);

					const event: Event = JSON.parse(payload.payload);
					const user = await ark.get_profile(event.pubkey);
					const userName =
						user.display_name || user.name || displayNpub(event.pubkey, 16);

					switch (event.kind) {
						case Kind.Text: {
							sendNativeNotification("Mentioned you in a note", userName);
							break;
						}
						case Kind.Repost: {
							sendNativeNotification("Reposted your note", userName);
							break;
						}
						case Kind.ZapReceipt: {
							const amount = decodeZapInvoice(event.tags);
							sendNativeNotification(
								`Zapped ₿ ${amount.bitcoinFormatted}`,
								userName,
							);
							break;
						}
						default:
							break;
					}
				},
			);
		}

		if (!unlisten) listenNotify();

		return () => {
			if (unlisten) unlisten();
		};
	}, []);

	return (
		<button
			type="button"
			onClick={() => {
				setIsRing(false);
				ark.open_activity(account);
			}}
			className="relative inline-flex size-8 items-center justify-center rounded-full text-neutral-800 hover:bg-black/10 dark:text-neutral-200 dark:hover:bg-white/10"
		>
			<BellIcon className="size-5" />
			{isRing ? (
				<span className="absolute right-0 top-0 block size-2 rounded-full bg-teal-500 ring-1 ring-black/5" />
			) : null}
		</button>
	);
}
