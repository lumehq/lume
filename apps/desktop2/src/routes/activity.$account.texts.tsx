import { Spinner } from "@lume/ui";
import { Note } from "@/components/note";
import { Await, createFileRoute, defer } from "@tanstack/react-router";
import { Suspense } from "react";
import { Virtualizer } from "virtua";

export const Route = createFileRoute("/activity/$account/texts")({
	loader: async ({ context, params }) => {
		const ark = context.ark;
		return { data: defer(ark.get_activities(params.account, "1")) };
	},
	component: Screen,
});

function Screen() {
	const { data } = Route.useLoaderData();

	return (
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
					{(events) =>
						events.map((event) => (
							<div
								key={event.id}
								className="flex flex-col gap-2 mb-3 bg-white dark:bg-black/20 backdrop-blur-lg rounded-xl shadow-primary dark:ring-1 ring-neutral-800/50"
							>
								<Note.Provider event={event}>
									<Note.Root>
										<div className="px-3 h-14 flex items-center justify-between">
											<Note.User />
											<Note.Menu />
										</div>
										<Note.Activity className="px-3" />
										<Note.Content className="px-3" quote={false} clean />
										<div className="mt-3 flex items-center gap-4 h-14 px-3">
											<Note.Open />
										</div>
									</Note.Root>
								</Note.Provider>
							</div>
						))
					}
				</Await>
			</Suspense>
		</Virtualizer>
	);
}
