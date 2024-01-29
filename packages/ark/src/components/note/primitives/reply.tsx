import { NavArrowDownIcon } from "@lume/icons";
import { NDKEventWithReplies } from "@lume/types";
import { cn } from "@lume/utils";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Note } from "..";
import { ChildReply } from "./childReply";

export function Reply({
	event,
}: {
	event: NDKEventWithReplies;
}) {
	const [t] = useTranslation();
	const [open, setOpen] = useState(false);

	return (
		<Collapsible.Root open={open} onOpenChange={setOpen}>
			<Note.Provider event={event}>
				<Note.Root className="pt-2">
					<div className="flex items-center justify-between h-14">
						<Note.User className="flex-1 pr-2" />
						<Note.Menu />
					</div>
					<Note.Content />
					<div className="flex items-center justify-between h-14">
						{event.replies?.length > 0 ? (
							<Collapsible.Trigger asChild>
								<div className="inline-flex items-center gap-1 font-semibold text-sm text-neutral-600 dark:text-neutral-400 h-14">
									<NavArrowDownIcon
										className={cn("size-5", open ? "rotate-180 transform" : "")}
									/>
									{`${event.replies?.length} ${
										event.replies?.length === 1
											? t("note.reply.single")
											: t("note.reply.plural")
									}`}
								</div>
							</Collapsible.Trigger>
						) : (
							<div />
						)}
						<div className="inline-flex items-center gap-4">
							<Note.Reply />
							<Note.Repost />
							<Note.Zap />
						</div>
					</div>
					<div
						className={cn(
							open
								? "pb-3 border-t border-neutral-100 dark:border-neutral-900"
								: "",
						)}
					>
						{event.replies?.length > 0 ? (
							<Collapsible.Content className="divide-y divide-neutral-100 dark:divide-neutral-900 pl-6">
								{event.replies?.map((childEvent) => (
									<ChildReply key={childEvent.id} event={childEvent} />
								))}
							</Collapsible.Content>
						) : null}
					</div>
				</Note.Root>
			</Note.Provider>
		</Collapsible.Root>
	);
}
