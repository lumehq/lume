import { User } from "@/components/user";
import { ChevronDownIcon, ComposeFilledIcon, PlusIcon } from "@lume/icons";
import { LumeWindow, NostrAccount } from "@lume/system";
import { cn } from "@lume/utils";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { getCurrent } from "@tauri-apps/api/window";
import { message } from "@tauri-apps/plugin-dialog";
import { memo, useCallback } from "react";

export const Route = createFileRoute("/$account")({
	beforeLoad: async ({ params }) => {
		const accounts = await NostrAccount.getAccounts();
		const otherAccounts = accounts.filter(
			(account) => account !== params.account,
		);

		return { otherAccounts };
	},
	component: Screen,
});

function Screen() {
	const { platform } = Route.useRouteContext();

	return (
		<div className="flex flex-col w-screen h-screen">
			<div
				data-tauri-drag-region
				className="flex h-11 shrink-0 items-center justify-between px-3"
			>
				<div
					data-tauri-drag-region
					className={cn(
						"flex-1 flex items-center gap-2",
						platform === "macos" ? "pl-[64px]" : "",
					)}
				>
					<button
						type="button"
						className="inline-flex items-center justify-center gap-1 rounded-full text-sm font-medium h-8 w-max pl-1.5 pr-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
					>
						<PlusIcon className="size-5" />
						Add column
					</button>
					<div id="toolbar" />
				</div>
				<div data-tauri-drag-region className="hidden md:flex md:flex-1" />
				<div
					data-tauri-drag-region
					className="flex-1 flex items-center justify-end gap-2"
				>
					<button
						type="button"
						onClick={() => LumeWindow.openEditor()}
						className="inline-flex items-center justify-center h-8 gap-1 px-3 text-sm font-medium text-white bg-blue-500 rounded-full w-max hover:bg-blue-600"
					>
						<ComposeFilledIcon className="size-4" />
						New Post
					</button>
					<Accounts />
				</div>
			</div>
			<div className="flex-1">
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
				await getCurrent().emit("columns", { type: "reset" });

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
		<div data-tauri-drag-region className="hidden md:flex items-center gap-2">
			{otherAccounts.map((npub) => (
				<button key={npub} type="button" onClick={(e) => changeAccount(npub)}>
					<User.Provider pubkey={npub}>
						<User.Root className="shrink-0 rounded-full transition-all ease-in-out duration-150 will-change-auto hover:ring-1 hover:ring-blue-500">
							<User.Avatar className="size-8 rounded-full object-cover" />
						</User.Root>
					</User.Provider>
				</button>
			))}
			<button
				type="button"
				onClick={(e) => showContextMenu(e)}
				className="inline-flex items-center gap-1.5"
			>
				<User.Provider pubkey={account}>
					<User.Root className="shrink-0 rounded-full">
						<User.Avatar className="size-8 rounded-full" />
					</User.Root>
				</User.Provider>
				<ChevronDownIcon className="size-3" />
			</button>
		</div>
	);
});
