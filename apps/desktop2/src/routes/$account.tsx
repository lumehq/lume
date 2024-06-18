import { User } from "@/components/user";
import {
	ComposeFilledIcon,
	HorizontalDotsIcon,
	PlusIcon,
	SearchIcon,
} from "@lume/icons";
import { LumeWindow, NostrAccount } from "@lume/system";
import { cn } from "@lume/utils";
import * as Popover from "@radix-ui/react-popover";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { getCurrent } from "@tauri-apps/api/window";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/$account")({
	beforeLoad: async () => {
		const accounts = await NostrAccount.getAccounts();
		return { accounts };
	},
	component: Screen,
});

function Screen() {
	const { platform } = Route.useRouteContext();

	return (
		<div className="flex flex-col w-screen h-screen">
			<div
				data-tauri-drag-region
				className={cn(
					"flex h-11 shrink-0 items-center justify-between pr-2",
					platform === "macos" ? "ml-2 pl-20" : "pl-4",
				)}
			>
				<div className="flex items-center gap-3">
					<Accounts />
					<Link
						to="/landing"
						className="inline-flex items-center justify-center rounded-full size-8 shrink-0 bg-black/10 text-neutral-800 hover:bg-black/20 dark:bg-white/10 dark:text-neutral-200 dark:hover:bg-white/20"
					>
						<PlusIcon className="size-5" />
					</Link>
				</div>
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => LumeWindow.openSearch()}
						className="inline-flex items-center justify-center rounded-full size-8 text-neutral-800 hover:bg-black/10 dark:text-neutral-200 dark:hover:bg-white/10"
					>
						<SearchIcon className="size-5" />
					</button>
					<button
						type="button"
						onClick={() => LumeWindow.openEditor()}
						className="inline-flex items-center justify-center h-8 gap-1 px-3 text-sm font-medium text-white bg-blue-500 rounded-full w-max hover:bg-blue-600"
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

function Accounts() {
	const { accounts } = Route.useRouteContext();
	const { account } = Route.useParams();

	const [windowWidth, setWindowWidth] = useState<number>(null);

	const navigate = Route.useNavigate();
	const sortedList = useMemo(() => {
		const list = accounts;

		for (const [i, item] of list.entries()) {
			if (item === account) {
				list.splice(i, 1);
				list.unshift(item);
			}
		}

		return list;
	}, [accounts]);

	const changeAccount = async (npub: string) => {
		if (npub === account) {
			return await LumeWindow.openProfile(account);
		}

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
			toast.warning("Something wrong.");
		}
	};

	const getWindowDimensions = () => {
		const { innerWidth: width, innerHeight: height } = window;
		return {
			width,
			height,
		};
	};

	useEffect(() => {
		function handleResize() {
			setWindowWidth(getWindowDimensions().width);
		}

		if (!windowWidth) {
			setWindowWidth(getWindowDimensions().width);
		}

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div data-tauri-drag-region className="flex items-center gap-3">
			{sortedList
				.slice(0, windowWidth > 500 ? account.length : 2)
				.map((user) => (
					<button key={user} type="button" onClick={() => changeAccount(user)}>
						<User.Provider pubkey={user}>
							<User.Root
								className={cn(
									"shrink-0 rounded-full transition-all ease-in-out duration-150 will-change-auto",
									user === account
										? "ring-1 ring-teal-500 ring-offset-2 ring-offset-neutral-200 dark:ring-offset-neutral-950"
										: "",
								)}
							>
								<User.Avatar
									className={cn(
										"aspect-square h-auto rounded-full object-cover transition-all ease-in-out duration-150 will-change-auto",
										user === account ? "w-7" : "w-8",
									)}
								/>
							</User.Root>
						</User.Provider>
					</button>
				))}
			{accounts.length >= 3 && windowWidth <= 700 ? (
				<Popover.Root>
					<Popover.Trigger className="inline-flex items-center justify-center rounded-full size-8 shrink-0 bg-black/10 text-neutral-800 hover:bg-black/20 dark:bg-white/10 dark:text-neutral-200 dark:hover:bg-white/20">
						<HorizontalDotsIcon className="size-5" />
					</Popover.Trigger>
					<Popover.Portal>
						<Popover.Content className="flex h-11 select-none items-center justify-center rounded-md bg-neutral-950 p-1 text-sm text-neutral-50 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade dark:bg-neutral-50 dark:text-neutral-950">
							{sortedList.slice(2).map((user) => (
								<button
									key={user}
									type="button"
									onClick={() => changeAccount(user)}
									className="inline-flex items-center justify-center rounded-md size-9 hover:bg-white/10"
								>
									<User.Provider pubkey={user}>
										<User.Root className="rounded-full ring-1 ring-white/10">
											<User.Avatar className="object-cover h-auto rounded-full size-7 aspect-square" />
										</User.Root>
									</User.Provider>
								</button>
							))}
							<Popover.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
						</Popover.Content>
					</Popover.Portal>
				</Popover.Root>
			) : null}
		</div>
	);
}
