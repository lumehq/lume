import { Kind1 } from "@shared/notes/kind1";
import { Kind1063 } from "@shared/notes/kind1063";
import { NoteMetadata } from "@shared/notes/metadata";
import { NoteParent } from "@shared/notes/parent";
import { User } from "@shared/user";
import { parser } from "@utils/parser";
import { isTagsIncludeID } from "@utils/transform";
import { LumeEvent } from "@utils/types";
import { useMemo } from "react";

export function NoteBase({
	event,
	block,
	metadata,
}: { event: LumeEvent; block?: number; metadata?: boolean }) {
	const content = useMemo(() => parser(event), [event]);
	const checkParentID = isTagsIncludeID(event.parent_id, event.tags);

	return (
		<div className="h-min w-full px-3 py-1.5">
			<div className="rounded-md bg-zinc-900 px-5 pt-5">
				{event.parent_id &&
				(event.parent_id !== event.event_id || checkParentID) ? (
					<NoteParent id={event.parent_id} />
				) : (
					<></>
				)}
				<div className="flex flex-col">
					<User pubkey={event.pubkey} time={event.created_at} />
					<div className="-mt-5 pl-[49px]">
						{event.kind === 1 && <Kind1 content={content} />}
						{event.kind === 1063 && <Kind1063 metadata={event.tags} />}
						{metadata ? (
							<NoteMetadata
								id={event.event_id}
								eventPubkey={event.pubkey}
								currentBlock={block || 1}
							/>
						) : (
							<div className="h-5" />
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
