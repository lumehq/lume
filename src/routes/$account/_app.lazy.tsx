import { cn } from "@/commons";
import { User } from "@/components/user";
import { LumeWindow } from "@/system";
import { CaretDown, Feather, MagnifyingGlass } from "@phosphor-icons/react";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { memo, useCallback } from "react";

export const Route = createLazyFileRoute("/$account/_app")({
	component: Screen,
});

function Screen() {
	const context = Route.useRouteContext();

	return (
		<div className="flex flex-col w-screen h-screen">
			<div
				data-tauri-drag-region
				className={cn(
					"flex h-10 shrink-0 items-center justify-between",
					context.platform === "macos" ? "pl-[72px] pr-3" : "pr-[156px] pl-3",
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
							onClick={() => LumeWindow.openSearch()}
							className="inline-flex items-center justify-center size-7 bg-black/5 dark:bg-white/5 rounded-full hover:bg-blue-500 hover:text-white"
						>
							<MagnifyingGlass className="size-4" />
						</button>
						<button
							type="button"
							onClick={() => LumeWindow.openEditor()}
							className="inline-flex items-center justify-center h-7 gap-1.5 px-2 text-sm font-medium bg-black/5 dark:bg-white/5 rounded-full w-max hover:bg-blue-500 hover:text-white"
						>
							<Feather className="size-4" weight="fill" />
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
			<div className="flex-1 bg-neutral-100 dark:bg-neutral-900 border-t-[.5px] border-black/20 dark:border-white/20">
				<Outlet />
			</div>
		</div>
	);
}

const Account = memo(function Account() {
	const params = Route.useParams();
	const navigate = Route.useNavigate();

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
					action: () => LumeWindow.openProfile(params.account),
				}),
				MenuItem.new({
					text: "Settings",
					action: () => LumeWindow.openSettings(params.account),
				}),
				PredefinedMenuItem.new({ item: "Separator" }),
				MenuItem.new({
					text: "Copy Public Key",
					action: async () => await writeText(params.account),
				}),
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
		[params.account],
	);

	return (
		<button
			type="button"
			onClick={(e) => showContextMenu(e)}
			className="inline-flex items-center gap-1.5"
		>
			<User.Provider pubkey={params.account}>
				<User.Root className="shrink-0 rounded-full">
					<User.Avatar className="rounded-full size-7" />
				</User.Root>
			</User.Provider>
			<CaretDown className="size-3" />
		</button>
	);
});
