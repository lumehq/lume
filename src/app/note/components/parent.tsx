import { Kind1 } from "@app/note/components/kind1";
import { Kind1063 } from "@app/note/components/kind1063";
import { NoteMetadata } from "@app/note/components/metadata";
import { NoteSkeleton } from "@app/note/components/skeleton";
import { NoteDefaultUser } from "@app/note/components/user/default";
import { RelayContext } from "@shared/relayProvider";
import { READONLY_RELAYS } from "@stores/constants";
import { noteParser } from "@utils/parser";
import { memo, useContext } from "react";
import useSWRSubscription from "swr/subscription";

export const NoteParent = memo(function NoteParent({ id }: { id: string }) {
	const pool: any = useContext(RelayContext);

	const { data, error } = useSWRSubscription(
		id ? id : null,
		(key, { next }) => {
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
				undefined,
				undefined,
				{
					unsubscribeOnEose: true,
				},
			);

			return () => {
				unsubscribe();
			};
		},
	);

	const kind1 = !error && data?.kind === 1 ? noteParser(data) : null;
	const kind1063 = !error && data?.kind === 1063 ? data.tags : null;

	return (
		<div className="relative overflow-hidden flex flex-col pb-6">
			<div className="absolute left-[18px] top-0 h-full w-0.5 bg-gradient-to-t from-zinc-800 to-zinc-600" />
			{data ? (
				<>
					<NoteDefaultUser pubkey={data.pubkey} time={data.created_at} />
					<div className="-mt-5 pl-[49px]">
						{kind1 && <Kind1 content={kind1} />}
						{kind1063 && <Kind1063 metadata={kind1063} />}
						{!kind1 && !kind1063 && (
							<div className="flex flex-col gap-2">
								<div className="px-2 py-2 inline-flex flex-col gap-1 bg-zinc-800 rounded-md">
									<span className="text-zinc-500 text-sm font-medium leading-none">
										Kind: {data.kind}
									</span>
									<p className="text-fuchsia-500 text-sm leading-none">
										Lume isn't fully support this kind in newsfeed
									</p>
								</div>
								<div className="markdown">
									<p>{data.content}</p>
								</div>
							</div>
						)}
						<NoteMetadata id={data.id} eventPubkey={data.pubkey} />
					</div>
				</>
			) : (
				<NoteSkeleton />
			)}
		</div>
	);
});
