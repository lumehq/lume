import { Frame, Spinner } from "@/components";
import { Conversation } from "@/components/conversation";
import { Quote } from "@/components/quote";
import { RepostNote } from "@/components/repost";
import { TextNote } from "@/components/text";
import { User } from "@/components/user";
import { type LumeEvent, NostrQuery } from "@/system";
import { Kind } from "@/types";
import { createFileRoute, defer } from "@tanstack/react-router";
import { Await } from "@tanstack/react-router";
import { Suspense, useCallback } from "react";
import { WindowVirtualizer } from "virtua";

export const Route = createFileRoute("/users/$id")({
	beforeLoad: async () => {
		const settings = await NostrQuery.getUserSettings();
		return { settings };
	},
	loader: async ({ params }) => {
		return { data: defer(NostrQuery.getUserEvents(params.id)) };
	},
	component: Screen,
});

function Screen() {
	const { id } = Route.useParams();
	const { data } = Route.useLoaderData();

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

	return (
		<div className="flex flex-col">
			<div
				data-tauri-drag-region
				className="bg-transparent flex h-11 w-full shrink-0"
			/>
			<Frame className="flex-1 px-0 scrollbar-none bg-black/5 dark:bg-white/5">
				<WindowVirtualizer>
					<User.Provider pubkey={id}>
						<User.Root>
							<User.Cover className="object-cover w-full h-44" />
							<div className="relative flex flex-col px-3 -mt-8">
								<User.Avatar className="rounded-full size-14" />
								<div className="inline-flex items-center justify-between mb-4">
									<div className="flex items-center gap-1">
										<User.Name className="text-lg font-semibold leading-tight" />
										<User.NIP05 />
									</div>
									<User.Button className="inline-flex items-center justify-center w-24 text-sm font-medium text-white bg-black rounded-full h-9 hover:bg-neutral-900 dark:bg-neutral-900" />
								</div>
								<User.About />
							</div>
						</User.Root>
					</User.Provider>
					<div className="px-3 mt-5">
						<div className="mb-3">
							<h3 className="text-lg font-semibold">Latest notes</h3>
						</div>
						<Suspense
							fallback={
								<div className="flex h-20 w-full items-center justify-center gap-1.5 text-sm font-medium">
									<Spinner className="size-5" />
									Loading...
								</div>
							}
						>
							<Await promise={data}>
								{(events) => events.map((event) => renderItem(event))}
							</Await>
						</Suspense>
					</div>
				</WindowVirtualizer>
			</Frame>
		</div>
	);
}
