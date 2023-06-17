import { prefetchEvents } from "@libs/ndk";
import {
	countTotalNotes,
	createChannelMessage,
	createChat,
	createNote,
	getChannels,
} from "@libs/storage";
import { NDKFilter } from "@nostr-dev-kit/ndk";
import { LumeIcon } from "@shared/icons";
import { RelayContext } from "@shared/relayProvider";
import { useActiveAccount } from "@stores/accounts";
import { dateToUnix, getHourAgo } from "@utils/date";
import { useContext, useEffect, useRef } from "react";
import { navigate } from "vite-plugin-ssr/client/router";

let totalNotes: number;

if (typeof window !== "undefined") {
	totalNotes = await countTotalNotes();
}

export function Page() {
	const ndk = useContext(RelayContext);
	const now = useRef(new Date());

	const [account, lastLogin] = useActiveAccount((state: any) => [
		state.account,
		state.lastLogin,
	]);

	async function fetchNotes() {
		try {
			const follows = JSON.parse(account.follows);
			let queryNoteSince: number;

			if (totalNotes === 0) {
				queryNoteSince = dateToUnix(getHourAgo(48, now.current));
			} else {
				if (lastLogin > 0) {
					queryNoteSince = lastLogin;
				} else {
					queryNoteSince = dateToUnix(getHourAgo(48, now.current));
				}
			}

			const filter: NDKFilter = {
				kinds: [1, 6],
				authors: follows,
				since: queryNoteSince,
			};

			const events = await prefetchEvents(ndk, filter);
			events.forEach((event) => {
				createNote(
					event.id,
					event.pubkey,
					event.kind,
					event.tags,
					event.content,
					event.created_at,
				);
			});

			return true;
		} catch (e) {
			console.log("error: ", e);
		}
	}

	async function fetchChats() {
		try {
			const sendFilter: NDKFilter = {
				kinds: [4],
				authors: [account.pubkey],
				since: lastLogin,
			};
			const receiveFilter: NDKFilter = {
				kinds: [4],
				"#p": [account.pubkey],
				since: lastLogin,
			};

			const sendMessages = await prefetchEvents(ndk, sendFilter);
			const receiveMessages = await prefetchEvents(ndk, receiveFilter);
			const events = [...sendMessages, ...receiveMessages];

			events.forEach((event) => {
				const receiverPubkey =
					event.tags.find((t) => t[0] === "p")[1] || account.pubkey;
				createChat(
					event.id,
					receiverPubkey,
					event.pubkey,
					event.content,
					event.tags,
					event.created_at,
				);
			});

			return true;
		} catch (e) {
			console.log("error: ", e);
		}
	}

	async function fetchChannelMessages() {
		try {
			const ids = [];
			const channels: any = await getChannels(10, 0);
			channels.forEach((channel) => {
				ids.push(channel.event_id);
			});

			const since =
				lastLogin === 0 ? dateToUnix(getHourAgo(48, now.current)) : lastLogin;

			const filter: NDKFilter = {
				"#e": ids,
				kinds: [42],
				since: since,
			};

			const events = await prefetchEvents(ndk, filter);
			events.forEach((event) => {
				const channel_id = event.tags[0][1];
				if (channel_id) {
					createChannelMessage(
						channel_id,
						event.id,
						event.pubkey,
						event.kind,
						event.content,
						event.tags,
						event.created_at,
					);
				}
			});

			return true;
		} catch (e) {
			console.log("error: ", e);
		}
	}

	useEffect(() => {
		async function prefetch() {
			const notes = await fetchNotes();
			if (notes) {
				const chats = await fetchChats();
				const channels = await fetchChannelMessages();
				if (chats && channels) {
					navigate("/app/space", { overwriteLastHistoryEntry: true });
				}
			}
		}
		prefetch();
	}, []);

	return (
		<div className="h-screen w-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white">
			<div className="relative h-full overflow-hidden">
				<div
					data-tauri-drag-region
					className="absolute left-0 top-0 z-20 h-16 w-full bg-transparent"
				/>
				<div className="relative flex h-full flex-col items-center justify-center">
					<div className="flex flex-col items-center gap-2">
						<LumeIcon className="h-16 w-16 text-black dark:text-white" />
						<div className="text-center">
							<h3 className="text-lg font-semibold leading-tight text-zinc-900 dark:text-white">
								Here&apos;s an interesting fact:
							</h3>
							<p className="font-medium text-zinc-300 dark:text-zinc-600">
								Bitcoin and Nostr can be used by anyone, and no one can stop
								you!
							</p>
						</div>
					</div>
					<div className="absolute bottom-16 left-1/2 -translate-x-1/2 transform">
						<svg
							className="h-5 w-5 animate-spin text-black dark:text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<title id="loading">Loading</title>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
}
