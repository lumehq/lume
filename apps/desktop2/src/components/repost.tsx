import { Spinner } from "@lume/ui";
import { Note } from "@/components/note";
import { User } from "@/components/user";
import { cn } from "@lume/utils";
import { useQuery } from "@tanstack/react-query";
import type { NostrEvent } from "@lume/types";
import { NostrQuery } from "@lume/system";

export function RepostNote({
	event,
	className,
}: {
	event: NostrEvent;
	className?: string;
}) {
	const {
		isLoading,
		isError,
		data: repostEvent,
	} = useQuery({
		queryKey: ["repost", event.id],
		queryFn: async () => {
			try {
				const id = event.tags.find((el) => el[0] === "e")[1];
				const repostEvent = await NostrQuery.getEvent(id);

				return repostEvent;
			} catch (e) {
				throw new Error(e);
			}
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});

	return (
		<Note.Root
			className={cn(
				"bg-white dark:bg-black/20 backdrop-blur-lg rounded-xl mb-3 shadow-primary dark:ring-1 ring-neutral-800/50",
				className,
			)}
		>
			<User.Provider pubkey={event.pubkey}>
				<User.Root className="flex items-center gap-2 px-3 py-3 border-b border-neutral-100 dark:border-neutral-800/50 rounded-t-xl">
					<div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
						Reposted by
					</div>
					<User.Avatar className="object-cover rounded-full size-6 shrink-0 ring-1 ring-neutral-200/50 dark:ring-neutral-800/50" />
				</User.Root>
			</User.Provider>
			{isLoading ? (
				<div className="flex items-center justify-center h-20 gap-2">
					<Spinner />
					Loading event...
				</div>
			) : isError || !repostEvent ? (
				<div className="flex items-center justify-center h-20">
					Event not found within your current relay set
				</div>
			) : (
				<Note.Provider event={repostEvent}>
					<Note.Root>
						<div className="flex items-center justify-between px-3 h-14">
							<Note.User />
							<Note.Menu />
						</div>
						<Note.Content className="px-3" />
						<div className="flex items-center gap-4 px-3 mt-3 h-14">
							<Note.Open />
							<Note.Reply />
							<Note.Repost />
							<Note.Zap />
						</div>
					</Note.Root>
				</Note.Provider>
			)}
		</Note.Root>
	);
}
