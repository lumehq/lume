import { cn } from "@/commons";
import { User } from "../user";
import { useNoteContext } from "./provider";

export function NoteUser({ className }: { className?: string }) {
	const event = useNoteContext();

	return (
		<User.Provider pubkey={event.pubkey}>
			<User.Root className={cn("flex items-start justify-between", className)}>
				<div className="flex w-full gap-2">
					<button type="button" className="shrink-0">
						<User.Avatar className="rounded-full size-8" />
					</button>
					<div className="flex items-center w-full gap-3">
						<User.Name className="font-semibold text-neutral-950 dark:text-neutral-50" />
						<div className="text-neutral-600 dark:text-neutral-400">·</div>
						<User.Time
							time={event.created_at}
							className="text-neutral-600 dark:text-neutral-400"
						/>
					</div>
				</div>
			</User.Root>
		</User.Provider>
	);
}
