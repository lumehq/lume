import { Box, Container, Spinner } from "@lume/ui";
import { User } from "@/components/user";
import { createFileRoute, defer } from "@tanstack/react-router";
import { WindowVirtualizer } from "virtua";
import { Conversation } from "@/components/conversation";
import { Quote } from "@/components/quote";
import { RepostNote } from "@/components/repost";
import { TextNote } from "@/components/text";
import { type NostrEvent, Kind } from "@lume/types";
import { Suspense } from "react";
import { Await } from "@tanstack/react-router";
import { NostrQuery } from "@lume/system";

export const Route = createFileRoute("/users/$pubkey")({
	beforeLoad: async () => {
		const settings = await NostrQuery.getSettings();
		return { settings };
	},
	loader: async ({ params }) => {
		return { data: defer(NostrQuery.getUserEvents(params.pubkey)) };
	},
	component: Screen,
});

function Screen() {
	const { pubkey } = Route.useParams();
	const { data } = Route.useLoaderData();

	const renderItem = (event: NostrEvent) => {
		if (!event) return;
		switch (event.kind) {
			case Kind.Repost:
				return <RepostNote key={event.id} event={event} />;
			default: {
				const isConversation =
					event.tags.filter((tag) => tag[0] === "e" && tag[3] !== "mention")
						.length > 0;
				const isQuote = event.tags.filter((tag) => tag[0] === "q").length > 0;

				if (isConversation) {
					return <Conversation key={event.id} event={event} className="mb-3" />;
				}

				if (isQuote) {
					return <Quote key={event.id} event={event} className="mb-3" />;
				}

				return <TextNote key={event.id} event={event} className="mb-3" />;
			}
		}
	};

	return (
		<Container withDrag>
			<Box className="px-0 scrollbar-none bg-black/5 dark:bg-white/5 backdrop-blur-sm">
				<WindowVirtualizer>
					<User.Provider pubkey={pubkey}>
						<User.Root>
							<User.Cover className="h-44 w-full object-cover" />
							<div className="relative -mt-8 flex flex-col px-3">
								<User.Avatar className="size-14 rounded-full" />
								<div className="mb-4 inline-flex items-center justify-between">
									<div className="flex items-center gap-1">
										<User.Name className="text-lg font-semibold leading-tight" />
										<User.NIP05 />
									</div>
									<User.Button className="h-9 w-24 rounded-full inline-flex items-center justify-center bg-black text-sm font-medium text-white hover:bg-neutral-900 dark:bg-neutral-900" />
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
			</Box>
		</Container>
	);
}
