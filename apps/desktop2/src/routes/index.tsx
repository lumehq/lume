import { PlusIcon } from "@lume/icons";
import { Spinner } from "@lume/ui";
import { User } from "@/components/user";
import { checkForAppUpdates } from "@lume/utils";
import { Link } from "@tanstack/react-router";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
	beforeLoad: async ({ context }) => {
		// check for app updates
		await checkForAppUpdates(true);

		const ark = context.ark;
		const accounts = await ark.get_all_accounts();

		if (!accounts.length) {
			throw redirect({
				to: "/landing",
				replace: true,
			});
		}

		// Run notification service
		await invoke("run_notification", { accounts });

		return { accounts };
	},
	component: Screen,
});

function Screen() {
	const navigate = Route.useNavigate();
	const { ark, accounts } = Route.useRouteContext();

	const [loading, setLoading] = useState(false);

	const select = async (npub: string) => {
		try {
			setLoading(true);

			const loadAccount = await ark.load_selected_account(npub);
			if (loadAccount) {
				return navigate({
					to: "/$account/home",
					params: { account: npub },
					replace: true,
				});
			}
		} catch (e) {
			setLoading(false);
			toast.error(String(e));
		}
	};

	const currentDate = new Date().toLocaleString("default", {
		weekday: "long",
		month: "long",
		day: "numeric",
	});

	return (
		<div className="relative flex h-full w-full items-center justify-center">
			<div className="relative z-20 flex flex-col items-center gap-16">
				<div className="text-center text-white">
					<h2 className="mb-1 text-2xl">{currentDate}</h2>
					<h2 className="text-2xl font-semibold">Welcome back!</h2>
				</div>
				<div className="flex items-center justify-center gap-6">
					{loading ? (
						<div className="inline-flex size-6 items-center justify-center">
							<Spinner className="size-6 text-white" />
						</div>
					) : (
						<>
							{accounts.map((account) => (
								<button
									type="button"
									key={account}
									onClick={() => select(account)}
								>
									<User.Provider pubkey={account}>
										<User.Root className="flex h-36 w-32 flex-col items-center justify-center gap-4 rounded-2xl p-2 hover:bg-white/10 dark:hover:bg-black/10">
											<User.Avatar className="size-20 rounded-full object-cover" />
											<User.Name className="max-w-[5rem] truncate text-lg font-medium leading-tight text-white" />
										</User.Root>
									</User.Provider>
								</button>
							))}
							<Link to="/landing">
								<div className="flex h-36 w-32 flex-col items-center justify-center gap-4 rounded-2xl p-2 text-white hover:bg-white/10 dark:hover:bg-black/10">
									<div className="flex size-20 items-center justify-center rounded-full bg-white/20 dark:bg-black/20">
										<PlusIcon className="size-5" />
									</div>
									<p className="text-lg font-medium leading-tight">Add</p>
								</div>
							</Link>
						</>
					)}
				</div>
			</div>
			<div className="absolute z-10 h-full w-full bg-white/10 backdrop-blur-lg dark:bg-black/10" />
			<div className="absolute inset-0 h-full w-full">
				<img
					src="/lock-screen.jpg"
					srcSet="/lock-screen@2x.jpg 2x"
					alt="Lock Screen Background"
					className="h-full w-full object-cover"
				/>
				<a
					href="https://njump.me/nprofile1qqs9tuz9jpn57djg7nxunhyvuvk69g5zqaxdpvpqt9hwqv7395u9rpg6zq5uw"
					target="_blank"
					className="absolute bottom-3 right-3 z-50 rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white dark:bg-black/20"
					rel="noreferrer"
				>
					Design by NoGood
				</a>
			</div>
		</div>
	);
}
