import { cn } from "@lume/utils";
import * as HoverCard from "@radix-ui/react-hover-card";
import { Link } from "react-router-dom";
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
			<HoverCard.Root>
				<User.Root className={cn("flex items-center gap-3", className)}>
					<HoverCard.Trigger>
						<User.Avatar className="size-9 shrink-0 rounded-lg object-cover ring-1 ring-neutral-200/50 dark:ring-neutral-800/50" />
					</HoverCard.Trigger>
					<div className="flex h-6 flex-1 items-start justify-between gap-2">
						<User.Name className="font-semibold text-neutral-950 dark:text-neutral-50" />
						<User.Time
							time={event.created_at}
							className="text-neutral-500 dark:text-neutral-400"
						/>
					</div>
				</User.Root>
				<HoverCard.Portal>
					<HoverCard.Content
						className="data-[side=bottom]:animate-slideUpAndFade w-[300px] shadow-lg shadow-neutral-500/20 rounded-xl bg-white dark:shadow-none dark:bg-neutral-900 dark:border dark:border-neutral-800 p-5 data-[state=open]:transition-all"
						sideOffset={5}
					>
						<div className="flex flex-col gap-2">
							<User.Avatar className="size-11 rounded-lg object-cover ring-1 ring-neutral-200/50 dark:ring-neutral-800/50" />
							<div className="flex flex-col gap-2">
								<div>
									<User.Name className="font-semibold leading-tight" />
									<User.NIP05 className="text-neutral-600 dark:text-neutral-400" />
								</div>
								<User.About className="line-clamp-3" />
								<Link
									to={`/users/${event.pubkey}`}
									className="mt-3 w-full h-8 text-sm font-medium bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg inline-flex items-center justify-center"
								>
									View profile
								</Link>
							</div>
						</div>
						<HoverCard.Arrow className="fill-white dark:fill-neutral-800" />
					</HoverCard.Content>
				</HoverCard.Portal>
			</HoverCard.Root>
		</User.Provider>
	);
}
