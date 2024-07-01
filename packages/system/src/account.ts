import type { Metadata } from "@lume/types";
import { type Result, commands } from "./commands";

export const NostrAccount = {
	getAccounts: async () => {
		const query = await commands.getAccounts();

		if (query.status === "ok") {
			return query.data;
		} else {
			return [];
		}
	},
	loadAccount: async (npub: string) => {
		const bunker: string = localStorage.getItem(`${npub}_bunker`);
		let query: Result<boolean, string>;

		if (bunker?.length && bunker?.startsWith("bunker://")) {
			query = await commands.loadAccount(npub, bunker);
		} else {
			query = await commands.loadAccount(npub, null);
		}

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	},
	createAccount: async () => {
		const query = await commands.createAccount();

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	},
	createProfile: async (profile: Metadata) => {
		const query = await commands.createProfile(
			profile.name || "",
			profile.display_name || "",
			profile.about || "",
			profile.picture || "",
			profile.banner || "",
			profile.nip05 || "",
			profile.lud16 || "",
			profile.website || "",
		);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	},
	saveAccount: async (nsec: string, password = "") => {
		const query = await commands.saveAccount(nsec, password);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	},
	connectRemoteAccount: async (uri: string) => {
		const connect = await commands.connectRemoteAccount(uri);

		if (connect.status === "ok") {
			const npub = connect.data;
			const parsed = new URL(uri);
			parsed.searchParams.delete("secret");

			// save connection string
			localStorage.setItem(`${npub}_bunker`, parsed.toString());

			return npub;
		} else {
			throw new Error(connect.error);
		}
	},
	setContactList: async (pubkeys: string[]) => {
		const query = await commands.setContactList(pubkeys);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	},
	loadWallet: async () => {
		const query = await commands.loadWallet();

		if (query.status === "ok") {
			return Number.parseInt(query.data);
		} else {
			throw new Error(query.error);
		}
	},
	setWallet: async (uri: string) => {
		const query = await commands.setWallet(uri);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	},
	removeWallet: async () => {
		const query = await commands.removeWallet();

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	},
	getProfile: async () => {
		const query = await commands.getCurrentProfile();

		if (query.status === "ok") {
			return JSON.parse(query.data) as Metadata;
		} else {
			return null;
		}
	},
	getContactList: async () => {
		const query = await commands.getContactList();

		if (query.status === "ok") {
			return query.data;
		} else {
			return [];
		}
	},
	isContactListEmpty: async () => {
		const query = await commands.isContactListEmpty();

		if (query.status === "ok") {
			return query.data;
		} else {
			return true;
		}
	},
	checkContact: async (pubkey: string) => {
		const query = await commands.checkContact(pubkey);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	},
	toggleContact: async (pubkey: string, alias?: string) => {
		const query = await commands.toggleContact(pubkey, alias);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	},
	f2f: async (npub: string) => {
		const query = await commands.friendToFriend(npub);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	},
};
