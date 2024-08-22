import { cn } from "@/commons";
import { User } from "@/components/user";
import { LumeWindow, NostrAccount } from "@/system";
import { CaretDown, Feather, MagnifyingGlass } from "@phosphor-icons/react";
import {
	Outlet,
	createLazyFileRoute,
	useNavigate,
} from "@tanstack/react-router";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { message } from "@tauri-apps/plugin-dialog";
import { memo, useCallback, useState } from "react";

export const Route = createLazyFileRoute("/$account/_layout")({
	component: Screen,
});

function Screen() {
	const { settings, platform } = Route.useRouteContext();

	return (
		<div className="flex flex-col w-screen h-screen">
			<div
				data-tauri-drag-region
				className={cn(
					"flex h-10 shrink-0 items-center justify-between",
					platform === "macos" ? "pl-[72px] pr-3" : "pr-[156px] pl-3",
				)}
			>
				<div
					data-tauri-drag-region
					className="relative z-[200] flex-1 flex items-center gap-4"
				>
					<Account />
					<div className="flex items-center gap-2">
						<button
							type="button"
							className="inline-flex items-center justify-center size-7 bg-black/5 dark:bg-white/5 rounded-full hover:bg-blue-500 hover:text-white"
						>
							<MagnifyingGlass className="size-4" />
						</button>
						<button
							type="button"
							onClick={() => LumeWindow.openEditor()}
							className="inline-flex items-center justify-center h-7 gap-1.5 px-2 text-sm font-medium bg-black/5 dark:bg-white/5 rounded-full w-max hover:bg-blue-500 hover:text-white"
						>
							<Feather className="size-4" />
							New Post
						</button>
					</div>
				</div>
				<div
					id="toolbar"
					data-tauri-drag-region
					className="relative z-[200] flex-1 flex items-center justify-end gap-1"
				/>
			</div>
			<div
				className={cn(
					"flex-1",
					settings.vibrancy
						? ""
						: "bg-white dark:bg-black border-t border-black/20 dark:border-white/20",
				)}
			>
				<Outlet />
			</div>
		</div>
	);
}

const Account = memo(function Account() {
	const navigate = Route.useNavigate();
	const { account } = Route.useParams();

	const showContextMenu = useCallback(
		async (e: React.MouseEvent) => {
			e.preventDefault();

			const menuItems = await Promise.all([
				MenuItem.new({
					text: "New Post",
					action: () => LumeWindow.openEditor(),
				}),
				MenuItem.new({
					text: "View Profile",
					action: () => LumeWindow.openProfile(account),
				}),
				MenuItem.new({
					text: "Open Settings",
					action: () => LumeWindow.openSettings(),
				}),
				PredefinedMenuItem.new({ item: "Separator" }),
				MenuItem.new({
					text: "Logout",
					action: () => navigate({ to: "/" }),
				}),
			]);

			const menu = await Menu.new({
				items: menuItems,
			});

			await menu.popup().catch((e) => console.error(e));
		},
		[account],
	);

	return (
		<button
			type="button"
			onClick={(e) => showContextMenu(e)}
			className="inline-flex items-center gap-1.5"
		>
			<User.Provider pubkey={account}>
				<User.Root className="shrink-0 rounded-full">
					<User.Avatar className="rounded-full size-7" />
				</User.Root>
			</User.Provider>
			<CaretDown className="size-3" />
		</button>
	);
});
