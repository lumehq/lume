import { cn } from "@/commons";
import { Spinner } from "@/components";
import { Note } from "@/components/note";
import { User } from "@/components/user";
import { type LumeEvent, useEvent } from "@/system";
import { memo } from "react";

export const RepostNote = memo(function RepostNote({
	event,
	className,
}: {
	event: LumeEvent;
	className?: string;
}) {
	const { isLoading, isError, data } = useEvent(event.repostId, event.content);

	return (
		<Note.Root className={cn("", className)}>
			{isLoading ? (
				<div className="flex items-center justify-center h-20 gap-2">
					<Spinner />
					<p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
						Loading event...
					</p>
				</div>
			) : isError || !data ? (
				<div className="flex items-center justify-center h-20">
					<p className="text-sm">
						Repost event not found within your current relay set
					</p>
				</div>
			) : (
				<Note.Provider event={data}>
					<Note.Root>
						<div className="flex items-center justify-between px-3 h-14">
							<Note.User />
							<Note.Menu />
						</div>
						<Note.Content className="px-3" />
						<div className="flex items-center justify-between px-3 mt-3 h-14">
							<div className="inline-flex items-center gap-2">
								<Note.Open />
								<Note.Reply />
								<Note.Repost />
								<Note.Zap />
							</div>
							<div>
								<User.Provider pubkey={event.pubkey}>
									<User.Root className="flex items-center gap-2">
										<div className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
											Reposted by
										</div>
										<User.Avatar className="rounded-full size-6" />
									</User.Root>
								</User.Provider>
							</div>
						</div>
					</Note.Root>
				</Note.Provider>
			)}
		</Note.Root>
	);
});
