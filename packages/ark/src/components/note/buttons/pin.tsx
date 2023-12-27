import { PinIcon } from "@lume/icons";
import { WIDGET_KIND } from "@lume/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useNoteContext } from "..";
import { useWidget } from "../../../hooks/useWidget";

export function NotePin() {
	const event = useNoteContext();
	const { addWidget } = useWidget();

	return (
		<Tooltip.Provider>
			<Tooltip.Root delayDuration={150}>
				<Tooltip.Trigger asChild>
					<button
						type="button"
						onClick={() =>
							addWidget.mutate({
								kind: WIDGET_KIND.thread,
								title: "Thread",
								content: event.id,
							})
						}
						className="inline-flex h-7 w-max items-center justify-center gap-2 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800 px-2 text-sm font-medium dark:bg-neutral-900"
					>
						<PinIcon className="size-4" />
						Pin
					</button>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content className="bg-neutral-950 text-white -left-10 inline-flex h-7 select-none items-center justify-center rounded-md px-3.5 text-sm will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
						Pin note
						<Tooltip.Arrow className="fill-neutral-950" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}
