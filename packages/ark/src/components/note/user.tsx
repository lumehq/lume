import { cn } from "@lume/utils";
import { User } from "../user";
import { useNoteContext } from "./provider";

export function NoteUser({
	className,
}: {
	className?: string;
}) {
	const event = useNoteContext();

	return (
		<User.Provider pubkey={event.pubkey}>
			<User.Root className={cn("flex items-center gap-3", className)}>
				<User.Avatar className="size-9 shrink-0 rounded-lg object-cover ring-1 ring-neutral-200/50 dark:ring-neutral-800/50" />
				<div className="flex h-6 flex-1 items-start justify-between gap-2">
					<User.Name className="font-semibold text-neutral-950 dark:text-neutral-50" />
					<User.Time
						time={event.created_at}
						className="text-neutral-500 dark:text-neutral-400"
					/>
				</div>
			</User.Root>
		</User.Provider>
	);
}
