import { RepostIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { NDKEvent, NostrEvent } from "@nostr-dev-kit/ndk";
import { useQuery } from "@tanstack/react-query";
import { Note } from "..";
import { useArk } from "../../../hooks/useArk";
import { User } from "../../user";

export function RepostNote({
	event,
	className,
}: { event: NDKEvent; className?: string }) {
	const ark = useArk();

	const {
		isLoading,
		isError,
		data: repostEvent,
	} = useQuery({
		queryKey: ["repost", event.id],
		queryFn: async () => {
			try {
				if (event.content.length > 50) {
					const embed = JSON.parse(event.content) as NostrEvent;
					return new NDKEvent(ark.ndk, embed);
				}
				const id = event.tags.find((el) => el[0] === "e")[1];
				return await ark.getEventById(id);
			} catch {
				throw new Error("Failed to get repost event");
			}
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
	});

	if (isLoading) {
		return <div className="w-full px-3 pb-3">Loading...</div>;
	}

	if (isError || !repostEvent) {
		return (
			<Note.Root className={className}>
				<User.Provider pubkey={event.pubkey}>
					<User.Root className="flex gap-2 px-3 h-14">
						<div className="inline-flex shrink-0 w-10 items-center justify-center">
							<RepostIcon className="h-5 w-5 text-blue-500" />
						</div>
						<div className="inline-flex items-center gap-2">
							<User.Avatar className="size-6 shrink-0 rounded object-cover" />
							<div className="inline-flex items-baseline gap-1">
								<User.Name className="font-medium text-neutral-900 dark:text-neutral-100" />
								<span className="text-blue-500">reposted</span>
							</div>
						</div>
					</User.Root>
				</User.Provider>
				<div className="px-3 mb-3 select-text">
					<div className="flex flex-col items-start justify-start px-3 py-3 bg-red-100 rounded-lg dark:bg-red-900">
						<p className="text-red-500">Failed to get event</p>
						<p className="text-sm">
							You can consider enable Outbox in Settings for better event
							discovery.
						</p>
					</div>
				</div>
			</Note.Root>
		);
	}

	return (
		<Note.Root
			className={cn(
				"flex flex-col rounded-xl bg-neutral-50 dark:bg-neutral-950",
				className,
			)}
		>
			<User.Provider pubkey={event.pubkey}>
				<User.Root className="flex gap-2 px-3 h-14">
					<div className="inline-flex shrink-0 w-10 items-center justify-center">
						<RepostIcon className="h-5 w-5 text-blue-500" />
					</div>
					<div className="inline-flex items-center gap-2">
						<User.Avatar className="size-6 shrink-0 rounded object-cover" />
						<div className="inline-flex items-baseline gap-1">
							<User.Name className="font-medium text-neutral-900 dark:text-neutral-100" />
							<span className="text-blue-500">reposted</span>
						</div>
					</div>
				</User.Root>
			</User.Provider>
			<Note.Provider event={repostEvent}>
				<div className="relative flex flex-col gap-2 px-3">
					<div className="flex items-center justify-between">
						<Note.User className="flex-1 pr-2" />
						<Note.Menu />
					</div>
					<Note.Content />
					<div className="flex items-center justify-between h-14">
						<Note.Pin />
						<div className="inline-flex items-center gap-4">
							<Note.Reply />
							<Note.Repost />
							<Note.Zap />
						</div>
					</div>
				</div>
			</Note.Provider>
		</Note.Root>
	);
}
