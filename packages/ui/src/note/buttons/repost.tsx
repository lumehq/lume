import { QuoteIcon, RepostIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useNoteContext } from "../provider";
import { useRouteContext } from "@tanstack/react-router";
import { Spinner } from "../../spinner";

export function NoteRepost() {
	const { ark } = useRouteContext({ strict: false });
	const event = useNoteContext();

	const [t] = useTranslation();
	const [loading, setLoading] = useState(false);
	const [isRepost, setIsRepost] = useState(false);

	const repost = async () => {
		try {
			setLoading(true);

			// repost
			await ark.repost(event.id, event.pubkey);

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

	return (
		<DropdownMenu.Root>
			<Tooltip.Provider>
				<Tooltip.Root delayDuration={150}>
					<DropdownMenu.Trigger asChild>
						<Tooltip.Trigger asChild>
							<button
								type="button"
								className="group inline-flex size-7 items-center justify-center text-neutral-800 dark:text-neutral-200"
							>
								{loading ? (
									<Spinner className="size-4" />
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
						<Tooltip.Content className="inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-950 px-3.5 text-sm text-neutral-50 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade dark:bg-neutral-50 dark:text-neutral-950">
							{t("note.buttons.repost")}
							<Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
						</Tooltip.Content>
					</Tooltip.Portal>
				</Tooltip.Root>
			</Tooltip.Provider>
			<DropdownMenu.Portal>
				<DropdownMenu.Content className="flex w-[200px] flex-col overflow-hidden rounded-xl bg-black p-1 shadow-md shadow-neutral-500/20 focus:outline-none dark:bg-white">
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={repost}
							className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-white hover:bg-neutral-900 focus:outline-none dark:text-black dark:hover:bg-neutral-100"
						>
							<RepostIcon className="size-4" />
							{t("note.buttons.repost")}
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={() => ark.open_editor(event.id, true)}
							className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-white hover:bg-neutral-900 focus:outline-none dark:text-black dark:hover:bg-neutral-100"
						>
							<QuoteIcon className="size-4" />
							{t("note.buttons.quote")}
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Arrow className="fill-black dark:fill-white" />
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}
