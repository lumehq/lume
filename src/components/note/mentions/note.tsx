import { replyTime } from "@/commons";
import { Note, Spinner } from "@/components";
import { User } from "@/components/user";
import { useEvent } from "@/system";

export function MentionNote({
	eventId,
}: {
	eventId: string;
}) {
	const { isLoading, isError, data: event } = useEvent(eventId);

	if (isLoading) {
		return (
			<div className="py-2">
				<div className="pl-4 py-3 flex flex-col w-full border-l-2 border-black/5 dark:border-white/5">
					<Spinner className="size-5" />
				</div>
			</div>
		);
	}

	if (isError || !event) {
		return (
			<div className="py-2">
				<div className="pl-4 py-3 flex flex-col w-full border-l-2 border-black/5 dark:border-white/5">
					<p className="text-sm font-medium text-red-500">
						Event not found with your current relay set
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="relative">
			<div className="pl-3 before:content-[''] before:absolute before:top-1.5 before:bottom-1.5 before:left-0 before:border-l-[2px] before:border-black/10 dark:before:border-white/10">
				<Note.Provider event={event}>
					<User.Provider pubkey={event.pubkey}>
						<div className="group flex flex-col gap-1">
							<div>
								<User.Root className="inline">
									<User.Name className="font-medium text-blue-500" suffix=":" />
								</User.Root>
								<div className="pl-2 inline select-text text-balance content-break overflow-hidden">
									{event.content}
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
			</div>
		</div>
	);
}
