import { commands } from "@/commands.gen";
import { appColumns, cn } from "@/commons";
import { PublishIcon } from "@/components";
import { User } from "@/components/user";
import { LumeWindow } from "@/system";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import {
	Link,
	Outlet,
	createLazyFileRoute,
	useRouter,
} from "@tanstack/react-router";
import { listen } from "@tauri-apps/api/event";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { useCallback, useEffect } from "react";

export const Route = createLazyFileRoute("/_app")({
	component: Layout,
});

function Layout() {
	return (
		<div className="flex flex-col w-screen h-screen">
			<Topbar />
			<div className="flex-1 bg-neutral-100 dark:bg-neutral-900 border-t-[.5px] border-black/20 dark:border-white/20">
				<Outlet />
			</div>
		</div>
	);
}

function Topbar() {
	const { platform, accounts } = Route.useRouteContext();

	return (
		<div
			data-tauri-drag-region
			className={cn(
				"flex h-10 shrink-0 items-center justify-between",
				platform === "macos" ? "pl-[72px] pr-3" : "pr-[156px] pl-3",
			)}
		>
			<div
				data-tauri-drag-region
				className="relative z-[200] h-10 flex-1 flex items-center gap-2"
			>
				{accounts?.map((account) => (
					<Account key={account} pubkey={account} />
				))}
				<Link
					to="/new"
					className="inline-flex items-center justify-center size-7 bg-black/5 dark:bg-white/5 rounded-full hover:bg-blue-500 hover:text-white"
				>
					<Plus className="size-4" weight="bold" />
				</Link>
			</div>
			<div
				data-tauri-drag-region
				className="relative z-[200] flex-1 flex items-center justify-end gap-4"
			>
				{accounts?.length ? (
					<div className="inline-flex items-center gap-2">
						<button
							type="button"
							onClick={() => LumeWindow.openEditor()}
							className="inline-flex items-center justify-center h-7 gap-1 px-2 text-sm font-medium bg-black/5 dark:bg-white/5 rounded-full w-max hover:bg-blue-500 hover:text-white"
						>
							<PublishIcon className="size-4" />
							New Post
						</button>
						<button
							type="button"
							onClick={() => LumeWindow.openSearch()}
							className="inline-flex items-center justify-center size-7 bg-black/5 dark:bg-white/5 rounded-full hover:bg-blue-500 hover:text-white"
						>
							<MagnifyingGlass className="size-4" />
						</button>
					</div>
				) : null}
				<div id="toolbar" className="inline-flex items-center gap-2" />
			</div>
		</div>
	);
}

function Account({ pubkey }: { pubkey: string }) {
	const navigate = Route.useNavigate();
	const context = Route.useRouteContext();
	const router = useRouter();

	const { data: isActive } = useQuery({
		queryKey: ["signer", pubkey],
		queryFn: async () => {
			const res = await commands.hasSigner(pubkey);

			if (res.status === "ok") {
				return res.data;
			} else {
				return false;
			}
		},
	});

	const showContextMenu = useCallback(
		async (e: React.MouseEvent) => {
			e.preventDefault();

			const items = await Promise.all([
				MenuItem.new({
					text: "Activate",
					enabled: !isActive || true,
					action: async () => await commands.setSigner(pubkey),
				}),
				PredefinedMenuItem.new({ item: "Separator" }),
				MenuItem.new({
					text: "View Profile",
					action: () => LumeWindow.openProfile(pubkey),
				}),
				MenuItem.new({
					text: "Copy Public Key",
					action: async () => await writeText(pubkey),
				}),
				PredefinedMenuItem.new({ item: "Separator" }),
				MenuItem.new({
					text: "Settings",
					action: () => LumeWindow.openSettings(pubkey),
				}),
				PredefinedMenuItem.new({ item: "Separator" }),
				MenuItem.new({
					text: "Delete Account",
					action: async () => {
						const res = await commands.deleteAccount(pubkey);

						if (res.status === "ok") {
							router.invalidate();

							// Delete column associate with this account
							appColumns.setState((prev) =>
								prev.filter((col) =>
									col.account ? col.account !== pubkey : col,
								),
							);

							// Check remain account
							const newAccounts = context.accounts.filter(
								(account) => account !== pubkey,
							);

							// Redirect to new account screen
							if (newAccounts.length < 1) {
								navigate({ to: "/new", replace: true });
							}
						}
					},
				}),
			]);

			const menu = await Menu.new({ items });

			await menu.popup().catch((e) => console.error(e));
		},
		[pubkey],
	);

	useEffect(() => {
		const unlisten = listen("signer-updated", async () => {
			await context.queryClient.invalidateQueries({ queryKey: ["signer"] });
		});

		return () => {
			unlisten.then((f) => f());
		};
	}, []);

	return (
		<button
			type="button"
			onClick={(e) => showContextMenu(e)}
			className="h-10 relative"
		>
			<User.Provider pubkey={pubkey}>
				<User.Root className="shrink-0 rounded-full">
					<User.Avatar className="rounded-full size-7" />
				</User.Root>
			</User.Provider>
			{isActive ? (
				<div className="h-px w-full absolute bottom-0 left-0 bg-green-500 rounded-full" />
			) : null}
		</button>
	);
}
