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
						className="group inline-flex h-7 w-7 items-center justify-center text-neutral-600 dark:text-neutral-400"
					>
						<RepostIcon
							className={twMerge(
								"h-5 w-5 group-hover:text-blue-600",
								isRepost ? "text-blue-500" : "",
							)}
						/>
					</button>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content className="inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-950 px-3.5 text-sm text-white will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
						Repost
						<Tooltip.Arrow className="fill-neutral-950" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}
