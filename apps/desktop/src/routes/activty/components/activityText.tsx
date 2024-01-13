import { User } from "@lume/ark";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { Link } from "react-router-dom";

export function ActivityText({ event }: { event: NDKEvent }) {
	return (
		<Link
			to={`/activity/${event.id}`}
			className="block px-5 py-4 border-b border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10"
		>
			<User.Provider pubkey={event.pubkey}>
				<User.Root className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<User.Avatar className="size-8 rounded-lg shrink-0" />
						<div className="inline-flex items-center gap-1.5">
							<User.Name className="max-w-[8rem] font-semibold text-neutral-950 dark:text-neutral-50" />
							<p className="shrink-0">mention you</p>
						</div>
					</div>
					<User.Time
						time={event.created_at}
						className="text-neutral-500 dark:text-neutral-400"
					/>
				</User.Root>
			</User.Provider>
		</Link>
	);
}
