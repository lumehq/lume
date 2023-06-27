import { prefetchEvents } from "@libs/ndk";
import {
	countTotalNotes,
	createChannelMessage,
	createChat,
	createNote,
	getChannels,
	getLastLogin,
} from "@libs/storage";
import { NDKFilter } from "@nostr-dev-kit/ndk";
import { LoaderIcon, LumeIcon } from "@shared/icons";
import { RelayContext } from "@shared/relayProvider";
import { dateToUnix, getHourAgo } from "@utils/date";
import { useAccount } from "@utils/hooks/useAccount";
import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const totalNotes = await countTotalNotes();
const lastLogin = await getLastLogin();

export function Root() {
	const ndk = useContext(RelayContext);
	const now = useRef(new Date());
	const navigate = useNavigate();

	const { status, account } = useAccount();

	async function fetchNotes() {
		try {
			const follows = JSON.parse(account.follows);
			let since: number;

			if (totalNotes === 0 || lastLogin === 0) {
				since = dateToUnix(getHourAgo(48, now.current));
			} else {
				since = lastLogin;
			}

			const filter: NDKFilter = {
				kinds: [1, 6],
				authors: follows,
				since: since,
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
			const channels: any = await getChannels();
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
				// const channels = await fetchChannelMessages();
				if (chats) {
					navigate("/app/space", { replace: true });
				}
			}
		}

		if (status === "success" && account) {
			prefetch();
		}
	}, [status]);

	return (
		<div className="h-screen w-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
			<div className="relative h-full overflow-hidden">
				<div
					data-tauri-drag-region
					className="absolute left-0 top-0 z-20 h-16 w-full bg-transparent"
				/>
				<div className="relative flex h-full flex-col items-center justify-center">
					<div className="flex flex-col items-center gap-2">
						<LumeIcon className="h-16 w-16 text-black dark:text-zinc-100" />
						<div className="text-center">
							<h3 className="text-lg font-semibold leading-tight text-zinc-900 dark:text-zinc-100">
								Here&apos;s an interesting fact:
							</h3>
							<p className="font-medium text-zinc-300 dark:text-zinc-600">
								Bitcoin and Nostr can be used by anyone, and no one can stop
								you!
							</p>
						</div>
					</div>
					<div className="absolute bottom-16 left-1/2 -translate-x-1/2 transform">
						<LoaderIcon className="h-5 w-5 animate-spin text-black dark:text-zinc-100" />
					</div>
				</div>
			</div>
		</div>
	);
}
