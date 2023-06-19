import { getReplies } from "@libs/storage";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { EmptyIcon } from "@shared/icons";
import { Reply } from "@shared/notes/replies/item";
import useSWR from "swr";

const fetcher = ([, id]) => getReplies(id);

export function RepliesList({ parent_id }: { parent_id: string }) {
	const { data }: any = useSWR(["note-replies", parent_id], fetcher);

	return (
		<div className="mt-5">
			<div className="mb-2">
				<h5 className="text-lg font-semibold text-zinc-300">Replies</h5>
			</div>
			<div className="flex flex-col">
				{!data ? (
					<div className="flex gap-2 px-3 py-4">
						<div className="relative h-9 w-9 shrink animate-pulse rounded-md bg-zinc-800" />
						<div className="flex w-full flex-1 flex-col justify-center gap-1">
							<div className="flex items-baseline gap-2 text-base">
								<div className="h-2.5 w-20 animate-pulse rounded-sm bg-zinc-800" />
							</div>
							<div className="h-4 w-44 animate-pulse rounded-sm bg-zinc-800" />
						</div>
					</div>
				) : data.length === 0 ? (
					<div className="px=3">
						<div className="w-full flex items-center justify-center rounded-md bg-zinc-900">
							<div className="py-6 flex flex-col items-center justify-center gap-2">
								<EmptyIcon width={56} height={56} />
								<p className="text-zinc-500 text-sm font-medium">No replies</p>
							</div>
						</div>
					</div>
				) : (
					data.map((event: NDKEvent) => <Reply key={event.id} data={event} />)
				)}
			</div>
		</div>
	);
}
