import { replyTime } from "@/commons";
import { Note, Spinner } from "@/components";
import { User } from "@/components/user";
import { LumeWindow, useEvent } from "@/system";
import { memo } from "react";

export const MentionNote = memo(function MentionNote({
	eventId,
}: {
	eventId: string;
}) {
	const { isLoading, isError, error, data: event } = useEvent(eventId);

	return (
		<div className="relative my-2">
			<div className="pl-3 before:content-[''] before:absolute before:top-1.5 before:bottom-1.5 before:left-0 before:border-l-[2px] before:border-black/10 dark:before:border-white/10">
				{isLoading ? (
					<Spinner />
				) : isError || !event ? (
					<p className="text-sm font-medium text-red-500">
						{error.message ||
							"Quoted note is not found with your current relay set"}
					</p>
				) : (
					<Note.Provider event={event}>
						<User.Provider pubkey={event.pubkey}>
							<div className="group flex flex-col gap-1">
								<div>
									<User.Root className="inline">
										<User.Name
											className="font-medium text-blue-500"
											suffix=":"
										/>
									</User.Root>
									<div className="pl-2 inline select-text text-balance content-break overflow-hidden">
										{event.content.length > 120
											? `${event.content.substring(0, 120)}..`
											: event.content}
										<button
											type="button"
											onClick={() => LumeWindow.openEvent(event)}
											className="pl-2 text-blue-400 hover:text-blue-500"
										>
											Show all
										</button>
									</div>
								</div>
								<div className="flex-1 flex items-center justify-between">
									<span className="text-sm text-neutral-500">
										{replyTime(event.created_at)}
									</span>
									<div className="invisible group-hover:visible flex items-center justify-end gap-3">
										<Note.Reply />
										<Note.Repost />
										<Note.Zap />
									</div>
								</div>
							</div>
						</User.Provider>
					</Note.Provider>
				)}
			</div>
		</div>
	);
});
