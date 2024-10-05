import { commands } from "@/commands.gen";
import { replyTime, toLumeEvents } from "@/commons";
import { Note, Spinner, User } from "@/components";
import { type LumeEvent, LumeWindow } from "@/system";
import { ColumnsPlusLeft } from "@phosphor-icons/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { memo, useRef } from "react";
import { Virtualizer } from "virtua";

export const Route = createLazyFileRoute("/columns/_layout/stories")({
	component: Screen,
});

function Screen() {
	const { contacts } = Route.useRouteContext();
	const ref = useRef<HTMLDivElement>(null);

	return (
		<ScrollArea.Root
			type={"scroll"}
			scrollHideDelay={300}
			className="overflow-hidden size-full"
		>
			<ScrollArea.Viewport ref={ref} className="relative h-full px-3 pb-3">
				<Virtualizer scrollRef={ref} overscan={0}>
					{contacts.map((contact) => (
						<StoryItem key={contact} contact={contact} />
					))}
				</Virtualizer>
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar
				className="flex select-none touch-none p-0.5 duration-[160ms] ease-out data-[orientation=vertical]:w-2"
				orientation="vertical"
			>
				<ScrollArea.Thumb className="flex-1 bg-black/10 dark:bg-white/10 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
			</ScrollArea.Scrollbar>
			<ScrollArea.Corner className="bg-transparent" />
		</ScrollArea.Root>
	);
}

function StoryItem({ contact }: { contact: string }) {
	const {
		isLoading,
		isError,
		error,
		data: events,
	} = useQuery({
		queryKey: ["stories", contact],
		queryFn: async () => {
			const res = await commands.getEventsBy(contact, 10);

			if (res.status === "ok") {
				const data = toLumeEvents(res.data);
				return data;
			} else {
				throw new Error(res.error);
			}
		},
		refetchOnWindowFocus: false,
	});

	const ref = useRef<HTMLDivElement>(null);

	return (
		<div className="mb-3 flex flex-col w-full h-[300px] bg-white dark:bg-black rounded-xl border-[.5px] border-neutral-300 dark:border-neutral-700">
			<div className="h-12 shrink-0 px-2 flex items-center justify-between border-b border-neutral-100 dark:border-white/5">
				<User.Provider pubkey={contact}>
					<User.Root className="inline-flex items-center gap-2">
						<User.Avatar className="size-8 rounded-full" />
						<User.Name className="text-sm font-medium" />
					</User.Root>
				</User.Provider>
				<div>
					<button
						type="button"
						onClick={() => LumeWindow.openProfile(contact)}
						className="size-7 inline-flex items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/20"
					>
						<ColumnsPlusLeft className="size-4" />
					</button>
				</div>
			</div>
			<ScrollArea.Root
				type={"scroll"}
				scrollHideDelay={300}
				className="flex-1 min-h-0 overflow-hidden size-full"
			>
				<ScrollArea.Viewport ref={ref} className="relative h-full px-2 pt-2">
					<Virtualizer scrollRef={ref} overscan={0}>
						{isLoading ? (
							<div className="w-full h-[calc(300px-48px)] flex items-center justify-center text-sm">
								<Spinner className="size-4" />
							</div>
						) : isError ? (
							<div className="w-full h-[calc(300px-48px)] flex items-center justify-center text-sm">
								{error.message}
							</div>
						) : !events.length ? (
							<div className="w-full h-[calc(300px-48px)] flex items-center justify-center text-sm">
								This user didn't have any new notes.
							</div>
						) : (
							events.map((event) => <StoryEvent key={event.id} event={event} />)
						)}
					</Virtualizer>
				</ScrollArea.Viewport>
				<ScrollArea.Scrollbar
					className="flex select-none touch-none p-0.5 duration-[160ms] ease-out data-[orientation=vertical]:w-2"
					orientation="vertical"
				>
					<ScrollArea.Thumb className="flex-1 bg-black/10 dark:bg-white/10 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
				</ScrollArea.Scrollbar>
				<ScrollArea.Corner className="bg-transparent" />
			</ScrollArea.Root>
		</div>
	);
}

const StoryEvent = memo(function StoryEvent({ event }: { event: LumeEvent }) {
	return (
		<Note.Provider event={event}>
			<User.Provider pubkey={event.pubkey}>
				<Note.Root className="group flex flex-col gap-1 mb-3">
					<div>
						<User.Name
							className="shrink-0 inline font-medium text-blue-500"
							suffix=":"
						/>
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
				</Note.Root>
			</User.Provider>
		</Note.Provider>
	);
});
