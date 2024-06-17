import { Spinner } from "@lume/ui";
import { Note } from "@/components/note";
import { User } from "@/components/user";
import { cn } from "@lume/utils";
import { useQuery } from "@tanstack/react-query";
import { type LumeEvent, NostrQuery } from "@lume/system";

export function RepostNote({
	event,
	className,
}: {
	event: LumeEvent;
	className?: string;
}) {
	const { isLoading, isError, data } = useQuery({
		queryKey: ["event", event.repostId],
		queryFn: async () => {
			try {
				const data = await NostrQuery.getRepostEvent(event);
				return data;
			} catch (e) {
				throw new Error(e);
			}
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		staleTime: Number.POSITIVE_INFINITY,
		retry: 2,
	});

	return (
		<Note.Root
			className={cn(
				"bg-white dark:bg-black/20 backdrop-blur-lg rounded-xl shadow-primary dark:ring-1 ring-neutral-800/50",
				className,
			)}
		>
			{isLoading ? (
				<div className="flex items-center justify-center h-20 gap-2">
					<Spinner />
					<span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
						Loading event...
					</span>
				</div>
			) : isError || !data ? (
				<div className="flex items-center justify-center h-20">
					Event not found within your current relay set
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
							<div className="inline-flex items-center gap-3">
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
										<User.Avatar className="object-cover rounded-full size-6 shrink-0 ring-1 ring-neutral-200/50 dark:ring-neutral-800/50" />
									</User.Root>
								</User.Provider>
							</div>
						</div>
					</Note.Root>
				</Note.Provider>
			)}
		</Note.Root>
	);
}
