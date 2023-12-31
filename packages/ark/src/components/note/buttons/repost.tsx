import { RepostIcon } from "@lume/icons";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useState } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { useNoteContext } from "../provider";

export function NoteRepost() {
	const event = useNoteContext();
	const [isRepost, setIsRepost] = useState(false);

	const submit = async () => {
		try {
			// repost
			await event.repost(true);

			// update state
			setIsRepost(true);
			toast.success("You've reposted this post successfully");
		} catch (e) {
			toast.error("Repost failed, try again later");
		}
	};

	return (
		<Tooltip.Provider>
			<Tooltip.Root delayDuration={150}>
				<Tooltip.Trigger asChild>
					<button
						type="button"
						onClick={submit}
						className="inline-flex items-center justify-center group h-7 w-7 text-neutral-600 dark:text-neutral-400"
					>
						<RepostIcon
							className={twMerge(
								"size-6 group-hover:text-blue-600",
								isRepost ? "text-blue-500" : "",
							)}
						/>
					</button>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content className="inline-flex h-7 select-none text-neutral-50 dark:text-neutral-950 items-center justify-center rounded-md bg-neutral-950 dark:bg-neutral-50 px-3.5 text-sm will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
						Repost
						<Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}
