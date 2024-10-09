import { commands } from "@/commands.gen";
import { replyTime, toLumeEvents } from "@/commons";
import { Note, Spinner, User } from "@/components";
import { Hashtag } from "@/components/note/mentions/hashtag";
import { MentionUser } from "@/components/note/mentions/user";
import { type LumeEvent, LumeWindow } from "@/system";
import { Kind } from "@/types";
import { ArrowRight } from "@phosphor-icons/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { nip19 } from "nostr-tools";
import { type ReactNode, memo, useMemo, useRef } from "react";
import reactStringReplace from "react-string-replace";
import { Virtualizer } from "virtua";

export const Route = createLazyFileRoute("/columns/_layout/stories")({
	component: Screen,
});

function Screen() {
	const contacts = Route.useLoaderData();
	const ref = useRef<HTMLDivElement>(null);

	return (
		<ScrollArea.Root
			type={"scroll"}
			scrollHideDelay={300}
			className="overflow-hidden size-full"
		>
			<ScrollArea.Viewport ref={ref} className="relative h-full px-3 pb-3">
				<Virtualizer scrollRef={ref} overscan={0}>
					{!contacts ? (
						<div className="w-full h-24 flex items-center justify-center">
							<Spinner className="size-4" />
						</div>
					) : (
						contacts.map((contact) => (
							<StoryItem key={contact} contact={contact} />
						))
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
			const res = await commands.getAllEventsByAuthor(contact, 10);

			if (res.status === "ok") {
				const data = toLumeEvents(res.data);
				return data;
			} else {
				throw new Error(res.error);
			}
		},
		select: (data) => data.filter((ev) => ev.kind === Kind.Text),
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
						className="h-7 w-max px-2.5 inline-flex gap-1 items-center justify-center rounded-full text-sm font-medium hover:bg-neutral-100 dark:hover:bg-white/20"
					>
						Open
						<ArrowRight className="size-3" weight="bold" />
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
						<Content
							text={event.content}
							className="pl-2 inline select-text text-balance content-break overflow-hidden"
						/>
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

function Content({ text, className }: { text: string; className?: string }) {
	const content = useMemo(() => {
		let replacedText: ReactNode[] | string = text.trim();

		const nostr = replacedText
			.split(/\s+/)
			.filter((w) => w.startsWith("nostr:"));

		replacedText = reactStringReplace(text, /(https?:\/\/\S+)/g, (match, i) => (
			<a
				key={match + i}
				href={match}
				target="_blank"
				rel="noreferrer"
				className="text-blue-600 dark:text-blue-400 !underline"
			>
				{match}
			</a>
		));

		replacedText = reactStringReplace(replacedText, /#(\w+)/g, (match, i) => (
			<Hashtag key={match + i} tag={match} />
		));

		for (const word of nostr) {
			const bech32 = word.replace("nostr:", "");
			const data = nip19.decode(bech32);

			switch (data.type) {
				case "npub":
					replacedText = reactStringReplace(replacedText, word, (match, i) => (
						<MentionUser key={match + i} pubkey={data.data} />
					));
					break;
				case "nprofile":
					replacedText = reactStringReplace(replacedText, word, (match, i) => (
						<MentionUser key={match + i} pubkey={data.data.pubkey} />
					));
					break;
				default:
					replacedText = reactStringReplace(replacedText, word, (match, i) => (
						<a
							key={match + i}
							href={`https://njump.me/${bech32}`}
							target="_blank"
							rel="noreferrer"
							className="text-blue-600 dark:text-blue-400 !underline"
						>
							{match}
						</a>
					));
					break;
			}
		}

		return replacedText;
	}, [text]);

	return <div className={className}>{content}</div>;
}
