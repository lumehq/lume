import type { Event } from "@lume/types";
import { cn } from "@lume/utils";
import { useQuery } from "@tanstack/react-query";
import { Note, Spinner, User } from "@lume/ui";
import { useRouteContext } from "@tanstack/react-router";

export function RepostNote({
	event,
	className,
}: {
	event: Event;
	className?: string;
}) {
	const { ark, settings } = useRouteContext({ strict: false });
	const {
		isLoading,
		isError,
		data: repostEvent,
	} = useQuery({
		queryKey: ["repost", event.id],
		queryFn: async () => {
			try {
				if (event.content.length > 50) {
					const embed: Event = JSON.parse(event.content);
					return embed;
				}

				const id = event.tags.find((el) => el[0] === "e")?.[1];
				const repostEvent = await ark.get_event(id);

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
				<User.Root className="flex items-center gap-2 px-3 py-3 border-b border-neutral-100 dark:border-neutral-900 rounded-t-xl">
					<div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
						Reposted by
					</div>
					<User.Avatar className="size-6 shrink-0 rounded-full object-cover ring-1 ring-neutral-200/50 dark:ring-neutral-800/50" />
				</User.Root>
			</User.Provider>
			{isLoading ? (
				<div className="flex h-20 items-center justify-center gap-2">
					<Spinner />
					Loading event...
				</div>
			) : isError || !repostEvent ? (
				<div className="flex h-20 items-center justify-center">
					Event not found within your current relay set
				</div>
			) : (
				<Note.Provider event={repostEvent}>
					<Note.Root>
						<Note.User className="px-3 h-14 flex items-center" />
						<div className="flex flex-col gap-2">
							<Note.Content className="px-3" />
							<Note.Thread className="px-3" />
							<div className="h-11 px-3 flex items-center justify-between">
								<div className="inline-flex items-center gap-4">
									<Note.Reply />
									<Note.Repost />
									{settings.zap ? <Note.Zap /> : null}
								</div>
								<Note.Menu />
							</div>
						</div>
					</Note.Root>
				</Note.Provider>
			)}
		</Note.Root>
	);
}
