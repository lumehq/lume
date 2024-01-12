import { RepostNote, TextNote, useArk, useProfile } from "@lume/ark";
import { ArrowRightCircleIcon, LoaderIcon } from "@lume/icons";
import { NIP05 } from "@lume/ui";
import { FETCH_LIMIT, displayNpub } from "@lume/utils";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { WindowVirtualizer } from "virtua";

export function HomeRoute({ id }: { id: string }) {
	const ark = useArk();

	const { user } = useProfile(id);
	const { data, hasNextPage, isLoading, isFetchingNextPage, fetchNextPage } =
		useInfiniteQuery({
			queryKey: ["user-posts", id],
			initialPageParam: 0,
			queryFn: async ({
				signal,
				pageParam,
			}: {
				signal: AbortSignal;
				pageParam: number;
			}) => {
				const events = await ark.getInfiniteEvents({
					filter: {
						kinds: [NDKKind.Text, NDKKind.Repost],
						authors: [id],
					},
					limit: FETCH_LIMIT,
					pageParam,
					signal,
				});

				return events;
			},
			getNextPageParam: (lastPage) => {
				const lastEvent = lastPage.at(-1);
				if (!lastEvent) return;
				return lastEvent.created_at - 1;
			},
			refetchOnWindowFocus: false,
		});

	const [followed, setFollowed] = useState(false);

	const allEvents = useMemo(
		() => (data ? data.pages.flatMap((page) => page) : []),
		[data],
	);

	const follow = async (pubkey: string) => {
		try {
			const add = await ark.createContact({ pubkey });
			if (add) {
				setFollowed(true);
			} else {
				toast.success("You already follow this user");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const unfollow = async (pubkey: string) => {
		try {
			const remove = await ark.deleteContact({ pubkey });
			if (remove) {
				setFollowed(false);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const renderItem = (event: NDKEvent) => {
		switch (event.kind) {
			case NDKKind.Text:
				return <TextNote key={event.id} event={event} className="mt-3" />;
			case NDKKind.Repost:
				return <RepostNote key={event.id} event={event} className="mt-3" />;
			default:
				return <TextNote key={event.id} event={event} className="mt-3" />;
		}
	};

	useEffect(() => {
		if (ark.account.contacts.includes(id)) {
			setFollowed(true);
		}
	}, []);

	return (
		<div className="py-5 overflow-y-auto">
			<WindowVirtualizer>
				<div className="px-3">
					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between">
							<img
								src={user?.picture || user?.image}
								alt={id}
								className="object-cover w-12 h-12 rounded-lg shrink-0"
								loading="lazy"
								decoding="async"
							/>
							<div className="inline-flex items-center gap-2">
								{followed ? (
									<button
										type="button"
										onClick={() => unfollow(id)}
										className="inline-flex items-center justify-center text-sm font-medium rounded-lg h-9 w-28 bg-neutral-200 hover:bg-blue-500 hover:text-white dark:bg-neutral-800"
									>
										Unfollow
									</button>
								) : (
									<button
										type="button"
										onClick={() => follow(id)}
										className="inline-flex items-center justify-center text-sm font-medium rounded-lg h-9 w-28 bg-neutral-200 hover:bg-blue-500 hover:text-white dark:bg-neutral-800"
									>
										Follow
									</button>
								)}
								<Link
									to={`/chats/${id}`}
									className="inline-flex items-center justify-center text-sm font-medium rounded-lg h-9 w-28 bg-neutral-200 hover:bg-blue-500 hover:text-white dark:bg-neutral-800"
								>
									Message
								</Link>
							</div>
						</div>
						<div className="flex flex-1 flex-col gap-1.5">
							<div className="flex flex-col">
								<h5 className="text-lg font-semibold">
									{user?.name ||
										user?.display_name ||
										user?.displayName ||
										"Anon"}
								</h5>
								{user?.nip05 ? (
									<NIP05
										pubkey={id}
										nip05={user?.nip05}
										className="max-w-[15rem] truncate text-sm text-neutral-600 dark:text-neutral-400"
									/>
								) : (
									<span className="max-w-[15rem] truncate text-sm text-neutral-600 dark:text-neutral-400">
										{displayNpub(id, 16)}
									</span>
								)}
							</div>
							<div className="max-w-[500px] select-text break-words text-neutral-900 dark:text-neutral-100">
								{user?.about}
							</div>
						</div>
					</div>
					<div className="pt-2 mt-2 border-t border-neutral-100 dark:border-neutral-900">
						<h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
							Latest posts
						</h3>
						<div className="flex h-full w-full flex-col justify-between gap-1.5 pb-10">
							{isLoading ? (
								<div className="flex items-center justify-center">
									<LoaderIcon className="w-4 h-4 animate-spin" />
								</div>
							) : (
								allEvents.map((item) => renderItem(item))
							)}
							<div className="flex items-center justify-center h-16 px-3 pb-3">
								{hasNextPage ? (
									<button
										type="button"
										onClick={() => fetchNextPage()}
										disabled={!hasNextPage || isFetchingNextPage}
										className="inline-flex items-center justify-center w-full h-12 gap-2 font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 rounded-xl focus:outline-none"
									>
										{isFetchingNextPage ? (
											<LoaderIcon className="size-5 animate-spin" />
										) : (
											<>
												<ArrowRightCircleIcon className="size-5" />
												Load more
											</>
										)}
									</button>
								) : null}
							</div>
						</div>
					</div>
				</div>
			</WindowVirtualizer>
		</div>
	);
}
