import { cn } from "@/commons";
import { User } from "@/components/user";
import { LumeWindow, NostrAccount } from "@/system";
import { CaretDown, Feather, MagnifyingGlass } from "@phosphor-icons/react";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { message } from "@tauri-apps/plugin-dialog";
import { memo, useCallback, useState } from "react";

export const Route = createLazyFileRoute("/$account")({
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
					<Accounts />
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

const Accounts = memo(function Accounts() {
	const { otherAccounts } = Route.useRouteContext();
	const { account } = Route.useParams();

	const navigate = Route.useNavigate();

	const showContextMenu = useCallback(
		async (e: React.MouseEvent) => {
			e.preventDefault();

			const menuItems = await Promise.all([
				MenuItem.new({
					text: "New Post",
					action: () => LumeWindow.openEditor(),
				}),
				PredefinedMenuItem.new({ item: "Separator" }),
				MenuItem.new({
					text: "View Profile",
					action: () => LumeWindow.openProfile(account),
				}),
				MenuItem.new({
					text: "Open Settings",
					action: () => LumeWindow.openSettings(),
				}),
			]);

			const menu = await Menu.new({
				items: menuItems,
			});

			await menu.popup().catch((e) => console.error(e));
		},
		[account],
	);

	const changeAccount = useCallback(
		async (npub: string) => {
			// Change current account and update signer
			const select = await NostrAccount.loadAccount(npub);

			if (select) {
				// Reset current columns
				await getCurrentWindow().emit("columns", { type: "reset" });

				// Redirect to new account
				return navigate({
					to: "/$account/home",
					params: { account: npub },
					resetScroll: true,
					replace: true,
				});
			} else {
				await message("Something wrong.", { title: "Accounts", kind: "error" });
			}
		},
		[otherAccounts],
	);

	return (
		<div data-tauri-drag-region className="hidden md:flex items-center gap-3">
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
			{otherAccounts.map((npub) => (
				<button key={npub} type="button" onClick={(e) => changeAccount(npub)}>
					<User.Provider pubkey={npub}>
						<User.Root className="shrink-0 rounded-full transition-all ease-in-out duration-150 will-change-auto hover:ring-1 hover:ring-blue-500">
							<User.Avatar className="rounded-full size-7" />
						</User.Root>
					</User.Provider>
				</button>
			))}
		</div>
	);
});
