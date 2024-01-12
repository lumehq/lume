import { LoaderIcon } from "@lume/icons";
import { NDKCacheAdapterTauri } from "@lume/ndk-cache-tauri";
import { LumeStorage } from "@lume/storage";
import { QUOTES, delay, sendNativeNotification } from "@lume/utils";
import NDK, {
	NDKEvent,
	NDKKind,
	NDKNip46Signer,
	NDKPrivateKeySigner,
	NDKRelay,
	NDKRelayAuthPolicies,
} from "@nostr-dev-kit/ndk";
import { fetch } from "@tauri-apps/plugin-http";
import { locale, platform } from "@tauri-apps/plugin-os";
import { relaunch } from "@tauri-apps/plugin-process";
import Database from "@tauri-apps/plugin-sql";
import { check } from "@tauri-apps/plugin-updater";
import Linkify from "linkify-react";
import { normalizeRelayUrl, normalizeRelayUrlSet } from "nostr-fetch";
import { PropsWithChildren, useEffect, useState } from "react";
import { createContext, useContextSelector } from "use-context-selector";
import { Ark } from "./ark";

type Context = {
	storage: LumeStorage;
	ark: Ark;
};

const LumeContext = createContext<Context>({
	storage: undefined,
	ark: undefined,
});

const LumeProvider = ({ children }: PropsWithChildren<object>) => {
	const [context, setContext] = useState<Context>(undefined);
	const [isNewVersion, setIsNewVersion] = useState(false);

	async function initNostrSigner({
		storage,
		nsecbunker,
	}: {
		storage: LumeStorage;
		nsecbunker?: boolean;
	}) {
		try {
			if (!storage.account) return null;

			// NIP-46 Signer
			if (nsecbunker) {
				const localSignerPrivkey = await storage.loadPrivkey(
					storage.account.pubkey,
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
					storage.account.pubkey,
					localSigner,
				);
				await remoteSigner.blockUntilReady();

				return remoteSigner;
			}

			// Privkey Signer
			const userPrivkey = await storage.loadPrivkey(storage.account.pubkey);

			if (!userPrivkey) {
				return null;
			}

			return new NDKPrivateKeySigner(userPrivkey);
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	async function init() {
		const platformName = await platform();
		const osLocale = await locale();
		const sqliteAdapter = await Database.load("sqlite:lume_v3.db");

		const storage = new LumeStorage(sqliteAdapter, platformName, osLocale);
		await storage.init();

		// check for new update
		if (storage.settings.autoupdate) {
			const update = await check();
			// install new version
			if (update) {
				setIsNewVersion(true);

				await update.downloadAndInstall();
				await relaunch();
			}
		}

		const explicitRelayUrls = normalizeRelayUrlSet([
			"wss://bostr.nokotaro.com/",
			"wss://nostr.mutinywallet.com",
		]);

		if (storage.settings.depot) {
			await storage.launchDepot();
			await delay(2000);

			explicitRelayUrls.push(normalizeRelayUrl("ws://localhost:6090"));
		}

		// #TODO: user should config outbox relays
		const outboxRelayUrls = normalizeRelayUrlSet(["wss://purplepag.es"]);

		// #TODO: user should config blacklist relays
		// No need to connect depot tunnel url
		const blacklistRelayUrls = storage.settings.tunnelUrl.length
			? [storage.settings.tunnelUrl, `${storage.settings.tunnelUrl}/`]
			: [];

		const cacheAdapter = new NDKCacheAdapterTauri(storage);
		const ndk = new NDK({
			cacheAdapter,
			explicitRelayUrls,
			outboxRelayUrls,
			blacklistRelayUrls,
			enableOutboxModel: !storage.settings.lowPower,
			autoConnectUserRelays: !storage.settings.lowPower,
			autoFetchUserMutelist: !storage.settings.lowPower,
			// clientName: 'Lume',
			// clientNip89: '',
		});

		// use tauri fetch
		ndk.httpFetch = fetch;

		// add signer
		const signer = await initNostrSigner({
			storage,
			nsecbunker: storage.settings.bunker,
		});

		if (signer) ndk.signer = signer;

		// connect
		await ndk.connect(3000);

		// auth
		ndk.relayAuthDefaultPolicy = async (relay: NDKRelay, challenge: string) => {
			const signIn = NDKRelayAuthPolicies.signIn({ ndk });
			const event = await signIn(relay, challenge).catch((e) => console.log(e));
			if (event) {
				sendNativeNotification(
					`You've sign in sucessfully to relay: ${relay.url}`,
				);
				return event;
			}
		};

		// update account's metadata
		if (storage.account) {
			const user = ndk.getUser({ pubkey: storage.account.pubkey });
			ndk.activeUser = user;

			const contacts = await user.follows();
			storage.account.contacts = [...contacts].map((user) => user.pubkey);

			// subscribe for new activity
			const sub = ndk.subscribe(
				{
					kinds: [NDKKind.Text, NDKKind.Repost, NDKKind.Zap],
					"#p": [storage.account.pubkey],
					since: Math.floor(Date.now() / 1000),
				},
				{ closeOnEose: false, groupable: false },
			);

			sub.addListener("event", async (event: NDKEvent) => {
				const profile = await ark.getUserProfile(event.pubkey);
				switch (event.kind) {
					case NDKKind.Text:
						return await sendNativeNotification(
							`${
								profile.displayName || profile.name || "anon"
							} has replied to your note`,
						);
					case NDKKind.Repost:
						return await sendNativeNotification(
							`${
								profile.displayName || profile.name || "anon"
							} has reposted to your note`,
						);
					case NDKKind.Zap:
						return await sendNativeNotification(
							`${
								profile.displayName || profile.name || "anon"
							} has zapped to your note`,
						);
					default:
						break;
				}
			});
		}

		// ark utils
		const ark = new Ark({ storage, ndk });

		// update context
		setContext({ ark, storage });
	}

	useEffect(() => {
		if (!context && !isNewVersion) init();
	}, []);

	if (!context) {
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
					<p className="font-semibold">
						{isNewVersion ? "Found a new version, updating..." : "Starting..."}
					</p>
				</div>
			</div>
		);
	}

	return (
		<LumeContext.Provider
			value={{ ark: context.ark, storage: context.storage }}
		>
			{children}
		</LumeContext.Provider>
	);
};

const useArk = () => {
	const context = useContextSelector(LumeContext, (state) => state.ark);
	if (context === undefined) {
		throw new Error("Please import Ark Provider to use useArk() hook");
	}
	return context;
};

const useStorage = () => {
	const context = useContextSelector(LumeContext, (state) => state.storage);
	if (context === undefined) {
		throw new Error("Please import Ark Provider to use useStorage() hook");
	}
	return context;
};

export { LumeProvider, useArk, useStorage };
