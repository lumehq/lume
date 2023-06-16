import { Kind1 } from "@app/space/components/notes/kind1";
import { Kind1063 } from "@app/space/components/notes/kind1063";
import { NoteMetadata } from "@app/space/components/notes/metadata";
import { NoteSkeleton } from "@app/space/components/notes/skeleton";
import { NoteDefaultUser } from "@app/space/components/user/default";
import { useEvent } from "@utils/hooks/useEvent";
import { parser } from "@utils/parser";
import { memo } from "react";

export const NoteParent = memo(function NoteParent({ id }: { id: string }) {
	const data = useEvent(id);

	const kind1 = data?.kind === 1 ? parser(data) : null;
	const kind1063 = data?.kind === 1063 ? data.tags : null;

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
						<NoteMetadata
							id={data.event_id || data.id}
							eventPubkey={data.pubkey}
						/>
					</div>
				</>
			) : (
				<NoteSkeleton />
			)}
		</div>
	);
});
