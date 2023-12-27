import { LumeStorage } from "@lume/storage";
import { type NDKEventWithReplies, type NIP05 } from "@lume/types";
import NDK, {
	NDKEvent,
	NDKFilter,
	NDKKind,
	NDKNip46Signer,
	NDKPrivateKeySigner,
	NDKRelay,
	NDKSubscriptionCacheUsage,
	NDKTag,
	NDKUser,
	NostrEvent,
} from "@nostr-dev-kit/ndk";
import { open } from "@tauri-apps/plugin-dialog";
import { readBinaryFile } from "@tauri-apps/plugin-fs";
import { fetch } from "@tauri-apps/plugin-http";
import { NostrFetcher, normalizeRelayUrl } from "nostr-fetch";
import { nip19 } from "nostr-tools";

export class Ark {
	#storage: LumeStorage;
	#fetcher: NostrFetcher;
	public ndk: NDK;

	constructor({
		ndk,
		storage,

		fetcher,
	}: {
		ndk: NDK;
		storage: LumeStorage;
		fetcher: NostrFetcher;
	}) {
		this.ndk = ndk;
		this.#storage = storage;
		this.#fetcher = fetcher;
	}

	public async connectDepot() {
		return this.ndk.addExplicitRelay(
			new NDKRelay(normalizeRelayUrl("ws://localhost:6090")),
			undefined,
			true,
		);
	}

	public updateNostrSigner({
		signer,
	}: { signer: NDKNip46Signer | NDKPrivateKeySigner }) {
		this.ndk.signer = signer;
		return this.ndk.signer;
	}

	public subscribe({
		filter,
		closeOnEose = false,
		cb,
	}: {
		filter: NDKFilter;
		closeOnEose: boolean;
		cb: (event: NDKEvent) => void;
	}) {
		const sub = this.ndk.subscribe(filter, { closeOnEose });
		sub.addListener("event", (event: NDKEvent) => cb(event));
		return sub;
	}

	public async createEvent({
		kind,
		tags,
		content,
		rootReplyTo = undefined,
		replyTo = undefined,
	}: {
		kind: NDKKind | number;
		tags: NDKTag[];
		content?: string;
		rootReplyTo?: string;
		replyTo?: string;
	}) {
		try {
			const event = new NDKEvent(this.ndk);
			if (content) event.content = content;
			event.kind = kind;
			event.tags = tags;

			if (rootReplyTo) {
				const rootEvent = await this.ndk.fetchEvent(rootReplyTo);
				if (rootEvent) event.tag(rootEvent, "root");
			}

			if (replyTo) {
				const replyEvent = await this.ndk.fetchEvent(replyTo);
				if (replyEvent) event.tag(replyEvent, "reply");
			}

			const publish = await event.publish();

			if (!publish) throw new Error("Failed to publish event");
			return {
				id: event.id,
				seens: [...publish.values()].map((item) => item.url),
			};
		} catch (e) {
			throw new Error(e);
		}
	}

	public async getUserProfile({ pubkey }: { pubkey: string }) {
		try {
			// get clean pubkey without any special characters
			let hexstring = pubkey.replace(/[^a-zA-Z0-9]/g, "");

			if (
				hexstring.startsWith("npub1") ||
				hexstring.startsWith("nprofile1") ||
				hexstring.startsWith("naddr1")
			) {
				const decoded = nip19.decode(hexstring);

				if (decoded.type === "nprofile") hexstring = decoded.data.pubkey;
				if (decoded.type === "npub") hexstring = decoded.data;
				if (decoded.type === "naddr") hexstring = decoded.data.pubkey;
			}

			const user = this.ndk.getUser({ pubkey: hexstring });

			const profile = await user.fetchProfile({
				cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
			});

			if (!profile) return null;
			return profile;
		} catch (e) {
			throw new Error(e);
		}
	}

	public async getUserContacts({
		pubkey = undefined,
		outbox = undefined,
	}: {
		pubkey?: string;
		outbox?: boolean;
	}) {
		try {
			const user = this.ndk.getUser({
				pubkey: pubkey ? pubkey : this.#storage.account.pubkey,
			});
			const contacts = [...(await user.follows(undefined, outbox))].map(
				(user) => user.pubkey,
			);

			if (pubkey === this.#storage.account.pubkey)
				this.#storage.account.contacts = contacts;
			return contacts;
		} catch (e) {
			throw new Error(e);
		}
	}

	public async getUserRelays({ pubkey }: { pubkey?: string }) {
		try {
			const user = this.ndk.getUser({
				pubkey: pubkey ? pubkey : this.#storage.account.pubkey,
			});
			return await user.relayList();
		} catch (e) {
			throw new Error(e);
		}
	}

	public async newContactList({ tags }: { tags: NDKTag[] }) {
		const publish = await this.createEvent({
			kind: NDKKind.Contacts,
			tags: tags,
		});

		if (publish) {
			this.#storage.account.contacts = tags.map((item) => item[1]);
			return publish;
		}
	}

	public async createContact({ pubkey }: { pubkey: string }) {
		const user = this.ndk.getUser({ pubkey: this.#storage.account.pubkey });
		const contacts = await user.follows();
		return await user.follow(new NDKUser({ pubkey: pubkey }), contacts);
	}

	public async deleteContact({ pubkey }: { pubkey: string }) {
		const user = this.ndk.getUser({ pubkey: this.#storage.account.pubkey });
		const contacts = await user.follows();
		contacts.delete(new NDKUser({ pubkey: pubkey }));

		const event = new NDKEvent(this.ndk);
		event.content = "";
		event.kind = NDKKind.Contacts;
		event.tags = [...contacts].map((item) => [
			"p",
			item.pubkey,
			item.relayUrls?.[0] || "",
			"",
		]);

		return await event.publish();
	}

	public async getAllEvents({ filter }: { filter: NDKFilter }) {
		const events = await this.ndk.fetchEvents(filter);
		if (!events) return [];
		return [...events];
	}

	public async getEventById({ id }: { id: string }) {
		let eventId: string = id;

		if (
			eventId.startsWith("nevent1") ||
			eventId.startsWith("note1") ||
			eventId.startsWith("naddr1")
		) {
			const decode = nip19.decode(eventId);

			if (decode.type === "nevent") eventId = decode.data.id;
			if (decode.type === "note") eventId = decode.data;

			if (decode.type === "naddr") {
				return await this.ndk.fetchEvent({
					kinds: [decode.data.kind],
					"#d": [decode.data.identifier],
					authors: [decode.data.pubkey],
				});
			}
		}

		return await this.ndk.fetchEvent(id, {
			cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
		});
	}

	public async getEventByFilter({ filter }: { filter: NDKFilter }) {
		const event = await this.ndk.fetchEvent(filter, {
			cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
		});

		if (!event) return null;
		return event;
	}

	public getEventThread({ tags }: { tags: NDKTag[] }) {
		let rootEventId: string = null;
		let replyEventId: string = null;

		const events = tags.filter((el) => el[0] === "e");

		if (!events.length) return null;

		if (events.length === 1)
			return {
				rootEventId: events[0][1],
				replyEventId: null,
			};

		if (events.length > 1) {
			rootEventId = events.find((el) => el[3] === "root")?.[1];
			replyEventId = events.find((el) => el[3] === "reply")?.[1];

			if (!rootEventId && !replyEventId) {
				rootEventId = events[0][1];
				replyEventId = events[1][1];
			}
		}

		return {
			rootEventId,
			replyEventId,
		};
	}

	public async getThreads({
		id,
		data,
	}: { id: string; data?: NDKEventWithReplies[] }) {
		let events = data || null;

		if (!data) {
			const relayUrls = [...this.ndk.pool.relays.values()].map(
				(item) => item.url,
			);
			const rawEvents = (await this.#fetcher.fetchAllEvents(
				relayUrls,
				{
					kinds: [NDKKind.Text],
					"#e": [id],
				},
				{ since: 0 },
				{ sort: true },
			)) as unknown as NostrEvent[];
			events = rawEvents.map(
				(event) => new NDKEvent(this.ndk, event),
			) as NDKEvent[] as NDKEventWithReplies[];
		}

		if (events.length > 0) {
			const replies = new Set();
			for (const event of events) {
				const tags = event.tags.filter((el) => el[0] === "e" && el[1] !== id);
				if (tags.length > 0) {
					for (const tag of tags) {
						const rootIndex = events.findIndex((el) => el.id === tag[1]);
						if (rootIndex !== -1) {
							const rootEvent = events[rootIndex];
							if (rootEvent?.replies) {
								rootEvent.replies.push(event);
							} else {
								rootEvent.replies = [event];
							}
							replies.add(event.id);
						}
					}
				}
			}
			const cleanEvents = events.filter((ev) => !replies.has(ev.id));
			return cleanEvents;
		}

		return events;
	}

	public async getAllRelaysFromContacts() {
		const LIMIT = 1;
		const connectedRelays = this.ndk.pool
			.connectedRelays()
			.map((item) => item.url);
		const relayMap = new Map<string, string[]>();
		const relayEvents = this.#fetcher.fetchLatestEventsPerAuthor(
			{
				authors: this.#storage.account.contacts,
				relayUrls: connectedRelays,
			},
			{ kinds: [NDKKind.RelayList] },
			LIMIT,
		);

		for await (const { author, events } of relayEvents) {
			if (events[0]) {
				for (const tag of events[0].tags) {
					const users = relayMap.get(tag[1]);

					if (!users) relayMap.set(tag[1], [author]);
					users.push(author);
				}
			}
		}

		return relayMap;
	}

	public async getInfiniteEvents({
		filter,
		limit,
		pageParam = 0,
		signal = undefined,
		dedup = true,
	}: {
		filter: NDKFilter;
		limit: number;
		pageParam?: number;
		signal?: AbortSignal;
		dedup?: boolean;
	}) {
		const rootIds = new Set();
		const dedupQueue = new Set();
		const connectedRelays = this.ndk.pool
			.connectedRelays()
			.map((item) => item.url);

		const events = await this.#fetcher.fetchLatestEvents(
			connectedRelays,
			filter,
			limit,
			{
				asOf: pageParam === 0 ? undefined : pageParam,
				abortSignal: signal,
			},
		);

		const ndkEvents = events.map((event) => {
			return new NDKEvent(this.ndk, event);
		});

		if (dedup) {
			for (const event of ndkEvents) {
				const tags = event.tags.filter((el) => el[0] === "e");

				if (tags && tags.length > 0) {
					const rootId = tags.filter((el) => el[3] === "root")[1] ?? tags[0][1];

					if (rootIds.has(rootId)) {
						dedupQueue.add(event.id);
						break;
					}

					rootIds.add(rootId);
				}
			}

			return ndkEvents
				.filter((event) => !dedupQueue.has(event.id))
				.sort((a, b) => b.created_at - a.created_at);
		}

		return ndkEvents.sort((a, b) => b.created_at - a.created_at);
	}

	public async getRelayEvents({
		relayUrl,
		filter,
		limit,
		pageParam = 0,
		signal = undefined,
	}: {
		relayUrl: string;
		filter: NDKFilter;
		limit: number;
		pageParam?: number;
		signal?: AbortSignal;
		dedup?: boolean;
	}) {
		const events = await this.#fetcher.fetchLatestEvents(
			[normalizeRelayUrl(relayUrl)],
			filter,
			limit,
			{
				asOf: pageParam === 0 ? undefined : pageParam,
				abortSignal: signal,
			},
		);

		const ndkEvents = events.map((event) => {
			return new NDKEvent(this.ndk, event);
		});

		return ndkEvents.sort((a, b) => b.created_at - a.created_at);
	}

	/**
	 * Upload media file to nostr.build
	 * @todo support multiple backends
	 */
	public async upload({ fileExts }: { fileExts?: string[] }) {
		const defaultExts = ["png", "jpeg", "jpg", "gif"].concat(fileExts);

		const selected = await open({
			multiple: false,
			filters: [
				{
					name: "Image",
					extensions: defaultExts,
				},
			],
		});

		if (!selected) return null;

		const file = await readBinaryFile(selected.path);
		const blob = new Blob([file]);

		const data = new FormData();
		data.append("fileToUpload", blob);
		data.append("submit", "Upload Image");

		const res = await fetch("https://nostr.build/api/v2/upload/files", {
			method: "POST",
			body: data,
		});

		if (!res.ok) return null;

		const json = await res.json();
		const content = json.data[0];

		return content.url as string;
	}

	public async validateNIP05({
		pubkey,
		nip05,
		signal,
	}: {
		pubkey: string;
		nip05: string;
		signal?: AbortSignal;
	}) {
		const localPath = nip05.split("@")[0];
		const service = nip05.split("@")[1];
		const verifyURL = `https://${service}/.well-known/nostr.json?name=${localPath}`;

		const res = await fetch(verifyURL, {
			method: "GET",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			signal,
		});

		if (!res.ok) throw new Error(`Failed to fetch NIP-05 service: ${nip05}`);

		const data: NIP05 = await res.json();

		if (!data.names) return false;

		if (data.names[localPath.toLowerCase()] === pubkey) return true;
		if (data.names[localPath] === pubkey) return true;

		return false;
	}

	public async replyTo({
		content,
		event,
	}: { content: string; event: NDKEvent }) {
		try {
			const replyEvent = new NDKEvent(this.ndk);
			replyEvent.content = content;
			replyEvent.kind = NDKKind.Text;
			replyEvent.tag(event, "reply");

			return await replyEvent.publish();
		} catch (e) {
			throw new Error(e);
		}
	}
}
