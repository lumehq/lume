import { ThreadNote } from "@lume/ark";
import { ReplyList } from "@lume/ui";
import { WindowVirtualizer } from "virtua";

export function HomeRoute({ id }: { id: string }) {
	return (
		<div className="pb-5 overflow-y-auto">
			<WindowVirtualizer>
				<div className="px-3">
					<ThreadNote eventId={id} />
					<ReplyList eventId={id} title="All replies" className="mt-5" />
				</div>
			</WindowVirtualizer>
		</div>
	);
}
