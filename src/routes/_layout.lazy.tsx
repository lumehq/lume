import { type NegentropyEvent, commands } from "@/commands.gen";
import { cn } from "@/commons";
import { User } from "@/components/user";
import { LumeWindow } from "@/system";
import { Feather, MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { Channel } from "@tauri-apps/api/core";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { memo, useCallback, useEffect, useState } from "react";

export const Route = createLazyFileRoute("/_layout")({
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
	const context = Route.useRouteContext();
	const { data: accounts } = useQuery({
		queryKey: ["accounts"],
		queryFn: async () => {
			return await commands.getAccounts();
		},
	});

	return (
		<div
			data-tauri-drag-region
			className={cn(
				"flex h-10 shrink-0 items-center justify-between",
				context.platform === "macos" ? "pl-[72px] pr-3" : "pr-[156px] pl-3",
			)}
		>
			<div
				data-tauri-drag-region
				className="relative z-[200] flex-1 flex items-center gap-2"
			>
				<NegentropyBadge />
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
							className="inline-flex items-center justify-center h-7 gap-1.5 px-2 text-sm font-medium bg-black/5 dark:bg-white/5 rounded-full w-max hover:bg-blue-500 hover:text-white"
						>
							<Feather className="size-4" weight="fill" />
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

const NegentropyBadge = memo(function NegentropyBadge() {
	const [process, setProcess] = useState<NegentropyEvent>(null);

	useEffect(() => {
		const channel = new Channel<NegentropyEvent>();

		channel.onmessage = (message) => {
			if (message.Progress.message === "Ok") {
				setProcess(null);
			} else {
				setProcess(message);
			}
		};

		(async () => {
			await commands.runSync(channel);
		})();
	}, []);

	if (!process) {
		return null;
	}

	return (
		<div className="h-7 w-max px-3 inline-flex items-center justify-center text-[9px] font-medium rounded-full bg-black/5 dark:bg-white/5">
			{process ? (
				<span>
					{process.Progress.message}
					{process.Progress.total_event > 0
						? ` / ${process.Progress.total_event}`
						: null}
				</span>
			) : (
				"Syncing"
			)}
		</div>
	);
});

const Account = memo(function Account({ pubkey }: { pubkey: string }) {
	const showContextMenu = useCallback(
		async (e: React.MouseEvent) => {
			e.preventDefault();

			const menuItems = await Promise.all([
				MenuItem.new({
					text: "New Post",
					action: () => LumeWindow.openEditor(),
				}),
				MenuItem.new({
					text: "Profile",
					action: () => LumeWindow.openProfile(pubkey),
				}),
				MenuItem.new({
					text: "Settings",
					action: () => LumeWindow.openSettings(pubkey),
				}),
				PredefinedMenuItem.new({ item: "Separator" }),
				MenuItem.new({
					text: "Copy Public Key",
					action: async () => await writeText(pubkey),
				}),
			]);

			const menu = await Menu.new({
				items: menuItems,
			});

			await menu.popup().catch((e) => console.error(e));
		},
		[pubkey],
	);

	return (
		<button type="button" onClick={(e) => showContextMenu(e)}>
			<User.Provider pubkey={pubkey}>
				<User.Root className="shrink-0 rounded-full">
					<User.Avatar className="rounded-full size-7" />
				</User.Root>
			</User.Provider>
		</button>
	);
});
