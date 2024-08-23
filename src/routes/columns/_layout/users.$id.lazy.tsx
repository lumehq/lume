import { commands } from "@/commands.gen";
import { toLumeEvents } from "@/commons";
import { Spinner } from "@/components";
import { Quote } from "@/components/quote";
import { RepostNote } from "@/components/repost";
import { TextNote } from "@/components/text";
import { User } from "@/components/user";
import type { LumeEvent } from "@/system";
import { Kind } from "@/types";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Await } from "@tanstack/react-router";
import { Suspense, useCallback, useRef } from "react";
import { WindowVirtualizer } from "virtua";
import { Virtualizer } from "virtua";

export const Route = createLazyFileRoute("/columns/_layout/users/$id")({
	component: Screen,
});

function Screen() {
	const { id } = Route.useParams();
	const {
		isLoading,
		isError,
		error,
		data: events,
	} = useQuery({
		queryKey: ["stories", id],
		queryFn: async () => {
			const res = await commands.getEventsBy(id, 20);

			if (res.status === "ok") {
				const data = toLumeEvents(res.data);
				return data;
			} else {
				throw new Error(res.error);
			}
		},
		refetchOnWindowFocus: false,
	});

	const ref = useRef<HTMLDivElement>(null);

	const renderItem = useCallback(
		(event: LumeEvent) => {
			if (!event) return;
			switch (event.kind) {
				case Kind.Repost:
					return <RepostNote key={event.id} event={event} className="mb-3" />;
				default: {
					if (event.isQuote) {
						return <Quote key={event.id} event={event} className="mb-3" />;
					}
					return <TextNote key={event.id} event={event} className="mb-3" />;
				}
			}
		},
		[events],
	);

	return (
		<ScrollArea.Root
			type={"scroll"}
			scrollHideDelay={300}
			className="overflow-hidden size-full"
		>
			<ScrollArea.Viewport ref={ref} className="relative h-full px-3 pb-3">
				<Virtualizer scrollRef={ref} overscan={0}>
					<User.Provider pubkey={id}>
						<User.Root className="relative">
							<User.Cover className="object-cover w-full h-44 rounded-lg" />
							<User.Button className="absolute top-4 right-4 inline-flex items-center justify-center w-20 text-xs font-medium text-white shadow-md shadow-blue-500/20 bg-blue-500 hover:bg-blue-600 rounded-full h-7" />
							<div className="flex flex-col items-center gap-3 -mt-8">
								<User.Avatar className="rounded-full size-14" />
								<div className="flex items-center gap-1">
									<User.Name className="text-lg font-semibold leading-tight" />
									<User.NIP05 />
								</div>
								<User.About className="text-center" />
							</div>
						</User.Root>
					</User.Provider>
					<div className="mt-5">
						{isLoading ? (
							<div className="flex items-center justify-center w-full h-16 gap-2">
								<Spinner className="size-5" />
								<span className="text-sm font-medium">Loading...</span>
							</div>
						) : !events.length ? (
							<div className="flex items-center justify-center">
								Yo. You're catching up on all the things happening around you.
							</div>
						) : (
							events.map((item) => renderItem(item))
						)}
					</div>
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
