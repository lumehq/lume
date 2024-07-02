import { User } from "@/components/user";
import { LumeWindow, NostrQuery } from "@lume/system";
import type { NostrEvent } from "@lume/types";
import { Spinner } from "@lume/ui";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { fetch } from "@tauri-apps/plugin-http";
import { useRef } from "react";
import { Virtualizer } from "virtua";

type Search = {
	query: string;
};

type UserItem = {
	pubkey: string;
	profile: string;
};

export const Route = createFileRoute("/search/users")({
	validateSearch: (search: Record<string, string>): Search => {
		return {
			query: search.query,
		};
	},
	beforeLoad: async () => {
		const settings = await NostrQuery.getUserSettings();
		return { settings };
	},
	component: Screen,
});

function Screen() {
	const { query } = Route.useSearch();
	const { isLoading, data } = useQuery({
		queryKey: ["search", query],
		queryFn: async () => {
			try {
				const res = await fetch(
					`https://api.nostr.wine/search?query=${query}&kind=0&limit=100`,
				);
				const content = await res.json();
				const events = content.data as NostrEvent[];
				const users: UserItem[] = events.map((ev) => ({
					pubkey: ev.pubkey,
					profile: ev.content,
				}));

				return users;
			} catch (e) {
				throw new Error(e);
			}
		},
		refetchOnWindowFocus: false,
	});

	const ref = useRef<HTMLDivElement>(null);

	return (
		<ScrollArea.Viewport ref={ref} className="h-full px-3 pt-3">
			<Virtualizer scrollRef={ref}>
				{isLoading ? (
					<div className="flex items-center justify-center w-full h-11 gap-2">
						<Spinner className="size-5" />
						<span className="text-sm font-medium">Searching...</span>
					</div>
				) : (
					data.map((item) => (
						<div
							key={item.pubkey}
							className="w-full p-3 mb-2 overflow-hidden bg-white rounded-lg h-max dark:bg-black/20 shadow-primary dark:ring-1 ring-neutral-800/50"
						>
							<User.Provider pubkey={item.pubkey} embedProfile={item.profile}>
								<User.Root className="flex flex-col w-full h-full gap-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<User.Avatar className="rounded-full size-7" />
											<div className="inline-flex items-center gap-1">
												<User.Name className="text-sm leadning-tight max-w-[15rem] truncate font-semibold" />
												<User.NIP05 />
											</div>
										</div>
										<button
											type="button"
											onClick={() => LumeWindow.openProfile(item.pubkey)}
											className="inline-flex items-center justify-center w-16 text-sm font-medium rounded-md h-7 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
										>
											View
										</button>
									</div>
									<User.About className="select-text line-clamp-3 max-w-none text-neutral-800 dark:text-neutral-400" />
								</User.Root>
							</User.Provider>
						</div>
					))
				)}
			</Virtualizer>
		</ScrollArea.Viewport>
	);
}
