import { Note, useArk } from "@lume/ark";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useTranslation } from "react-i18next";
import { ActivityRootNote } from "./rootNote";

export function ActivitySingleText({ event }: { event: NDKEvent }) {
	const ark = useArk();
	const thread = ark.getEventThread({
		content: event.content,
		tags: event.tags,
	});

	const { t } = useTranslation();

	return (
		<div className="h-full w-full flex flex-col justify-between">
			<div className="h-14 border-b border-neutral-100 dark:border-neutral-900 flex flex-col items-center justify-center px-3">
				<h3 className="text-center font-semibold leading-tight">
					{t("activity.conversation")}
				</h3>
				<p className="text-sm text-blue-500 font-medium leading-tight">
					{t("activity.conversationSubtitle")}
				</p>
			</div>
			<div className="overflow-y-auto">
				<div className="max-w-xl mx-auto py-6">
					{thread ? (
						<div className="flex flex-col gap-3 mb-1">
							{thread.rootEventId ? (
								<ActivityRootNote eventId={thread.rootEventId} />
							) : null}
							{thread.replyEventId ? (
								<ActivityRootNote eventId={thread.replyEventId} />
							) : null}
						</div>
					) : null}
					<div className="mt-3 flex flex-col gap-3">
						<div className="flex items-center gap-3">
							<p className="text-teal-500 font-medium">
								{t("activity.newReply")}
							</p>
							<div className="flex-1 h-px bg-teal-300" />
							<div className="w-4 shrink-0 h-px bg-teal-300" />
						</div>
						<Note.Provider event={event}>
							<Note.Root>
								<div className="flex items-center justify-between px-3 h-14">
									<Note.User className="flex-1 pr-1" />
								</div>
								<Note.Content className="min-w-0 px-3" />
								<div className="flex items-center justify-between px-3 h-14">
									<Note.Pin />
									<div className="inline-flex items-center gap-10" />
								</div>
							</Note.Root>
						</Note.Provider>
					</div>
				</div>
			</div>
		</div>
	);
}
