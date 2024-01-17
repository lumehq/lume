import { PinIcon, RefreshIcon } from "@lume/icons";
import { COL_TYPES } from "@lume/utils";
import { memo } from "react";
import { Link } from "react-router-dom";
import { Note } from "../";
import { useEvent } from "../../../hooks/useEvent";
import { useColumnContext } from "../../column/provider";
import { User } from "../../user";

export const MentionNote = memo(function MentionNote({
	eventId,
	openable = true,
}: { eventId: string; openable?: boolean }) {
	const { addColumn } = useColumnContext();
	const { isLoading, isError, data } = useEvent(eventId);

	if (isLoading) {
		return (
			<div
				contentEditable={false}
				className="flex items-center justify-between w-full p-3 my-1 rounded-lg cursor-default bg-neutral-100 dark:bg-neutral-900"
			>
				<p>Loading...</p>
			</div>
		);
	}

	if (isError || !data) {
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
			<Note.Root className="flex flex-col w-full my-1 rounded-lg cursor-default bg-neutral-100 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-900">
				<User.Provider pubkey={data.pubkey}>
					<User.Root className="flex h-10 px-3 items-center gap-2">
						<User.Avatar className="size-6 shrink-0 rounded-md object-cover" />
						<div className="flex-1 inline-flex gap-2">
							<User.Name className="font-semibold text-neutral-900 dark:text-neutral-100" />
							<span className="text-neutral-600 dark:text-neutral-400">·</span>
							<User.Time
								time={data.created_at}
								className="text-neutral-600 dark:text-neutral-400"
							/>
						</div>
					</User.Root>
				</User.Provider>
				<Note.Content mini className="px-3" />
				{openable ? (
					<div className="px-3 h-10 flex items-center justify-between">
						<Link
							to={`/events/${data.id}`}
							className="text-sm font-medium text-blue-500 hover:text-blue-600"
						>
							Show more
						</Link>
						<button
							type="button"
							onClick={async () =>
								await addColumn({
									kind: COL_TYPES.thread,
									title: "Thread",
									content: data.id,
								})
							}
							className="inline-flex items-center justify-center rounded-md text-neutral-600 dark:text-neutral-400 size-6 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
						>
							<PinIcon className="size-4" />
						</button>
					</div>
				) : (
					<div className="h-10" />
				)}
			</Note.Root>
		</Note.Provider>
	);
});
