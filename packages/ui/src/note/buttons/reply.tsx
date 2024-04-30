import { ReplyIcon } from "@lume/icons";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useNoteContext } from "../provider";
import { useRouteContext } from "@tanstack/react-router";

export function NoteReply() {
	const event = useNoteContext();
	const { ark } = useRouteContext({ strict: false });

	return (
		<Tooltip.Provider>
			<Tooltip.Root delayDuration={150}>
				<Tooltip.Trigger asChild>
					<button
						type="button"
						onClick={() => ark.open_editor(event.id)}
						className="group inline-flex size-7 items-center justify-center text-neutral-800 dark:text-neutral-200"
					>
						<ReplyIcon className="size-5 group-hover:text-blue-500" />
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
