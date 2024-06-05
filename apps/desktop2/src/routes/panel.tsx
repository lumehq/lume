import { Note } from "@/components/note";
import { User } from "@/components/user";
import { NostrQuery } from "@lume/system";
import { Kind, NostrEvent } from "@lume/types";
import { createFileRoute } from "@tanstack/react-router";
import { getCurrent } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";

export interface EmitAccount {
	account: string;
}

export const Route = createFileRoute("/panel")({
	component: Screen,
});

function Screen() {
	const [account, setAccount] = useState<string>(null);
	const [events, setEvents] = useState([]);

	const renderItem = (event: NostrEvent) => {
		if (!event) return;
		switch (event.kind) {
			case Kind.Text:
				const pTags = event.tags
					.filter((tag) => tag[0] === "p")
					.map((tag) => tag[1]);

				return (
					<Note.Provider event={event}>
						<Note.Root className="shrink-0 flex flex-col gap-1 rounded-lg p-2 backdrop-blur-md bg-black/10 dark:bg-white/10">
							<User.Provider pubkey={event.pubkey}>
								<User.Root className="inline-flex items-center gap-2">
									<User.Avatar className="size-9 shrink-0 rounded-full" />
									<div className="flex flex-col">
										<User.Name className="leading-tight text-sm font-semibold" />
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
			case Kind.Repost:
				return null;
			case Kind.Reaction:
				return null;
			default:
				<div className="px-3">{event.content}</div>;
		}
	};

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
			<div className="h-11 border-b border-black/5 dark:border-white/5 shrink-0 flex items-center justify-between px-4">
				<div>
					<h1 className="text-sm font-semibold">Notifications</h1>
				</div>
				<div className="inline-flex items-center gap-2">
					<User.Provider pubkey={account}>
						<User.Root>
							<User.Avatar className="size-7 rounded-full" />
						</User.Root>
					</User.Provider>
				</div>
			</div>
			<div className="flex-1 overflow-y-auto scrollbar-none flex flex-col p-2 gap-2">
				{events.map((event) => renderItem(event))}
			</div>
		</div>
	);
}
