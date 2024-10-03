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
							"inline-flex items-center justify-center text-neutral-800 dark:text-neutral-200",
							label
								? "rounded-full h-7 gap-1.5 w-20 text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10"
								: "size-7",
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
