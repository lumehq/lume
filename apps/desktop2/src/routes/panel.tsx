import { Note } from "@/components/note";
import { User } from "@/components/user";
import { NostrQuery } from "@lume/system";
import { Kind, NostrEvent } from "@lume/types";
import { createFileRoute } from "@tanstack/react-router";
import { getCurrent } from "@tauri-apps/api/window";
import { Fragment, useEffect, useState } from "react";

export interface EmitAccount {
	account: string;
}

export const Route = createFileRoute("/panel")({
	component: Screen,
});

function Screen() {
	const [account, setAccount] = useState<string>(null);
	const [events, setEvents] = useState([]);

	useEffect(() => {
		if (account?.length && account?.startsWith("npub1")) {
			NostrQuery.getNotifications()
				.then((data) => setEvents(data))
				.catch((e) => console.log(e));
		}
	}, [account]);

	useEffect(() => {
		const unlisten = getCurrent().listen<EmitAccount>(
			"load-notification",
			(data) => {
				setAccount(data.payload.account);
			},
		);

		return () => {
			unlisten.then((f) => f());
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
					{account ? (
						<User.Provider pubkey={account}>
							<User.Root>
								<User.Avatar className="size-7 rounded-full" />
							</User.Root>
						</User.Provider>
					) : null}
					<div className="size-7 rounded-full bg-black/10 dark:bg-white/10" />
				</div>
			</div>
			<div className="flex-1 overflow-y-auto scrollbar-none flex flex-col p-2 gap-2">
				{events.map((event) => (
					<div key={event.id}>{event.content}</div>
				))}
			</div>
		</div>
	);
}
