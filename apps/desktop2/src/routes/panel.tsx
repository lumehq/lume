import { Note } from "@/components/note";
import { User } from "@/components/user";
import {
	HorizontalDotsIcon,
	InfoIcon,
	RepostIcon,
	SearchIcon,
} from "@lume/icons";
import { type LumeEvent, LumeWindow, NostrQuery, useEvent } from "@lume/system";
import { Kind } from "@lume/types";
import {
	checkForAppUpdates,
	decodeZapInvoice,
	formatCreatedAt,
} from "@lume/utils";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Tabs from "@radix-ui/react-tabs";
import { createFileRoute } from "@tanstack/react-router";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { getCurrent } from "@tauri-apps/api/window";
import { exit } from "@tauri-apps/plugin-process";
import { open } from "@tauri-apps/plugin-shell";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { Virtualizer } from "virtua";

interface EmitAccount {
	account: string;
}

export const Route = createFileRoute("/panel")({
	component: Screen,
});

function Screen() {
	const [account, setAccount] = useState<string>(null);
	const [events, setEvents] = useState<LumeEvent[]>([]);

	const { texts, zaps, reactions } = useMemo(() => {
		const zaps = new Map<string, LumeEvent[]>();
		const reactions = new Map<string, LumeEvent[]>();
		const texts = events.filter((ev) => ev.kind === Kind.Text);
		const zapEvents = events.filter((ev) => ev.kind === Kind.ZapReceipt);
		const reactEvents = events.filter(
			(ev) => ev.kind === Kind.Repost || ev.kind === Kind.Reaction,
		);

		for (const event of reactEvents) {
			const rootId = event.tags.filter((tag) => tag[0] === "e")[0]?.[1];

			if (rootId) {
				if (reactions.has(rootId)) {
					reactions.get(rootId).push(event);
				} else {
					reactions.set(rootId, [event]);
				}
			}
		}

		for (const event of zapEvents) {
			const rootId = event.tags.filter((tag) => tag[0] === "e")[0]?.[1];

			if (rootId) {
				if (zaps.has(rootId)) {
					zaps.get(rootId).push(event);
				} else {
					zaps.set(rootId, [event]);
				}
			}
		}

		return { texts, zaps, reactions };
	}, [events?.length]);

	const showContextMenu = useCallback(async (e: React.MouseEvent) => {
		e.preventDefault();

		const menuItems = await Promise.all([
			MenuItem.new({
				text: "Open Lume",
				action: () => LumeWindow.openMainWindow(),
			}),
			MenuItem.new({
				text: "New Post",
				action: () => LumeWindow.openEditor(),
			}),
			PredefinedMenuItem.new({ item: "Separator" }),
			MenuItem.new({
				text: "About Lume",
				action: async () => await open("https://lume.nu"),
			}),
			MenuItem.new({
				text: "Check for Updates",
				action: async () => await checkForAppUpdates(false),
			}),
			MenuItem.new({
				text: "Settings",
				action: () => LumeWindow.openSettings(),
			}),
			PredefinedMenuItem.new({ item: "Separator" }),
			MenuItem.new({
				text: "Quit",
				action: async () => await exit(0),
			}),
		]);

		const menu = await Menu.new({
			items: menuItems,
		});

		await menu.popup().catch((e) => console.error(e));
	}, []);

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
			const event: LumeEvent = JSON.parse(data.payload as string);
			setEvents((prev) => [event, ...prev]);
		});

		return () => {
			unlistenLoad.then((f) => f());
			unlistenNewEvent.then((f) => f());
		};
	}, []);

	if (!account) {
		return (
			<div className="flex items-center justify-center w-full h-full text-sm">
				Please log in.
			</div>
		);
	}

	return (
		<div className="flex flex-col w-full h-full">
			<div className="flex items-center justify-between px-4 border-b h-11 shrink-0 border-black/5 dark:border-white/5">
				<div>
					<h1 className="text-sm font-semibold">Notifications</h1>
				</div>
				<div className="inline-flex items-center gap-2">
					<User.Provider pubkey={account}>
						<User.Root>
							<User.Avatar className="rounded-full size-7" />
						</User.Root>
					</User.Provider>
					<button
						type="button"
						onClick={(e) => showContextMenu(e)}
						className="inline-flex items-center justify-center rounded-full size-7 bg-black/5 dark:bg-white/5"
					>
						<HorizontalDotsIcon className="size-4" />
					</button>
				</div>
			</div>
			<Tabs.Root
				defaultValue="replies"
				className="flex-1 overflow-x-hidden overflow-y-auto scrollbar-none"
			>
				<Tabs.List className="flex items-center">
					<Tabs.Trigger
						className="flex-1 inline-flex h-8 items-center justify-center gap-2 px-2 text-sm font-medium border-b border-black/10 dark:border-white/10 data-[state=active]:border-black/30 dark:data-[state=active]:border-white/30 data-[state=inactive]:opacity-50"
						value="replies"
					>
						Replies
					</Tabs.Trigger>
					<Tabs.Trigger
						className="flex-1 inline-flex h-8 items-center justify-center gap-2 px-2 text-sm font-medium border-b border-black/10 dark:border-white/10 data-[state=active]:border-black/30 dark:data-[state=active]:border-white/30 data-[state=inactive]:opacity-50"
						value="reactions"
					>
						Reactions
					</Tabs.Trigger>
					<Tabs.Trigger
						className="flex-1 inline-flex h-8 items-center justify-center gap-2 px-2 text-sm font-medium border-b border-black/10 dark:border-white/10 data-[state=active]:border-black/30 dark:data-[state=active]:border-white/30 data-[state=inactive]:opacity-50"
						value="zaps"
					>
						Zaps
					</Tabs.Trigger>
				</Tabs.List>
				<div className="h-full">
					<Tab value="replies">
						{texts.map((event, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<TextNote key={event.id + index} event={event} />
						))}
					</Tab>
					<Tab value="reactions">
						{[...reactions.entries()].map(([root, events]) => (
							<div
								key={root}
								className="flex flex-col gap-1 p-2 mb-2 rounded-lg shrink-0 backdrop-blur-md bg-black/10 dark:bg-white/10"
							>
								<div className="flex flex-col flex-1 min-w-0 gap-2">
									<div className="flex items-center gap-2 pb-2 border-b border-black/5 dark:border-white/5">
										<RootNote id={root} />
									</div>
									<div className="flex flex-wrap items-center gap-3">
										{events.map((event) => (
											<User.Provider key={event.id} pubkey={event.pubkey}>
												<User.Root className="shrink-0 flex rounded-full h-8 bg-black/10 dark:bg-white/10 backdrop-blur-md p-[2px]">
													<User.Avatar className="flex-1 rounded-full size-7" />
													<div className="inline-flex items-center justify-center flex-1 text-xs truncate rounded-full size-7">
														{event.kind === Kind.Reaction ? (
															event.content === "+" ? (
																"👍"
															) : (
																event.content
															)
														) : (
															<RepostIcon className="text-teal-400 size-4 dark:text-teal-600" />
														)}
													</div>
												</User.Root>
											</User.Provider>
										))}
									</div>
								</div>
							</div>
						))}
					</Tab>
					<Tab value="zaps">
						{[...zaps.entries()].map(([root, events]) => (
							<div
								key={root}
								className="flex flex-col gap-1 p-2 mb-2 rounded-lg shrink-0 backdrop-blur-md bg-black/10 dark:bg-white/10"
							>
								<div className="flex flex-col flex-1 min-w-0 gap-2">
									<div className="flex items-center gap-2 pb-2 border-b border-black/5 dark:border-white/5">
										<RootNote id={root} />
									</div>
									<div className="flex flex-wrap items-center gap-3">
										{events.map((event) => (
											<User.Provider
												key={event.id}
												pubkey={event.tags.find((tag) => tag[0] === "P")[1]}
											>
												<User.Root className="shrink-0 flex gap-1.5 rounded-full h-8 bg-black/10 dark:bg-white/10 backdrop-blur-md p-[2px]">
													<User.Avatar className="flex-1 rounded-full size-7" />
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
					</Tab>
				</div>
			</Tabs.Root>
		</div>
	);
}

function Tab({ value, children }: { value: string; children: ReactNode[] }) {
	const ref = useRef<HTMLDivElement>(null);

	return (
		<Tabs.Content value={value} className="size-full">
			<ScrollArea.Root
				type={"scroll"}
				scrollHideDelay={300}
				className="overflow-hidden size-full"
			>
				<ScrollArea.Viewport ref={ref} className="h-full px-2 pt-2">
					<Virtualizer scrollRef={ref}>{children}</Virtualizer>
				</ScrollArea.Viewport>
				<ScrollArea.Scrollbar
					className="flex select-none touch-none p-0.5 duration-[160ms] ease-out data-[orientation=vertical]:w-2"
					orientation="vertical"
				>
					<ScrollArea.Thumb className="flex-1 bg-black/10 dark:bg-white/10 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
				</ScrollArea.Scrollbar>
				<ScrollArea.Corner className="bg-transparent" />
			</ScrollArea.Root>
		</Tabs.Content>
	);
}

function RootNote({ id }: { id: string }) {
	const { isLoading, isError, data } = useEvent(id);

	if (isLoading) {
		return (
			<div className="flex items-center pb-2 mb-2">
				<div className="rounded-full size-8 shrink-0 bg-black/20 dark:bg-white/20 animate-pulse" />
				<div className="w-2/3 h-4 rounded-md animate-pulse bg-black/20 dark:bg-white/20" />
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="flex items-center gap-2">
				<div className="inline-flex items-center justify-center text-white bg-red-500 rounded-full size-8 shrink-0">
					<InfoIcon className="size-5" />
				</div>
				<p className="text-sm text-red-500">
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
						<User.Avatar className="rounded-full size-8 shrink-0" />
					</User.Root>
				</User.Provider>
				<div className="line-clamp-1">{data.content}</div>
			</Note.Root>
		</Note.Provider>
	);
}

function TextNote({ event }: { event: LumeEvent }) {
	const pTags = event.tags
		.filter((tag) => tag[0] === "p")
		.map((tag) => tag[1])
		.slice(0, 3);

	return (
		<Note.Provider event={event}>
			<Note.Root className="flex flex-col p-2 mb-2 rounded-lg shrink-0 backdrop-blur-md bg-black/10 dark:bg-white/10">
				<User.Provider pubkey={event.pubkey}>
					<User.Root className="inline-flex items-center gap-2">
						<User.Avatar className="rounded-full size-9 shrink-0" />
						<div className="flex flex-col flex-1">
							<div className="flex items-baseline justify-between w-full">
								<User.Name className="text-sm font-semibold leading-tight" />
								<span className="text-sm leading-tight text-black/50 dark:text-white/50">
									{formatCreatedAt(event.created_at)}
								</span>
							</div>
							<div className="inline-flex items-baseline gap-1 text-xs">
								<span className="leading-tight text-black/50 dark:text-white/50">
									Reply to:
								</span>
								<div className="inline-flex items-baseline gap-1">
									{pTags.map((replyTo) => (
										<User.Provider key={replyTo} pubkey={replyTo}>
											<User.Root>
												<User.Name className="font-medium leading-tight" />
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
					<div className="line-clamp-1 text-start">{event.content}</div>
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
