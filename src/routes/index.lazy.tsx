import { commands } from "@/commands.gen";
import { appSettings, displayNpub } from "@/commons";
import { Frame, Spinner, User } from "@/components";
import { ArrowRight, DotsThree, GearSix, Plus } from "@phosphor-icons/react";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { Menu, MenuItem } from "@tauri-apps/api/menu";
import { message } from "@tauri-apps/plugin-dialog";
import {
	useCallback,
	useEffect,
	useMemo,
	useState,
	useTransition,
} from "react";

export const Route = createLazyFileRoute("/")({
	component: Screen,
});

function Screen() {
	const context = Route.useRouteContext();
	const navigate = Route.useNavigate();

	const currentDate = useMemo(
		() =>
			new Date().toLocaleString("default", {
				weekday: "long",
				month: "long",
				day: "numeric",
			}),
		[],
	);

	const [accounts, setAccounts] = useState([]);
	const [value, setValue] = useState("");
	const [autoLogin, setAutoLogin] = useState(false);
	const [password, setPassword] = useState("");
	const [isPending, startTransition] = useTransition();

	const deleteAccount = async (account: string) => {
		const res = await commands.deleteAccount(account);

		if (res.status === "ok") {
			setAccounts((prev) => prev.filter((item) => item !== account));
		}
	};

	const selectAccount = (account: string) => {
		setValue(account);

		if (account.includes("_nostrconnect")) {
			setAutoLogin(true);
		}
	};

	const loginWith = () => {
		startTransition(async () => {
			const res = await commands.login(value, password);

			if (res.status === "ok") {
				const settings = await commands.getSettings();

				if (settings.status === "ok") {
					appSettings.setState(() => settings.data);
				}

				navigate({
					to: "/$account/home",
					params: { account: res.data },
					replace: true,
				});
			} else {
				await message(res.error, { title: "Login", kind: "error" });
				return;
			}
		});
	};

	const showContextMenu = useCallback(
		async (e: React.MouseEvent, account: string) => {
			e.stopPropagation();

			const menuItems = await Promise.all([
				MenuItem.new({
					text: "Reset password",
					enabled: !account.includes("_nostrconnect"),
					action: () => navigate({ to: "/reset", search: { account } }),
				}),
				MenuItem.new({
					text: "Delete account",
					action: async () => await deleteAccount(account),
				}),
			]);

			const menu = await Menu.new({
				items: menuItems,
			});

			await menu.popup().catch((e) => console.error(e));
		},
		[],
	);

	useEffect(() => {
		if (autoLogin) {
			loginWith();
		}
	}, [autoLogin, value]);

	useEffect(() => {
		setAccounts(context.accounts);
	}, [context.accounts]);

	return (
		<div
			data-tauri-drag-region
			className="relative size-full flex items-center justify-center"
		>
			<div className="w-[320px] flex flex-col gap-8">
				<div className="flex flex-col gap-1 text-center">
					<h3 className="leading-tight text-neutral-700 dark:text-neutral-300">
						{currentDate}
					</h3>
					<h1 className="leading-tight text-xl font-semibold">Welcome back!</h1>
				</div>
				<Frame
					className="flex flex-col w-full divide-y divide-neutral-100 dark:divide-white/5 rounded-xl overflow-hidden"
					shadow
				>
					{accounts.map((account) => (
						<div
							key={account}
							onClick={() => selectAccount(account)}
							onKeyDown={() => selectAccount(account)}
							className="group flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 p-3"
						>
							<User.Provider pubkey={account.replace("_nostrconnect", "")}>
								<User.Root className="flex-1 flex items-center gap-2.5">
									<User.Avatar className="rounded-full size-10" />
									{value === account && !value.includes("_nostrconnect") ? (
										<div className="flex-1 flex items-center gap-2">
											<input
												name="password"
												type="password"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === "Enter") loginWith();
												}}
												disabled={isPending}
												placeholder="Password"
												className="px-3 rounded-full w-full h-10 bg-transparent border border-neutral-200 dark:border-neutral-500 focus:border-blue-500 focus:outline-none placeholder:text-neutral-400"
											/>
										</div>
									) : (
										<div className="inline-flex flex-col items-start">
											<div className="inline-flex items-center gap-1.5">
												<User.Name className="max-w-[6rem] truncate font-medium leading-tight" />
												{account.includes("_nostrconnect") ? (
													<div className="text-[8px] border border-blue-500 text-blue-500 px-1.5 rounded-full">
														Nostr Connect
													</div>
												) : null}
											</div>
											<span className="text-sm text-neutral-700 dark:text-neutral-300">
												{displayNpub(account.replace("_nostrconnect", ""), 16)}
											</span>
										</div>
									)}
								</User.Root>
							</User.Provider>
							<div className="inline-flex items-center justify-center size-8 shrink-0">
								{value === account ? (
									isPending ? (
										<Spinner />
									) : (
										<button
											type="button"
											onClick={() => loginWith()}
											className="rounded-full size-10 inline-flex items-center justify-center"
										>
											<ArrowRight className="size-5" />
										</button>
									)
								) : (
									<button
										type="button"
										onClick={(e) => showContextMenu(e, account)}
										className="rounded-full size-10 hidden group-hover:inline-flex items-center justify-center"
									>
										<DotsThree className="size-5" />
									</button>
								)}
							</div>
						</div>
					))}
					<Link
						to="/new"
						className="flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5"
					>
						<div className="flex items-center gap-2.5 p-3">
							<div className="inline-flex items-center justify-center rounded-full size-10 bg-neutral-200 dark:bg-white/10">
								<Plus className="size-5" />
							</div>
							<span className="truncate text-sm font-medium leading-tight">
								New account
							</span>
						</div>
					</Link>
				</Frame>
			</div>
			<div className="absolute bottom-2 right-2">
				<Link
					to="/bootstrap-relays"
					className="h-8 w-max text-xs px-3 inline-flex items-center justify-center gap-1.5 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-full"
				>
					<GearSix className="size-4" />
					Manage Relays
				</Link>
			</div>
		</div>
	);
}
