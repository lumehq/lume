import { cn } from "@lume/utils";
import * as HoverCard from "@radix-ui/react-hover-card";
import { User } from "../user";
import { useNoteContext } from "./provider";
import { LumeWindow } from "@lume/system";

export function NoteUser({ className }: { className?: string }) {
	const event = useNoteContext();

	return (
		<User.Provider pubkey={event.pubkey}>
			<HoverCard.Root>
				<User.Root
					className={cn("flex items-start justify-between", className)}
				>
					<div className="flex w-full gap-2">
						<HoverCard.Trigger className="shrink-0">
							<User.Avatar className="object-cover rounded-full size-8 outline outline-1 -outline-offset-1 outline-black/15" />
						</HoverCard.Trigger>
						<div className="flex items-center w-full gap-3">
							<div className="flex items-center gap-1">
								<User.Name className="font-semibold text-neutral-950 dark:text-neutral-50" />
								<User.NIP05 />
							</div>
							<div className="text-neutral-600 dark:text-neutral-400">·</div>
							<User.Time
								time={event.created_at}
								className="text-neutral-600 dark:text-neutral-400"
							/>
						</div>
					</div>
				</User.Root>
				<HoverCard.Portal>
					<HoverCard.Content
						className="w-[300px] rounded-xl bg-black p-3 data-[side=bottom]:animate-slideUpAndFade data-[state=open]:transition-all dark:bg-white dark:shadow-none"
						sideOffset={5}
						side="right"
					>
						<div className="flex flex-col gap-2">
							<User.Avatar className="object-cover rounded-lg size-11" />
							<div className="flex flex-col gap-2">
								<div className="inline-flex items-center gap-1">
									<User.Name className="font-semibold leading-tight text-white dark:text-neutral-900" />
									<User.NIP05 />
								</div>
								<User.About className="text-sm text-white line-clamp-3 dark:text-neutral-900" />
								<button
									type="button"
									onClick={() => LumeWindow.openProfile(event.pubkey)}
									className="inline-flex items-center justify-center w-full mt-2 text-sm font-medium bg-white rounded-lg h-9 hover:bg-neutral-200 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
								>
									View profile
								</button>
							</div>
						</div>
						<HoverCard.Arrow className="fill-black dark:fill-white" />
					</HoverCard.Content>
				</HoverCard.Portal>
			</HoverCard.Root>
		</User.Provider>
	);
}
