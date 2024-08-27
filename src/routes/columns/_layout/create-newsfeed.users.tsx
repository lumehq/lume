import { commands } from "@/commands.gen";
import { Spinner } from "@/components";
import { User } from "@/components/user";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { message } from "@tauri-apps/plugin-dialog";
import { fetch } from "@tauri-apps/plugin-http";
import { useRef, useState, useTransition } from "react";
import { Virtualizer } from "virtua";

export const Route = createFileRoute("/columns/_layout/create-newsfeed/users")({
	component: Screen,
});

interface Trending {
	profiles: Array<{ pubkey: string }>;
}

function Screen() {
	const { redirect, label, account } = Route.useSearch();
	const { queryClient } = Route.useRouteContext();
	const { isLoading, isError, data } = useQuery({
		queryKey: ["trending-users"],
		queryFn: async ({ signal }) => {
			const res = await fetch("https://api.nostr.band/v0/trending/profiles", {
				signal,
			});

			if (res.status !== 200) {
				throw new Error("Error.");
			}

			const data: Trending = await res.json();
			const users = data.profiles.map((item) => item.pubkey);

			return users;
		},
		refetchOnWindowFocus: false,
	});

	const navigate = Route.useNavigate();
	const ref = useRef<HTMLDivElement>(null);

	const [follows, setFollows] = useState<string[]>([]);
	const [isPending, startTransition] = useTransition();

	const toggleFollow = (pubkey: string) => {
		setFollows((prev) =>
			prev.includes(pubkey)
				? prev.filter((i) => i !== pubkey)
				: [...prev, pubkey],
		);
	};

	const submit = () => {
		startTransition(async () => {
			const res = await commands.setContactList(follows);

			if (res.status === "ok") {
				await queryClient.invalidateQueries({ queryKey: [label, account] });
				navigate({ to: redirect });
			} else {
				await message(res.error, { kind: "error" });
				return;
			}
		});
	};

	return (
		<div className="flex flex-col items-center w-full gap-3">
			<ScrollArea.Root
				type={"scroll"}
				scrollHideDelay={300}
				className="w-full h-[408px] bg-black/5 dark:bg-white/5 rounded-xl"
			>
				<ScrollArea.Viewport ref={ref} className="relative h-full p-2">
					<Virtualizer scrollRef={ref}>
						{isLoading ? (
							<div className="flex flex-col items-center justify-center w-full h-20 gap-1">
								<div className="inline-flex items-center gap-2 text-sm font-medium">
									<Spinner className="size-5" />
									Loading...
								</div>
							</div>
						) : isError ? (
							<div className="flex flex-col items-center justify-center w-full h-20 gap-1">
								<div className="inline-flex items-center gap-2 text-sm font-medium">
									Error.
								</div>
							</div>
						) : (
							data?.map((item) => (
								<div
									key={item}
									className="w-full p-2 mb-2 overflow-hidden bg-white rounded-lg h-max dark:bg-black/20shadow-primary dark:ring-1 ring-neutral-800/50"
								>
									<User.Provider pubkey={item}>
										<User.Root>
											<div className="flex flex-col w-full h-full gap-2">
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<User.Avatar className="rounded-full size-7" />
														<User.Name className="text-sm leadning-tight max-w-[15rem] truncate font-semibold" />
													</div>
													<button
														type="button"
														onClick={() => toggleFollow(item)}
														className="inline-flex items-center justify-center w-20 text-sm font-medium rounded-lg h-7 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
													>
														{follows.includes(item) ? "Unfollow" : "Follow"}
													</button>
												</div>
												<User.About className="select-text line-clamp-3 text-neutral-800 dark:text-neutral-400" />
											</div>
										</User.Root>
									</User.Provider>
								</div>
							))
						)}
					</Virtualizer>
				</ScrollArea.Viewport>
				<ScrollArea.Scrollbar
					className="flex select-none touch-none p-0.5 duration-[160ms] ease-out data-[orientation=vertical]:w-2"
					orientation="vertical"
				>
					<ScrollArea.Thumb className="flex-1 bg-black/10 dark:bg-white/10 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
				</ScrollArea.Scrollbar>
				<ScrollArea.Corner className="bg-transparent" />
			</ScrollArea.Root>
			<button
				type="button"
				onClick={() => submit()}
				disabled={isPending || follows.length < 1}
				className="inline-flex items-center justify-center text-sm font-medium text-white bg-blue-500 rounded-full w-36 h-9 hover:bg-blue-600 disabled:opacity-50"
			>
				{isPending ? <Spinner /> : "Confirm"}
			</button>
		</div>
	);
}
