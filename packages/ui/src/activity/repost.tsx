import { formatCreatedAt } from "@lume/utils";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { User } from "../user";
import { ActivityRootNote } from "./rootNote";

export function RepostActivity({ event }: { event: NDKEvent }) {
	const repostId = event.tags.find((el) => el[0] === "e")[1];
	const createdAt = formatCreatedAt(event.created_at);

	return (
		<div className="h-full pb-3 flex flex-col justify-between">
			<div className="h-14 border-b border-neutral-100 dark:border-neutral-900 flex flex-col items-center justify-center px-3">
				<h3 className="text-center font-semibold leading-tight">Boost</h3>
				<p className="text-sm text-blue-500 font-medium leading-tight">
					@ Someone has reposted to your note
				</p>
			</div>
			<div className="px-3">
				<div className="flex flex-col gap-3">
					<User pubkey={event.pubkey} variant="notify2" />
					<div className="flex items-center gap-3">
						<p className="text-teal-500 font-medium">Reposted</p>
						<div className="flex-1 h-px bg-teal-300" />
						<div className="w-4 shrink-0 h-px bg-teal-300" />
					</div>
				</div>
				<div className="mt-3 flex flex-col gap-3">
					<ActivityRootNote eventId={repostId} />
				</div>
			</div>
		</div>
	);
}
