import { Metadata } from "@lume/types";
import { Result, commands } from "./commands";
import { Window } from "@tauri-apps/api/window";

export class NostrAccount {
	static async getAccounts() {
		const query = await commands.getAccounts();

		if (query.status === "ok") {
			return query.data;
		} else {
			return [];
		}
	}

	static async loadAccount(npub: string) {
		const bunker: string = localStorage.getItem(`${npub}_bunker`);
		let query: Result<boolean, string>;

		if (bunker?.length && bunker?.startsWith("bunker://")) {
			query = await commands.loadAccount(npub, bunker);
		} else {
			query = await commands.loadAccount(npub, null);
		}

		if (query.status === "ok") {
			const panel = Window.getByLabel("panel");
			panel.emit("load-notification", { account: npub }); // trigger load notification

			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	static async createAccount() {
		const query = await commands.createAccount();

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	static async createProfile(profile: Metadata) {
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
	}

	static async saveAccount(nsec: string, password = "") {
		const query = await commands.saveAccount(nsec, password);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	static async connectRemoteAccount(uri: string) {
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
	}

	static async setContactList(pubkeys: string[]) {
		const query = await commands.setContactList(pubkeys);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	static async setWallet(uri: string) {
		const query = await commands.setNwc(uri);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	static async getProfile() {
		const query = await commands.getCurrentUserProfile();

		if (query.status === "ok") {
			return JSON.parse(query.data) as Metadata;
		} else {
			return null;
		}
	}

	static async getBalance() {
		const query = await commands.getBalance();

		if (query.status === "ok") {
			return parseInt(query.data);
		} else {
			return 0;
		}
	}

	static async getContactList() {
		const query = await commands.getContactList();

		if (query.status === "ok") {
			return query.data;
		} else {
			return [];
		}
	}

	static async follow(pubkey: string, alias?: string) {
		const query = await commands.follow(pubkey, alias);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	static async unfollow(pubkey: string) {
		const query = await commands.unfollow(pubkey);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	static async f2f(npub: string) {
		const query = await commands.friendToFriend(npub);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}
}
