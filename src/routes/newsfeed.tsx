import { Spinner } from "@/components";
import { Conversation } from "@/components/conversation";
import { Quote } from "@/components/quote";
import { RepostNote } from "@/components/repost";
import { TextNote } from "@/components/text";
import { LumeEvent, NostrAccount, NostrQuery } from "@/system";
import { type ColumnRouteSearch, Kind, type Meta } from "@/types";
import { ArrowCircleRight, ArrowUp } from "@phosphor-icons/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useCallback, useEffect, useRef, useState } from "react";
import { Virtualizer } from "virtua";

type Payload = {
	raw: string;
	parsed: Meta;
};

export const Route = createFileRoute("/newsfeed")({
	validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
		return {
			account: search.account,
			label: search.label,
			name: search.name,
		};
	},
	beforeLoad: async ({ search }) => {
		const isContactListEmpty = await NostrAccount.isContactListEmpty();
		const settings = await NostrQuery.getUserSettings();

		if (isContactListEmpty) {
			throw redirect({
				to: "/create-newsfeed/users",
				search: {
					...search,
					redirect: "/newsfeed",
				},
			});
		}

		return { settings };
	},
	component: Screen,
});

export function Screen() {
	const { queryClient } = Route.useRouteContext();
	const { label, account } = Route.useSearch();
	const {
		data,
		isLoading,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
	} = useInfiniteQuery({
		queryKey: [label, account],
		initialPageParam: 0,
		queryFn: async ({ pageParam }: { pageParam: number }) => {
			const events = await NostrQuery.getLocalEvents(pageParam);
			return events;
		},
		getNextPageParam: (lastPage) => lastPage?.at(-1)?.created_at - 1,
		select: (data) => data?.pages.flat(),
	});

	const ref = useRef<HTMLDivElement>(null);

	const renderItem = useCallback(
		(event: LumeEvent) => {
			if (!event) return;
			switch (event.kind) {
				case Kind.Repost:
					return <RepostNote key={event.id} event={event} className="mb-3" />;
				default: {
					if (event.isConversation) {
						return (
							<Conversation key={event.id} className="mb-3" event={event} />
						);
					}
					if (event.isQuote) {
						return <Quote key={event.id} event={event} className="mb-3" />;
					}
					return <TextNote key={event.id} event={event} className="mb-3" />;
				}
			}
		},
		[data],
	);

	useEffect(() => {
		const unlisten = listen("synced", async () => {
			await queryClient.invalidateQueries({ queryKey: [label, account] });
		});

		return () => {
			unlisten.then((f) => f());
		};
	}, []);

	return (
		<ScrollArea.Root
			type={"scroll"}
			scrollHideDelay={300}
			className="overflow-hidden size-full"
		>
			<ScrollArea.Viewport ref={ref} className="relative h-full px-3 pb-3">
				<Listerner />
				<Virtualizer scrollRef={ref}>
					{isFetching && !isLoading && !isFetchingNextPage ? (
						<div className="flex items-center justify-center w-full mb-3 h-12 bg-black/5 dark:bg-white/5 rounded-xl">
							<div className="flex items-center justify-center gap-2">
								<Spinner className="size-5" />
								<span className="text-sm font-medium">
									Getting new notes...
								</span>
							</div>
						</div>
					) : null}
					{isLoading ? (
						<div className="flex items-center justify-center w-full h-16 gap-2">
							<Spinner className="size-5" />
							<span className="text-sm font-medium">Loading...</span>
						</div>
					) : !data.length ? (
						<div className="flex items-center justify-center">
							Yo. You're catching up on all the things happening around you.
						</div>
					) : (
						data.map((item) => renderItem(item))
					)}
					{data?.length && hasNextPage ? (
						<div>
							<button
								type="button"
								onClick={() => fetchNextPage()}
								disabled={isFetchingNextPage || isLoading}
								className="inline-flex items-center justify-center w-full gap-2 px-3 font-medium h-9 rounded-xl bg-black/5 hover:bg-black/10 focus:outline-none dark:bg-white/10 dark:hover:bg-white/20"
							>
								{isFetchingNextPage ? (
									<Spinner className="size-5" />
								) : (
									<>
										<ArrowCircleRight className="size-5" />
										Load more
									</>
								)}
							</button>
						</div>
					) : null}
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
	);
}

function Listerner() {
	const { queryClient } = Route.useRouteContext();
	const { label, account } = Route.useSearch();

	const [events, setEvents] = useState<LumeEvent[]>([]);

	const pushNewEvents = async () => {
		await queryClient.setQueryData(
			[label, account],
			(oldData: InfiniteData<LumeEvent[], number> | undefined) => {
				const firstPage = oldData?.pages[0];

				if (firstPage) {
					return {
						...oldData,
						pages: [
							{
								...firstPage,
								posts: [...events, ...firstPage],
							},
							...oldData.pages.slice(1),
						],
					};
				}
			},
		);

		await queryClient.invalidateQueries({ queryKey: [label, account] });
	};

	useEffect(() => {
		const unlisten = getCurrentWindow().listen<Payload>("new_event", (data) => {
			const event = LumeEvent.from(data.payload.raw, data.payload.parsed);
			setEvents((prev) => [event, ...prev]);
		});

		NostrQuery.listenLocalEvent().then(() => console.log("listen"));

		return () => {
			unlisten.then((f) => f());
			NostrQuery.unlisten().then(() => console.log("unlisten"));
		};
	}, []);

	if (!events?.length) return null;

	return (
		<div className="z-50 fixed top-0 left-0 w-full h-14 flex items-center justify-center px-3">
			<button
				type="button"
				onClick={() => pushNewEvents()}
				className="w-max h-8 pl-2 pr-3 inline-flex items-center justify-center gap-1.5 rounded-full shadow-lg text-sm font-medium text-white bg-black dark:text-black dark:bg-white"
			>
				<ArrowUp className="size-4" />
				{events.length} new notes
			</button>
		</div>
	);
}
