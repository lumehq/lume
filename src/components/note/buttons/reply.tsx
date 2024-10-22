import { cn } from "@/commons";
import { ReplyIcon } from "@/components";
import { LumeWindow } from "@/system";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useNoteContext } from "../provider";

export function NoteReply({
	label = false,
	smol = false,
}: { label?: boolean; smol?: boolean }) {
	const event = useNoteContext();

	return (
		<Tooltip.Provider>
			<Tooltip.Root delayDuration={150}>
				<Tooltip.Trigger asChild>
					<button
						type="button"
						onClick={() => LumeWindow.openEditor(event.id)}
						className={cn(
							"h-7 rounded-full inline-flex items-center justify-center text-neutral-800 hover:bg-black/5 dark:hover:bg-white/5 dark:text-neutral-200 text-sm font-medium",
							label ? "w-24 gap-1.5" : "w-14",
						)}
					>
						<ReplyIcon className={cn("shrink-0", smol ? "size-4" : "size-5")} />
						{label ? "Reply" : null}
					</button>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content className="inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-950 px-3.5 text-sm text-neutral-50 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade dark:bg-neutral-50 dark:text-neutral-950">
						Reply
						<Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}
