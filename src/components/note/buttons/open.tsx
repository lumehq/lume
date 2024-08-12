import { VisitIcon } from "@/components";
import { LumeWindow } from "@/system";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useNoteContext } from "../provider";

export function NoteOpenThread() {
	const event = useNoteContext();

	return (
		<Tooltip.Provider>
			<Tooltip.Root delayDuration={150}>
				<Tooltip.Trigger asChild>
					<button
						type="button"
						onClick={() => LumeWindow.openEvent(event)}
						className="group inline-flex h-7 w-14 bg-neutral-100 dark:bg-white/10 rounded-full items-center justify-center text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:text-blue-500 hover:bg-neutral-200 dark:hover:bg-white/20"
					>
						<VisitIcon className="shrink-0 size-4" />
					</button>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content className="inline-flex h-7 select-none text-neutral-50 dark:text-neutral-950 items-center justify-center rounded-md bg-neutral-950 dark:bg-neutral-50 px-3.5 text-sm will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
						Open
						<Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}
