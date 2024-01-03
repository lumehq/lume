import { Note, ThreadNote } from "@lume/ark";
import { ReplyList } from "@lume/ui";
import { WVList } from "virtua";

export function HomeRoute({ id }: { id: string }) {
	return (
		<WVList className="pb-5 overflow-y-auto">
			<div className="px-3">
				<ThreadNote eventId={id} />
				<ReplyList eventId={id} title="All replies" className="mt-5" />
			</div>
		</WVList>
	);
}
