import { PlusIcon } from "@lume/icons";
import { Spinner } from "@lume/ui";
import { User } from "@/components/user";
import { checkForAppUpdates } from "@lume/utils";
import { Link } from "@tanstack/react-router";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { NostrAccount } from "@lume/system";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		await checkForAppUpdates(true); // check for app updates
		const accounts = await NostrAccount.getAccounts();

		if (accounts.length < 1) {
			throw redirect({
				to: "/landing",
				replace: true,
			});
		}

		return { accounts };
	},
	component: Screen,
});

function Screen() {
	const navigate = Route.useNavigate();
	const context = Route.useRouteContext();

	const [loading, setLoading] = useState(false);

	const select = async (npub: string) => {
		try {
			setLoading(true);

			const status = await NostrAccount.loadAccount(npub);

			if (status) {
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
		<div
			data-tauri-drag-region
			className="relative flex h-full w-full items-center justify-center"
		>
			<div className="relative z-20 flex flex-col items-center gap-16">
				<div className="text-center">
					<h2 className="text-xl text-neutral-700 dark:text-neutral-300">
						{currentDate}
					</h2>
					<h2 className="text-2xl font-semibold">Welcome back!</h2>
				</div>
				<div className="flex flex-wrap px-3 items-center justify-center gap-6">
					{loading ? (
						<div className="inline-flex size-6 items-center justify-center">
							<Spinner className="size-6" />
						</div>
					) : (
						<>
							{context.accounts.map((account) => (
								<button
									key={account}
									type="button"
									onClick={() => select(account)}
								>
									<User.Provider pubkey={account}>
										<User.Root className="flex h-36 w-32 flex-col items-center justify-center gap-3 rounded-2xl p-2 hover:bg-black/10 dark:hover:bg-white/10">
											<User.Avatar className="size-20 rounded-full object-cover" />
											<User.Name className="max-w-[6rem] truncate font-medium leading-tight" />
										</User.Root>
									</User.Provider>
								</button>
							))}
							<Link to="/landing">
								<div className="flex h-36 w-32 flex-col items-center justify-center gap-3 rounded-2xl p-2 hover:bg-black/10 dark:hover:bg-white/10">
									<div className="flex size-20 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
										<PlusIcon className="size-8" />
									</div>
									<p className="font-medium leading-tight">Add</p>
								</div>
							</Link>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
