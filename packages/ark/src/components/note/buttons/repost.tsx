import { LoaderIcon, ReplyIcon, RepostIcon } from "@lume/icons";
import { cn, editorAtom, editorValueAtom } from "@lume/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useSetAtom } from "jotai";
import { nip19 } from "nostr-tools";
import { useState } from "react";
import { toast } from "sonner";
import { useNoteContext } from "../provider";

export function NoteRepost() {
	const event = useNoteContext();
	const setEditorValue = useSetAtom(editorValueAtom);
	const setIsEditorOpen = useSetAtom(editorAtom);

	const [loading, setLoading] = useState(false);
	const [isRepost, setIsRepost] = useState(false);
	const [open, setOpen] = useState(false);

	const repost = async () => {
		try {
			setLoading(true);

			// repost
			await event.repost(true);

			// update state
			setLoading(false);
			setIsRepost(true);

			// notify
			toast.success("You've reposted this post successfully");
		} catch (e) {
			setLoading(false);
			toast.error("Repost failed, try again later");
		}
	};

	const quote = () => {
		setEditorValue([
			{
				type: "paragraph",
				children: [{ text: "" }],
			},
			{
				type: "event",
				// @ts-expect-error, useless
				eventId: `nostr:${nip19.noteEncode(event.id)}`,
				children: [{ text: "" }],
			},
			{
				type: "paragraph",
				children: [{ text: "" }],
			},
		]);
		setIsEditorOpen(true);
	};

	return (
		<DropdownMenu.Root open={open} onOpenChange={setOpen}>
			<Tooltip.Provider>
				<Tooltip.Root delayDuration={150}>
					<DropdownMenu.Trigger asChild>
						<Tooltip.Trigger asChild>
							<button
								type="button"
								className="inline-flex items-center justify-center group h-7 w-7 text-neutral-600 dark:text-neutral-400"
							>
								{loading ? (
									<LoaderIcon className="size-4 animate-spin" />
								) : (
									<RepostIcon
										className={cn(
											"size-5 group-hover:text-blue-600",
											isRepost ? "text-blue-500" : "",
										)}
									/>
								)}
							</button>
						</Tooltip.Trigger>
					</DropdownMenu.Trigger>
					<Tooltip.Portal>
						<Tooltip.Content className="inline-flex h-7 select-none text-neutral-50 dark:text-neutral-950 items-center justify-center rounded-md bg-neutral-950 dark:bg-neutral-50 px-3.5 text-sm will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
							Repost
							<Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
						</Tooltip.Content>
					</Tooltip.Portal>
				</Tooltip.Root>
			</Tooltip.Provider>
			<DropdownMenu.Portal>
				<DropdownMenu.Content className="flex w-[200px] p-2 flex-col overflow-hidden rounded-2xl bg-white/50 dark:bg-black/50 ring-1 ring-black/10 dark:ring-white/10 backdrop-blur-2xl focus:outline-none">
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={repost}
							className="inline-flex items-center gap-3 px-3 text-sm font-medium rounded-lg h-9 text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
						>
							<RepostIcon className="size-4" />
							Repost
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={quote}
							className="inline-flex items-center gap-3 px-3 text-sm font-medium rounded-lg h-9 text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
						>
							<ReplyIcon className="size-4" />
							Quote
						</button>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}
