import { PinIcon } from "@lume/icons";
import { COL_TYPES } from "@lume/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useTranslation } from "react-i18next";
import { useColumnContext } from "../../column/provider";
import { useNoteContext } from "../provider";

export function NotePin() {
	const event = useNoteContext();

	const { t } = useTranslation();
	const { addColumn } = useColumnContext();

	return (
		<Tooltip.Provider>
			<Tooltip.Root delayDuration={150}>
				<Tooltip.Trigger asChild>
					<button
						type="button"
						onClick={async () =>
							await addColumn({
								kind: COL_TYPES.thread,
								title: "Thread",
								content: event.id,
							})
						}
						className="inline-flex items-center justify-center gap-2 pl-2 pr-3 text-sm font-medium rounded-full h-7 w-max bg-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:bg-neutral-900"
					>
						<PinIcon className="size-4" />
						{t("note.buttons.pin")}
					</button>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content className="inline-flex h-7 select-none text-neutral-50 dark:text-neutral-950 items-center justify-center rounded-md bg-neutral-950 dark:bg-neutral-50 px-3.5 text-sm will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
						{t("note.buttons.pinTooltip")}
						<Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}
