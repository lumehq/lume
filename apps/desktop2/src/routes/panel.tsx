import { Note } from "@/components/note";
import { User } from "@/components/user";
import { LumeWindow, NostrQuery, useEvent } from "@lume/system";
import { Kind, NostrEvent } from "@lume/types";
import { createFileRoute } from "@tanstack/react-router";
import { getCurrent } from "@tauri-apps/api/window";
import { useEffect, useMemo, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { InfoIcon, RepostIcon, SettingsIcon } from "@lume/icons";
import { decodeZapInvoice, formatCreatedAt } from "@lume/utils";

interface EmitAccount {
	account: string;
}

export const Route = createFileRoute("/panel")({
	component: Screen,
});

function Screen() {
	const [account, setAccount] = useState<string>(null);
	const [events, setEvents] = useState<NostrEvent[]>([]);

	const texts = useMemo(
		() => events.filter((ev) => ev.kind === Kind.Text),
		[events],
	);

	const zaps = useMemo(() => {
		const groups = new Map<string, NostrEvent[]>();
		const list = events.filter((ev) => ev.kind === Kind.ZapReceipt);

		for (const event of list) {
			const rootId = event.tags.filter((tag) => tag[0] === "e")[0]?.[1];

			if (rootId) {
				if (groups.has(rootId)) {
					groups.get(rootId).push(event);
				} else {
					groups.set(rootId, [event]);
				}
			}
		}

		return groups;
	}, [events]);

	const reactions = useMemo(() => {
		const groups = new Map<string, NostrEvent[]>();
		const list = events.filter(
			(ev) => ev.kind === Kind.Repost || ev.kind === Kind.Reaction,
		);

		for (const event of list) {
			const rootId = event.tags.filter((tag) => tag[0] === "e")[0]?.[1];

			if (rootId) {
				if (groups.has(rootId)) {
					groups.get(rootId).push(event);
				} else {
					groups.set(rootId, [event]);
				}
			}
		}

		return groups;
	}, [events]);

	useEffect(() => {
		if (account?.length && account?.startsWith("npub1")) {
			NostrQuery.getNotifications()
				.then((data) => {
					const sorted = data.sort((a, b) => b.created_at - a.created_at);
					setEvents(sorted);
				})
				.catch((e) => console.log(e));
		}
	}, [account]);

	useEffect(() => {
		const unlistenLoad = getCurrent().listen<EmitAccount>(
			"load-notification",
			(data) => {
				setAccount(data.payload.account);
			},
		);

		const unlistenNewEvent = getCurrent().listen("notification", (data) => {
			const event: NostrEvent = JSON.parse(data.payload as string);
			setEvents((prev) => [event, ...prev]);
		});

		return () => {
			unlistenLoad.then((f) => f());
			unlistenNewEvent.then((f) => f());
		};
	}, []);

	if (!account) {
		return (
			<div className="w-full h-full flex items-center justify-center text-sm">
				Please log in.
			</div>
		);
	}

	return (
		<div className="w-full h-full flex flex-col">
			<div className="h-11 shrink-0 flex items-center justify-between border-b border-black/5 px-4">
				<div>
					<h1 className="text-sm font-semibold">Notifications</h1>
				</div>
				<div className="inline-flex items-center gap-2">
					<User.Provider pubkey={account}>
						<User.Root>
							<User.Avatar className="size-7 rounded-full" />
						</User.Root>
					</User.Provider>
					<button
						type="button"
						onClick={() => LumeWindow.openSettings()}
						className="size-7 inline-flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-full"
					>
						<SettingsIcon className="size-4" />
					</button>
				</div>
			</div>
			<Tabs.Root
				defaultValue="replies"
				className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none"
			>
				<Tabs.List className="flex items-center">
					<Tabs.Trigger
						className="flex-1 inline-flex h-8 items-center justify-center gap-2 px-2 text-sm font-medium border-b border-black/10 data-[state=active]:border-black/30 dark:data-[state=active] data-[state=inactive]:opacity-50"
						value="replies"
					>
						Replies
					</Tabs.Trigger>
					<Tabs.Trigger
						className="flex-1 inline-flex h-8 items-center justify-center gap-2 px-2 text-sm font-medium border-b border-black/10 data-[state=active]:border-black/30 dark:data-[state=active] data-[state=inactive]:opacity-50"
						value="reactions"
					>
						Reactions
					</Tabs.Trigger>
					<Tabs.Trigger
						className="flex-1 inline-flex h-8 items-center justify-center gap-2 px-2 text-sm font-medium border-b border-black/10 data-[state=active]:border-black/30 dark:data-[state=active] data-[state=inactive]:opacity-50"
						value="zaps"
					>
						Zaps
					</Tabs.Trigger>
				</Tabs.List>
				<div className="p-2">
					<Tabs.Content value="replies" className="flex flex-col gap-2">
						{texts.map((event) => (
							<TextNote event={event} />
						))}
					</Tabs.Content>
					<Tabs.Content value="reactions" className="flex flex-col gap-2">
						{[...reactions.entries()].map(([root, events]) => (
							<div
								key={root}
								className="shrink-0 flex flex-col gap-1 rounded-lg p-2 backdrop-blur-md bg-black/10 dark:bg-white/10"
							>
								<div className="min-w-0 flex-1 flex flex-col gap-2">
									<div className="pb-2 border-b border-black/5 dark:border-white/5 flex items-center gap-2">
										<RootNote id={root} />
									</div>
									<div className="flex flex-wrap items-center gap-3">
										{events.map((event) => (
											<User.Provider pubkey={event.pubkey}>
												<User.Root className="shrink-0 flex rounded-full h-8 bg-black/10 dark:bg-white/10 backdrop-blur-md p-[2px]">
													<User.Avatar className="flex-1 size-7 rounded-full" />
													<div className="flex-1 size-7 rounded-full inline-flex items-center justify-center text-xs truncate">
														{event.kind === Kind.Reaction ? (
															event.content === "+" ? (
																"👍"
															) : (
																event.content
															)
														) : (
															<RepostIcon className="size-4 dark:text-teal-600 text-teal-400" />
														)}
													</div>
												</User.Root>
											</User.Provider>
										))}
									</div>
								</div>
							</div>
						))}
					</Tabs.Content>
					<Tabs.Content value="zaps" className="flex flex-col gap-2">
						{[...zaps.entries()].map(([root, events]) => (
							<div
								key={root}
								className="shrink-0 flex flex-col gap-1 rounded-lg p-2 backdrop-blur-md bg-black/10 dark:bg-white/10"
							>
								<div className="min-w-0 flex-1 flex flex-col gap-2">
									<div className="pb-2 border-b border-black/5 dark:border-white/5 flex items-center gap-2">
										<RootNote id={root} />
									</div>
									<div className="flex flex-wrap items-center gap-3">
										{events.map((event) => (
											<User.Provider
												pubkey={event.tags.find((tag) => tag[0] == "P")[1]}
											>
												<User.Root className="shrink-0 flex gap-1.5 rounded-full h-8 bg-black/10 dark:bg-white/10 backdrop-blur-md p-[2px]">
													<User.Avatar className="flex-1 size-7 rounded-full" />
													<div className="flex-1 h-7 w-max pr-1.5 rounded-full inline-flex items-center justify-center text-sm truncate">
														₿ {decodeZapInvoice(event.tags).bitcoinFormatted}
													</div>
												</User.Root>
											</User.Provider>
										))}
									</div>
								</div>
							</div>
						))}
					</Tabs.Content>
				</div>
			</Tabs.Root>
		</div>
	);
}

function RootNote({ id }: { id: string }) {
	const { isLoading, isError, data } = useEvent(id);

	if (isLoading) {
		return (
			<div className="pb-2 mb-2 flex items-center">
				<div className="size-8 shrink-0 rounded-full bg-black/20 dark:bg-white/20 animate-pulse" />
				<div className="animate-pulse rounded-md h-4 w-2/3 bg-black/20 dark:bg-white/20" />
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="flex items-center gap-2">
				<div className="size-8 shrink-0 rounded-full bg-red-500 text-white inline-flex items-center justify-center">
					<InfoIcon className="size-5" />
				</div>
				<p className="text-red-500 text-sm">
					Event not found with your current relay set
				</p>
			</div>
		);
	}

	return (
		<Note.Provider event={data}>
			<Note.Root className="flex items-center gap-2">
				<User.Provider pubkey={data.pubkey}>
					<User.Root className="shrink-0">
						<User.Avatar className="size-8 shrink-0 rounded-full" />
					</User.Root>
				</User.Provider>
				<div className="line-clamp-1">{data.content}</div>
			</Note.Root>
		</Note.Provider>
	);
}

function TextNote({ event }: { event: NostrEvent }) {
	const pTags = event.tags
		.filter((tag) => tag[0] === "p")
		.map((tag) => tag[1])
		.slice(0, 3);

	return (
		<Note.Provider event={event}>
			<Note.Root className="shrink-0 flex flex-col gap-1 rounded-lg p-2 backdrop-blur-md bg-black/10 dark:bg-white/10">
				<User.Provider pubkey={event.pubkey}>
					<User.Root className="inline-flex items-center gap-2">
						<User.Avatar className="size-9 shrink-0 rounded-full" />
						<div className="flex-1 flex flex-col">
							<div className="w-full flex items-baseline justify-between">
								<User.Name className="leading-tight text-sm font-semibold" />
								<span className="leading-tight text-sm text-black/50 dark:text-white/50">
									{formatCreatedAt(event.created_at)}
								</span>
							</div>
							<div className="inline-flex items-baseline gap-1 text-xs">
								<span className="leading-tight text-black/50 dark:text-white/50">
									Reply to:
								</span>
								<div className="inline-flex items-baseline gap-1">
									{pTags.map((replyTo) => (
										<User.Provider pubkey={replyTo}>
											<User.Root>
												<User.Name className="leading-tight font-medium" />
											</User.Root>
										</User.Provider>
									))}
								</div>
							</div>
						</div>
					</User.Root>
				</User.Provider>
				<div className="flex gap-2">
					<div className="w-9 shrink-0" />
					<div className="line-clamp-1">{event.content}</div>
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
