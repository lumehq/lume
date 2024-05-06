import { Note, Spinner, User } from "@lume/ui";
import { decodeZapInvoice } from "@lume/utils";
import { Await, createFileRoute, defer } from "@tanstack/react-router";
import { Suspense } from "react";
import { Virtualizer } from "virtua";

export const Route = createFileRoute("/activity/$account/zaps")({
	loader: async ({ context, params }) => {
		const ark = context.ark;
		return { data: defer(ark.get_activities(params.account, "9735")) };
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
								<User.Provider pubkey={event.pubkey}>
									<User.Root className="flex flex-col">
										<div className="text-lg h-20 font-medium leading-tight flex w-full items-center justify-center">
											₿ {decodeZapInvoice(event.tags).bitcoinFormatted}
										</div>
										<div className="h-11 border-t border-neutral-100 dark:border-neutral-900 flex items-center gap-1 px-2">
											<div className="inline-flex items-center gap-2">
												<User.Avatar className="size-7 rounded-full shrink-0" />
												<User.Name className="text-sm font-medium" />
											</div>
											<div className="text-sm text-neutral-700 dark:text-neutral-300">
												zapped you
											</div>
										</div>
									</User.Root>
								</User.Provider>
							</div>
						))
					}
				</Await>
			</Suspense>
		</Virtualizer>
	);
}
