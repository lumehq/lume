import { ReplyIcon } from "@lume/icons";
import * as Tooltip from "@radix-ui/react-tooltip";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useNoteContext } from "../provider";

export function NoteReply({
	rootEventId,
}: {
	rootEventId?: string;
}) {
	const event = useNoteContext();
	const navigate = useNavigate();

	return (
		<Tooltip.Provider>
			<Tooltip.Root delayDuration={150}>
				<Tooltip.Trigger asChild>
					<button
						type="button"
						onClick={() =>
							navigate({
								pathname: "/new/",
								search: createSearchParams({
									replyTo: event.id,
									rootReplyTo: rootEventId,
								}).toString(),
							})
						}
						className="group inline-flex h-7 w-7 items-center justify-center text-neutral-600 dark:text-neutral-400"
					>
						<ReplyIcon className="h-5 w-5 group-hover:text-blue-500" />
					</button>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content className="inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-950 px-3.5 text-sm text-white will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
						Quick reply
						<Tooltip.Arrow className="fill-neutral-950" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}
