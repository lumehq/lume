import { Kind1 } from "@app/note/components/kind1";
import { Kind1063 } from "@app/note/components/kind1063";
import { NoteMetadata } from "@app/note/components/metadata";
import { NoteParent } from "@app/note/components/parent";
import { NoteDefaultUser } from "@app/note/components/user/default";
import { NoteWrapper } from "@app/note/components/wrapper";

import { noteParser } from "@utils/parser";
import { isTagsIncludeID } from "@utils/transform";

import { useMemo } from "react";

export function NoteBase({ event }: { event: any }) {
	const content = useMemo(() => noteParser(event), [event]);
	const checkParentID = isTagsIncludeID(event.parent_id, event.tags);

	const href = event.parent_id
		? `/app/note?id=${event.parent_id}`
		: `/app/note?id=${event.event_id}`;

	return (
		<NoteWrapper href={href} className="h-min w-full px-3 py-1.5">
			<div className="rounded-md bg-zinc-900 px-5 pt-5">
				{event.parent_id &&
				(event.parent_id !== event.event_id || checkParentID) ? (
					<NoteParent id={event.parent_id} />
				) : (
					<></>
				)}
				<div className="flex flex-col">
					<NoteDefaultUser pubkey={event.pubkey} time={event.created_at} />
					<div className="-mt-5 pl-[49px]">
						{event.kind === 1 && <Kind1 content={content} />}
						{event.kind === 1063 && <Kind1063 metadata={event.tags} />}
						<NoteMetadata id={event.event_id} eventPubkey={event.pubkey} />
					</div>
				</div>
			</div>
		</NoteWrapper>
	);
}
