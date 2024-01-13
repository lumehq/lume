import { memo } from "react";
import { Link } from "react-router-dom";
import { Note } from "../";
import { useEvent } from "../../../hooks/useEvent";
import { User } from "../../user";

export const MentionNote = memo(function MentionNote({
	eventId,
	openable = true,
}: { eventId: string; openable?: boolean }) {
	const { isLoading, isError, data } = useEvent(eventId);

	if (isLoading) {
		return (
			<div
				contentEditable={false}
				className="w-full p-3 my-1 rounded-lg cursor-default bg-neutral-100 dark:bg-neutral-900"
			>
				Loading
			</div>
		);
	}

	if (isError) {
		return (
			<div
				contentEditable={false}
				className="w-full p-3 my-1 rounded-lg cursor-default bg-neutral-100 dark:bg-neutral-900"
			>
				Failed to fetch event
			</div>
		);
	}

	return (
		<Note.Provider event={data}>
			<Note.Root className="flex flex-col w-full gap-1 my-1 rounded-lg cursor-default bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
				<User.Provider pubkey={data.pubkey}>
					<User.Root className="px-3 mt-3 flex h-6 items-center gap-2">
						<User.Avatar className="size-6 shrink-0 rounded-md object-cover" />
						<div className="flex flex-1 items-baseline gap-2">
							<User.Name className="font-semibold text-neutral-900 dark:text-neutral-100" />
							<span className="text-neutral-600 dark:text-neutral-400">·</span>
							<User.Time
								time={data.created_at}
								className="text-neutral-600 dark:text-neutral-400"
							/>
						</div>
					</User.Root>
				</User.Provider>
				<div className="px-3 pb-3 mt-1">
					<Note.Content />
					{openable ? (
						<Link
							to={`/events/${data.id}`}
							className="mt-2 text-blue-500 hover:text-blue-600"
						>
							Show more
						</Link>
					) : null}
				</div>
			</Note.Root>
		</Note.Provider>
	);
});
