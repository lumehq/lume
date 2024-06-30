import { User } from "@/components/user";
import {
	ChevronDownIcon,
	ComposeFilledIcon,
	PlusIcon,
	SearchIcon,
} from "@lume/icons";
import { LumeWindow, NostrAccount } from "@lume/system";
import { cn } from "@lume/utils";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { getCurrent } from "@tauri-apps/api/window";
import { message } from "@tauri-apps/plugin-dialog";
import { memo, useCallback, useState } from "react";

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

	const openLumeStore = async () => {
		await getCurrent().emit("columns", {
			type: "add",
			column: {
				label: "store",
				name: "Store",
				content: "/store/official",
			},
		});
	};

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
						onClick={() => openLumeStore()}
						className="inline-flex items-center justify-center gap-0.5 rounded-full text-sm font-medium h-8 w-max pl-1.5 pr-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
					>
						<PlusIcon className="size-5" />
						Column
					</button>
					<div id="toolbar" />
				</div>
				<div data-tauri-drag-region className="hidden md:flex md:flex-1">
					<Search />
				</div>
				<div
					data-tauri-drag-region
					className="flex-1 flex items-center justify-end gap-3"
				>
					<button
						type="button"
						onClick={() => LumeWindow.openEditor()}
						className="inline-flex items-center justify-center h-8 gap-1 px-3 text-sm font-medium bg-black/5 dark:bg-white/5 rounded-full w-max hover:bg-blue-500 hover:text-white"
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
		<div data-tauri-drag-region className="hidden md:flex items-center gap-3">
			{otherAccounts.map((npub) => (
				<button key={npub} type="button" onClick={(e) => changeAccount(npub)}>
					<User.Provider pubkey={npub}>
						<User.Root className="shrink-0 rounded-full transition-all ease-in-out duration-150 will-change-auto hover:ring-1 hover:ring-blue-500">
							<User.Avatar className="rounded-full size-8" />
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
						<User.Avatar className="rounded-full size-8" />
					</User.Root>
				</User.Provider>
				<ChevronDownIcon className="size-3" />
			</button>
		</div>
	);
});

const Search = memo(function Search() {
	const [searchType, setSearchType] = useState<"notes" | "users">("notes");
	const [query, setQuery] = useState("");

	const showContextMenu = useCallback(async (e: React.MouseEvent) => {
		e.preventDefault();

		const menuItems = await Promise.all([
			MenuItem.new({
				text: "Notes",
				action: () => setSearchType("notes"),
			}),
			MenuItem.new({
				text: "Users",
				action: () => setSearchType("users"),
			}),
		]);

		const menu = await Menu.new({
			items: menuItems,
		});

		await menu.popup().catch((e) => console.error(e));
	}, []);

	return (
		<div className="h-8 w-full px-3 text-sm rounded-full inline-flex items-center bg-black/5 dark:bg-white/5">
			<button
				type="button"
				onClick={(e) => showContextMenu(e)}
				className="inline-flex items-center gap-1 capitalize text-sm font-medium pr-2 border-r border-black/10 dark:border-white/10 text-black/50 dark:text-white/50"
			>
				{searchType}
				<ChevronDownIcon className="size-3" />
			</button>
			<input
				type="text"
				name="search"
				placeholder="Search..."
				onChange={(e) => setQuery(e.target.value)}
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						LumeWindow.openSearch(searchType, query);
					}
				}}
				className="h-full w-full px-3 text-sm rounded-full border-none ring-0 focus:ring-0 focus:outline-none bg-transparent placeholder:text-black/50 dark:placeholder:text-white/50"
			/>
			<SearchIcon className="size-5" />
		</div>
	);
});
