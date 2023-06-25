import { Kind1 } from "@shared/notes/contents/kind1";
import { Kind1063 } from "@shared/notes/contents/kind1063";
import { NoteMetadata } from "@shared/notes/metadata";
import { NoteSkeleton } from "@shared/notes/skeleton";
import { User } from "@shared/user";
import { useEvent } from "@utils/hooks/useEvent";

export function NoteParent({
	id,
	currentBlock,
}: { id: string; currentBlock: number }) {
	const { status, data, isFetching } = useEvent(id);

	return (
		<div className="relative overflow-hidden flex flex-col pb-6">
			<div className="absolute left-[18px] top-0 h-full w-0.5 bg-gradient-to-t from-zinc-800 to-zinc-600" />
			{isFetching || status === "loading" ? (
				<NoteSkeleton />
			) : (
				<>
					<User pubkey={data.pubkey} time={data.created_at} />
					<div className="z-10 relative -mt-6 pl-[49px]">
						{data.kind === 1 && <Kind1 content={data.content} />}
						{data.kind === 1063 && <Kind1063 metadata={data.tags} />}
						{data.kind !== 1 && data.kind !== 1063 && (
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
			)}
		</div>
	);
}
