import { getNotesByPubkey } from "@libs/storage";
import { Note } from "@shared/notes/note";
import { useQuery } from "@tanstack/react-query";
import { LumeEvent } from "@utils/types";

export function UserFeed({ pubkey }: { pubkey: string }) {
	const { status, data } = useQuery(["user-feed", pubkey], async () => {
		return await getNotesByPubkey(pubkey);
	});

	return (
		<div className="w-full max-w-[400px] px-2">
			{status === "loading" ? (
				<p>Loading...</p>
			) : (
				data.map((note: LumeEvent) => <Note key={note.event_id} event={note} />)
			)}
		</div>
	);
}
