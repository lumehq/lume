import { RootNote } from "@shared/notes/rootNote";
import { User } from "@shared/user";
import { getQuoteID } from "@utils/transform";
import { LumeEvent } from "@utils/types";

export function NoteQuoteRepost({
	block,
	event,
}: { block: number; event: LumeEvent }) {
	const rootID = getQuoteID(event.tags);

	return (
		<div className="h-min w-full px-3 py-1.5">
			<div className="rounded-md bg-zinc-900">
				<div className="relative px-5 pb-5 pt-5">
					<div className="absolute left-[35px] top-[20px] h-[70px] w-0.5 bg-gradient-to-t from-zinc-800 to-zinc-600" />
					<User pubkey={event.pubkey} time={event.created_at} repost={true} />
				</div>
				<RootNote id={rootID} fallback={event.content} currentBlock={block} />
			</div>
		</div>
	);
}
