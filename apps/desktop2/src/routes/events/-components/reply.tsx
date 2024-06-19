import { Note } from "@/components/note";
import type { LumeEvent } from "@lume/system";
import { cn } from "@lume/utils";
import { SubReply } from "./subReply";

export function Reply({ event }: { event: LumeEvent }) {
	return (
		<Note.Provider event={event}>
			<Note.Root className="border-t border-neutral-100 dark:border-neutral-900">
				<div className="flex items-center justify-between px-3 h-14">
					<Note.User />
					<Note.Menu />
				</div>
				<Note.ContentLarge className="px-3" />
				<div className="flex items-center gap-4 px-3 mt-3 h-14">
					<Note.Reply />
					<Note.Repost />
					<Note.Zap />
				</div>
				<div
					className={cn(
						event.replies?.length > 0
							? "py-2 pl-3 flex flex-col gap-3 divide-y divide-neutral-100 bg-neutral-50 dark:bg-white/5 border-l-2 border-blue-500 dark:divide-neutral-900"
							: "",
					)}
				>
					{event.replies?.length > 0
						? event.replies?.map((childEvent) => (
								<SubReply key={childEvent.id} event={childEvent} />
							))
						: null}
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
