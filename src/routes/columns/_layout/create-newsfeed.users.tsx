import { Spinner } from "@/components";
import { User } from "@/components/user";
import { NostrAccount } from "@/system";
import type { ColumnRouteSearch } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { Await, defer } from "@tanstack/react-router";
import { message } from "@tauri-apps/plugin-dialog";
import { Suspense, useState } from "react";

export const Route = createFileRoute("/columns/_layout/create-newsfeed/users")({
	validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
		return {
			account: search.account,
			label: search.label,
			name: search.name,
		};
	},
	loader: async ({ abortController }) => {
		try {
			return {
				data: defer(
					fetch("https://api.nostr.band/v0/trending/profiles", {
						signal: abortController.signal,
					}).then((res) => res.json()),
				),
			};
		} catch (e) {
			throw new Error(String(e));
		}
	},
	component: Screen,
});

function Screen() {
	const { data } = Route.useLoaderData();
	const { redirect } = Route.useSearch();

	const [isLoading, setIsLoading] = useState(false);
	const [follows, setFollows] = useState<string[]>([]);

	const navigate = Route.useNavigate();

	const toggleFollow = (pubkey: string) => {
		setFollows((prev) =>
			prev.includes(pubkey)
				? prev.filter((i) => i !== pubkey)
				: [...prev, pubkey],
		);
	};

	const submit = async () => {
		try {
			setIsLoading(true);

			const newContactList = await NostrAccount.setContactList(follows);

			if (newContactList) {
				return navigate({ to: redirect });
			}
		} catch (e) {
			setIsLoading(false);
			await message(String(e), {
				title: "Create Group",
				kind: "error",
			});
		}
	};

	return (
		<div className="flex flex-col items-center w-full gap-3">
			<div className="overflow-y-auto scrollbar-none p-2 w-full h-[450px] bg-black/5 dark:bg-white/5 rounded-xl">
				<Suspense
					fallback={
						<div className="flex flex-col items-center justify-center w-full h-20 gap-1">
							<button
								type="button"
								className="inline-flex items-center gap-2 text-sm font-medium"
								disabled
							>
								<Spinner className="size-5" />
								Loading...
							</button>
						</div>
					}
				>
					<Await promise={data}>
						{(users) =>
							users.profiles.map((item: { pubkey: string }) => (
								<div
									key={item.pubkey}
									className="w-full p-2 mb-2 overflow-hidden bg-white rounded-lg h-max dark:bg-black/20shadow-primary dark:ring-1 ring-neutral-800/50"
								>
									<User.Provider pubkey={item.pubkey}>
										<User.Root>
											<div className="flex flex-col w-full h-full gap-2">
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<User.Avatar className="rounded-full size-7" />
														<User.Name className="text-sm leadning-tight max-w-[15rem] truncate font-semibold" />
													</div>
													<button
														type="button"
														onClick={() => toggleFollow(item.pubkey)}
														className="inline-flex items-center justify-center w-20 text-sm font-medium rounded-lg h-7 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
													>
														{follows.includes(item.pubkey)
															? "Unfollow"
															: "Follow"}
													</button>
												</div>
												<User.About className="select-text line-clamp-3 max-w-none text-neutral-800 dark:text-neutral-400" />
											</div>
										</User.Root>
									</User.Provider>
								</div>
							))
						}
					</Await>
				</Suspense>
			</div>
			<button
				type="button"
				onClick={() => submit()}
				disabled={isLoading || follows.length < 1}
				className="inline-flex items-center justify-center text-sm font-medium text-white bg-blue-500 rounded-full w-36 h-9 hover:bg-blue-600 disabled:opacity-50"
			>
				{isLoading ? <Spinner /> : "Confirm"}
			</button>
		</div>
	);
}
