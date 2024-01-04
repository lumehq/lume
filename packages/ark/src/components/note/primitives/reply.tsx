import { NavArrowDownIcon } from "@lume/icons";
import { NDKEventWithReplies } from "@lume/types";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Note } from "..";
import { ChildReply } from "./childReply";

export function Reply({
	event,
}: {
	event: NDKEventWithReplies;
}) {
	const [open, setOpen] = useState(false);

	return (
		<Collapsible.Root open={open} onOpenChange={setOpen}>
			<Note.Provider event={event}>
				<Note.Root>
					<div className="flex items-center justify-between px-3 h-14">
						<Note.User className="flex-1 pr-1" />
						<Note.Menu />
					</div>
					<Note.Content className="min-w-0 px-3" />
					<div className="flex items-center justify-between px-3 -ml-1 h-14">
						{event.replies?.length > 0 ? (
							<Collapsible.Trigger asChild>
								<div className="inline-flex items-center gap-1 ml-1 font-semibold text-blue-500 h-14">
									<NavArrowDownIcon
										className={twMerge(
											"h-3 w-3",
											open ? "rotate-180 transform" : "",
										)}
									/>
									{`${event.replies?.length} ${
										event.replies?.length === 1 ? "reply" : "replies"
									}`}
								</div>
							</Collapsible.Trigger>
						) : null}
						<div className="inline-flex items-center gap-10">
							<Note.Reply />
							<Note.Reaction />
							<Note.Repost />
							<Note.Zap />
						</div>
					</div>
					<div className={twMerge("px-3", open ? "pb-3" : "")}>
						{event.replies?.length > 0 ? (
							<Collapsible.Content>
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
