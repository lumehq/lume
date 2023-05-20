import { Kind1 } from "@app/note/components/kind1";
import NoteMetadata from "@app/note/components/metadata";
import RepliesList from "@app/note/components/replies/list";
import { NoteDefaultUser } from "@app/note/components/user/default";

import { RelayContext } from "@shared/relayProvider";

import { READONLY_RELAYS } from "@stores/constants";

import { usePageContext } from "@utils/hooks/usePageContext";
import { noteParser } from "@utils/parser";

import { useContext } from "react";
import useSWRSubscription from "swr/subscription";

export function Page() {
	const pool: any = useContext(RelayContext);
	const pageContext = usePageContext();
	const searchParams: any = pageContext.urlParsed.search;

	const noteID = searchParams.id;

	const { data, error } = useSWRSubscription(
		noteID ? ["note", noteID] : null,
		([, key], { next }) => {
			// subscribe to note
			const unsubscribe = pool.subscribe(
				[
					{
						ids: [key],
					},
				],
				READONLY_RELAYS,
				(event: any) => {
					next(null, event);
				},
			);

			return () => {
				unsubscribe();
			};
		},
	);

	const content = !error && data ? noteParser(data) : null;

	return (
		<div className="scrollbar-hide h-full w-full overflow-y-auto">
			<div className="p-3">
				<div className="relative w-full rounded-lg border border-zinc-800 bg-zinc-900 shadow-input shadow-black/20">
					{!data || error ? (
						<div className="animated-pulse p-3">
							<div className="flex items-start gap-2">
								<div className="relative h-11 w-11 shrink overflow-hidden rounded-md bg-zinc-700" />
								<div className="flex w-full flex-1 items-start justify-between">
									<div className="flex w-full items-center justify-between">
										<div className="flex items-center gap-2 text-base">
											<div className="h-4 w-16 rounded bg-zinc-700" />
										</div>
									</div>
								</div>
							</div>
							<div className="mt-3">
								<div className="flex flex-col gap-6">
									<div className="h-16 w-full rounded bg-zinc-700" />
									<div className="flex items-center gap-8">
										<div className="h-4 w-12 rounded bg-zinc-700" />
										<div className="h-4 w-12 rounded bg-zinc-700" />
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className="relative z-10 flex flex-col">
							<div className="px-3 pt-3">
								<NoteDefaultUser pubkey={data.pubkey} time={data.created_at} />
								<div className="mt-3">
									<Kind1 content={content} />
									<NoteMetadata id={noteID} eventPubkey={data.pubkey} />
								</div>
							</div>
						</div>
					)}
				</div>
				<RepliesList id={noteID} />
			</div>
		</div>
	);
}
