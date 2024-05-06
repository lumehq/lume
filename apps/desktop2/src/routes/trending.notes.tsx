import { TextNote } from "@/components/text";
import { type Event } from "@lume/types";
import { Spinner } from "@lume/ui";
import { Await, createFileRoute } from "@tanstack/react-router";
import { defer } from "@tanstack/react-router";
import { Suspense } from "react";
import { Virtualizer } from "virtua";

export const Route = createFileRoute("/trending/notes")({
	loader: async ({ abortController }) => {
		try {
			return {
				data: defer(
					fetch("https://api.nostr.band/v0/trending/notes", {
						signal: abortController.signal,
					})
						.then((res) => res.json())
						.then((res) => res.notes.map((item) => item.event) as Event[]),
				),
			};
		} catch (e) {
			throw new Error(String(e));
		}
	},
	component: Screen,
});

export function Screen() {
	const { data } = Route.useLoaderData();

	return (
		<div className="w-full h-full">
			<Virtualizer overscan={3}>
				<Suspense
					fallback={
						<div className="flex h-20 w-full flex-col items-center justify-center gap-1">
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
						{(notes) =>
							notes.map((event) => (
								<TextNote key={event.id} event={event} className="mb-3" />
							))
						}
					</Await>
				</Suspense>
			</Virtualizer>
		</div>
	);
}
