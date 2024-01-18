import { LoaderIcon } from "@lume/icons";
import { NDKCacheAdapterTauri } from "@lume/ndk-cache-tauri";
import { useStorage } from "@lume/storage";
import {
	FETCH_LIMIT,
	QUOTES,
	activityUnreadAtom,
	sendNativeNotification,
} from "@lume/utils";
import NDK, {
	NDKEvent,
	NDKKind,
	NDKNip46Signer,
	NDKPrivateKeySigner,
	NDKRelay,
	NDKRelayAuthPolicies,
	NDKUser,
} from "@nostr-dev-kit/ndk";
import { useQueryClient } from "@tanstack/react-query";
import { message } from "@tauri-apps/plugin-dialog";
import { fetch } from "@tauri-apps/plugin-http";
import { useSetAtom } from "jotai";
import Linkify from "linkify-react";
import { normalizeRelayUrlSet } from "nostr-fetch";
import { PropsWithChildren, useEffect, useState } from "react";
import { Ark } from "./ark";
import { LumeContext } from "./context";

export const LumeProvider = ({ children }: PropsWithChildren<object>) => {
	const storage = useStorage();
	const queryClient = useQueryClient();
	const setUnreadActivity = useSetAtom(activityUnreadAtom);

	const [ark, setArk] = useState<Ark>(undefined);
	const [ndk, setNDK] = useState<NDK>(undefined);

	async function initNostrSigner({
		nsecbunker,
	}: {
		nsecbunker?: boolean;
	}) {
		try {
			if (!storage.currentUser) return null;

			// NIP-46 Signer
			if (nsecbunker) {
				const localSignerPrivkey = await storage.loadPrivkey(
					storage.currentUser.pubkey,
				);

				if (!localSignerPrivkey) return null;

				const localSigner = new NDKPrivateKeySigner(localSignerPrivkey);
				const bunker = new NDK({
					explicitRelayUrls: normalizeRelayUrlSet([
						"wss://relay.nsecbunker.com/",
						"wss://nostr.vulpem.com/",
					]),
				});
				await bunker.connect(2000);

				const remoteSigner = new NDKNip46Signer(
					bunker,
					storage.currentUser.pubkey,
					localSigner,
				);
				await remoteSigner.blockUntilReady();

				return remoteSigner;
			}

			// Privkey Signer
			const userPrivkey = await storage.loadPrivkey(storage.currentUser.pubkey);
			if (!userPrivkey) return null;

			// load nwc
			storage.nwc = await storage.loadPrivkey(
				`${storage.currentUser.pubkey}.nwc`,
			);

			return new NDKPrivateKeySigner(userPrivkey);
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	async function initNDK() {
		const explicitRelayUrls = normalizeRelayUrlSet([
			"wss://bostr.nokotaro.com/",
			"wss://nostr.mutinywallet.com/",
		]);

		// #TODO: user should config outbox relays
		const outboxRelayUrls = normalizeRelayUrlSet(["wss://purplepag.es/"]);

		// #TODO: user should config blacklist relays
		// Skip connect depot tunnel url
		const blacklistRelayUrls = normalizeRelayUrlSet(
			storage.settings.tunnelUrl.length
				? [storage.settings.tunnelUrl, "wss://brb.io/"]
				: ["wss://brb.io/"],
		);

		const tauriCache = new NDKCacheAdapterTauri(storage);
		const ndk = new NDK({
			cacheAdapter: tauriCache,
			explicitRelayUrls,
			outboxRelayUrls,
			blacklistRelayUrls,
			enableOutboxModel: !storage.settings.lowPower,
			autoConnectUserRelays: !storage.settings.lowPower,
			autoFetchUserMutelist: !storage.settings.lowPower,
			clientName: "Lume",
			// clientNip89: '',
		});

		// use tauri fetch
		ndk.httpFetch = fetch;

		// add signer
		const signer = await initNostrSigner({
			nsecbunker: storage.settings.nsecbunker,
		});

		if (signer) ndk.signer = signer;

		// connect
		await ndk.connect(3000);

		// auth
		ndk.relayAuthDefaultPolicy = async (relay: NDKRelay, challenge: string) => {
			const signIn = NDKRelayAuthPolicies.signIn({ ndk });
			const event = await signIn(relay, challenge).catch((e) =>
				console.log("auth failed", e),
			);
			if (event) {
				await sendNativeNotification(
					`You've sign in sucessfully to relay: ${relay.url}`,
				);
				return event;
			}
		};

		setNDK(ndk);
	}

	async function initArk() {
		if (!ndk) await message("Something wrong!", { type: "error" });

		// ark utils
		const ark = new Ark({ ndk, account: storage.currentUser });

		if (ndk && storage.currentUser) {
			const user = new NDKUser({ pubkey: storage.currentUser.pubkey });
			ndk.activeUser = user;

			// update contacts
			await ark.getUserContacts();

			// subscribe for new activity
			const activitySub = ndk.subscribe(
				{
					kinds: [NDKKind.Text, NDKKind.Repost, NDKKind.Zap],
					since: Math.floor(Date.now() / 1000),
					"#p": [ark.account.pubkey],
				},
				{ closeOnEose: false, groupable: false },
			);

			activitySub.addListener("event", async (event: NDKEvent) => {
				setUnreadActivity((state) => state + 1);
				const profile = await ark.getUserProfile(event.pubkey);
				switch (event.kind) {
					case NDKKind.Text:
						return await sendNativeNotification(
							`${
								profile.displayName || profile.name || "Anon"
							} has replied to your note`,
						);
					case NDKKind.Repost:
						return await sendNativeNotification(
							`${
								profile.displayName || profile.name || "Anon"
							} has reposted to your note`,
						);
					case NDKKind.Zap:
						return await sendNativeNotification(
							`${
								profile.displayName || profile.name || "Anon"
							} has zapped to your note`,
						);
					default:
						break;
				}
			});

			// prefetch activty
			await queryClient.prefetchInfiniteQuery({
				queryKey: ["activity"],
				initialPageParam: 0,
				queryFn: async ({
					signal,
					pageParam,
				}: {
					signal: AbortSignal;
					pageParam: number;
				}) => {
					const events = await ark.getInfiniteEvents({
						filter: {
							kinds: [NDKKind.Text, NDKKind.Repost, NDKKind.Zap],
							"#p": [ark.account.pubkey],
						},
						limit: FETCH_LIMIT,
						pageParam,
						signal,
					});

					return events;
				},
			});

			// prefetch timeline
			await queryClient.prefetchInfiniteQuery({
				queryKey: ["timeline-9999"],
				initialPageParam: 0,
				queryFn: async ({
					signal,
					pageParam,
				}: {
					signal: AbortSignal;
					pageParam: number;
				}) => {
					const events = await ark.getInfiniteEvents({
						filter: {
							kinds: [NDKKind.Text, NDKKind.Repost],
							authors: ark.account.contacts,
						},
						limit: FETCH_LIMIT,
						pageParam,
						signal,
					});

					return events;
				},
			});
		}

		setArk(ark);
	}

	useEffect(() => {
		if (ndk) initArk();
	}, [ndk]);

	useEffect(() => {
		if (!ark && !ndk) initNDK();
	}, []);

	if (!ark) {
		return (
			<div
				data-tauri-drag-region
				className="relative flex items-center justify-center w-screen h-screen bg-neutral-50 dark:bg-neutral-950"
			>
				<div className="flex flex-col items-start max-w-2xl gap-1">
					<h5 className="font-semibold uppercase">TIP:</h5>
					<Linkify
						options={{
							target: "_blank",
							className: "text-blue-500 hover:text-blue-600",
						}}
					>
						<div className="text-4xl font-semibold leading-snug text-neutral-300 dark:text-neutral-700">
							{QUOTES[Math.floor(Math.random() * QUOTES.length)]}
						</div>
					</Linkify>
				</div>
				<div className="absolute bottom-5 right-5 inline-flex items-center gap-2.5">
					<LoaderIcon className="w-6 h-6 text-blue-500 animate-spin" />
					<p className="font-semibold">Starting</p>
				</div>
			</div>
		);
	}

	return <LumeContext.Provider value={ark}>{children}</LumeContext.Provider>;
};
