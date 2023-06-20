import { Kind1 } from "@shared/notes/contents/kind1";
import { Kind1063 } from "@shared/notes/contents/kind1063";
import { NoteMetadata } from "@shared/notes/metadata";
import { NoteSkeleton } from "@shared/notes/skeleton";
import { User } from "@shared/user";
import { useEvent } from "@utils/hooks/useEvent";
import { parser } from "@utils/parser";
import { getRepostID } from "@utils/transform";
import { LumeEvent } from "@utils/types";

export function Repost({
	event,
	currentBlock,
}: { event: LumeEvent; currentBlock?: number }) {
	const repostID = getRepostID(event.tags);
	const data = useEvent(repostID);

	const kind1 = data?.kind === 1 ? parser(data) : null;
	const kind1063 = data?.kind === 1063 ? data.tags : null;

	return (
		<div className="relative overflow-hidden flex flex-col mt-12 pb-6">
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
									<p>{data.content || data.toString()}</p>
								</div>
							</div>
						)}
						<NoteMetadata
							id={data.event_id || data.id}
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
}
