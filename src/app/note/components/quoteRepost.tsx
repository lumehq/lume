import { RootNote } from "@app/note/components/rootNote";
import { NoteRepostUser } from "@app/note/components/user/repost";
import { NoteWrapper } from "@app/note/components/wrapper";
import { getQuoteID } from "@utils/transform";

export function NoteQuoteRepost({ event }: { event: any }) {
	const rootID = getQuoteID(event.tags);

	return (
		<NoteWrapper
			href={`/app/note?id=${rootID}`}
			className="h-min w-full px-3 py-1.5"
		>
			<div className="rounded-md bg-zinc-900">
				<div className="relative px-5 pb-5 pt-5">
					<div className="absolute left-[35px] top-[20px] h-[70px] w-0.5 bg-gradient-to-t from-zinc-800 to-zinc-600" />
					<NoteRepostUser pubkey={event.pubkey} time={event.created_at} />
				</div>
				<RootNote id={rootID} fallback={event.content} />
			</div>
		</NoteWrapper>
	);
}
