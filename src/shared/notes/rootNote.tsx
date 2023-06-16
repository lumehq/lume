import { NDKEvent } from "@nostr-dev-kit/ndk";
import { Kind1 } from "@shared/notes/kind1";
import { Kind1063 } from "@shared/notes/kind1063";
import { NoteMetadata } from "@shared/notes/metadata";
import { NoteSkeleton } from "@shared/notes/skeleton";
import { RelayContext } from "@shared/relayProvider";
import { User } from "@shared/user";
import { parser } from "@utils/parser";
import { memo, useContext } from "react";
import useSWRSubscription from "swr/subscription";

function isJSON(str: string) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

export const RootNote = memo(function RootNote({
	id,
	fallback,
	currentBlock,
}: { id: string; fallback?: any; currentBlock?: number }) {
	const ndk = useContext(RelayContext);
	const parseFallback = isJSON(fallback) ? JSON.parse(fallback) : null;

	const { data, error } = useSWRSubscription(
		parseFallback ? null : id,
		(key, { next }) => {
			const sub = ndk.subscribe({
				ids: [key],
			});

			sub.addListener("event", (event: NDKEvent) => {
				next(null, event);
			});

			return () => {
				sub.stop();
			};
		},
	);

	const kind1 = !error && data?.kind === 1 ? parser(data) : null;
	const kind1063 = !error && data?.kind === 1063 ? data.tags : null;

	if (parseFallback) {
		const contentFallback = parser(parseFallback);

		return (
			<div className="flex flex-col px-5">
				<User pubkey={parseFallback.pubkey} time={parseFallback.created_at} />
				<div className="-mt-5 pl-[49px]">
					<Kind1 content={contentFallback} />
					<NoteMetadata
						id={parseFallback.id}
						eventPubkey={parseFallback.pubkey}
						currentBlock={currentBlock}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col px-5">
			{data ? (
				<>
					<User pubkey={data.pubkey} time={data.created_at} />
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
						<NoteMetadata
							id={data.id}
							eventPubkey={data.pubkey}
							currentBlock={currentBlock}
						/>
					</div>
				</>
			) : (
				<NoteSkeleton />
			)}
		</div>
	);
});
