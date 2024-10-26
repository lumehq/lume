
// This file was generated by [tauri-specta](https://github.com/oscartbeaumont/tauri-specta). Do not edit this file manually.

/** user-defined commands **/


export const commands = {
async syncAccount(id: string, reader: TAURI_CHANNEL<number>) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("sync_account", { id, reader }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async isAccountSync(id: string) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("is_account_sync", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getRelays(id: string) : Promise<Result<Relays, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_relays", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async connectRelay(relay: string) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("connect_relay", { relay }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async removeRelay(relay: string) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("remove_relay", { relay }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getBootstrapRelays() : Promise<Result<string[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_bootstrap_relays") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async saveBootstrapRelays(relays: string) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("save_bootstrap_relays", { relays }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getAccounts() : Promise<string[]> {
    return await TAURI_INVOKE("get_accounts");
},
async watchAccount(id: string) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("watch_account", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async importAccount(key: string, password: string | null) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("import_account", { key, password }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async connectAccount(uri: string) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("connect_account", { uri }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getPrivateKey(id: string) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_private_key", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async deleteAccount(id: string) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("delete_account", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async resetPassword(key: string, password: string) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("reset_password", { key, password }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async hasSigner(id: string) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("has_signer", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async setSigner(id: string) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("set_signer", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getProfile(id: string) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_profile", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async setProfile(profile: Profile) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("set_profile", { profile }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getContactList(id: string) : Promise<Result<string[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_contact_list", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async setContactList(publicKeys: string[]) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("set_contact_list", { publicKeys }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async isContact(id: string) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("is_contact", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async toggleContact(id: string, alias: string | null) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("toggle_contact", { id, alias }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getAllProfiles() : Promise<Result<Mention[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_all_profiles") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async setGroup(title: string, description: string | null, image: string | null, users: string[]) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("set_group", { title, description, image, users }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getGroup(id: string) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_group", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getAllGroups() : Promise<Result<RichEvent[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_all_groups") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async setInterest(title: string, description: string | null, image: string | null, hashtags: string[]) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("set_interest", { title, description, image, hashtags }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getInterest(id: string) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_interest", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getAllInterests() : Promise<Result<RichEvent[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_all_interests") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async setWallet(uri: string) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("set_wallet", { uri }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async loadWallet() : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("load_wallet") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async removeWallet() : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("remove_wallet") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async zapProfile(id: string, amount: string, message: string | null) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("zap_profile", { id, amount, message }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async zapEvent(id: string, amount: string, message: string | null) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("zap_event", { id, amount, message }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async copyFriend(npub: string) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("copy_friend", { npub }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getNotifications(id: string) : Promise<Result<string[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_notifications", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getUserSettings() : Promise<Result<Settings, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_user_settings") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async setUserSettings(settings: string) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("set_user_settings", { settings }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async verifyNip05(id: string, nip05: string) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("verify_nip05", { id, nip05 }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getMetaFromEvent(content: string) : Promise<Result<Meta, null>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_meta_from_event", { content }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getEvent(id: string) : Promise<Result<RichEvent, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_event", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getReplies(id: string) : Promise<Result<RichEvent[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_replies", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async subscribeTo(id: string) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("subscribe_to", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getAllEventsByAuthor(publicKey: string, limit: number) : Promise<Result<RichEvent[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_all_events_by_author", { publicKey, limit }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getAllEventsByAuthors(publicKeys: string[], until: string | null) : Promise<Result<RichEvent[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_all_events_by_authors", { publicKeys, until }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getAllEventsByHashtags(hashtags: string[], until: string | null) : Promise<Result<RichEvent[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_all_events_by_hashtags", { hashtags, until }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getLocalEvents(until: string | null) : Promise<Result<RichEvent[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_local_events", { until }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getGlobalEvents(until: string | null) : Promise<Result<RichEvent[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_global_events", { until }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async search(query: string) : Promise<Result<RichEvent[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("search", { query }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async publish(content: string, warning: string | null, difficulty: number | null) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("publish", { content, warning, difficulty }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async reply(content: string, to: string, root: string | null) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("reply", { content, to, root }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async repost(raw: string) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("repost", { raw }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async isReposted(id: string) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("is_reposted", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async requestDelete(id: string) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("request_delete", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async isDeletedEvent(id: string) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("is_deleted_event", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async eventToBech32(id: string) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("event_to_bech32", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async userToBech32(user: string) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("user_to_bech32", { user }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async createColumn(column: Column) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("create_column", { column }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async updateColumn(label: string, width: number, height: number, x: number, y: number) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("update_column", { label, width, height, x, y }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async reloadColumn(label: string) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("reload_column", { label }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async closeColumn(label: string) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("close_column", { label }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async openWindow(window: Window) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("open_window", { window }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
}
}

/** user-defined events **/


export const events = __makeEvents__<{
negentropyEvent: NegentropyEvent,
subscription: Subscription
}>({
negentropyEvent: "negentropy-event",
subscription: "subscription"
})

/** user-defined constants **/



/** user-defined types **/

export type Column = { label: string; url: string; x: number; y: number; width: number; height: number }
export type Mention = { pubkey: string; avatar: string; display_name: string; name: string }
export type Meta = { content: string; images: string[]; events: string[]; mentions: string[]; hashtags: string[] }
export type NegentropyEvent = { kind: NegentropyKind; total_event: number }
export type NegentropyKind = "Profile" | "Metadata" | "Events" | "EventIds" | "Global" | "Notification" | "Others"
export type Profile = { name: string; display_name: string; about: string | null; picture: string; banner: string | null; nip05: string | null; lud16: string | null; website: string | null }
export type Relays = { connected: string[]; read: string[] | null; write: string[] | null; both: string[] | null }
export type RichEvent = { raw: string; parsed: Meta | null }
export type Settings = { proxy: string | null; image_resize_service: string | null; use_relay_hint: boolean; content_warning: boolean; trusted_only: boolean; display_avatar: boolean; display_zap_button: boolean; display_repost_button: boolean; display_media: boolean; transparent: boolean }
export type Subscription = { label: string; kind: SubscriptionMethod; event_id: string | null; contacts: string[] | null }
export type SubscriptionMethod = "Subscribe" | "Unsubscribe"
export type Window = { label: string; title: string; url: string; width: number; height: number; maximizable: boolean; minimizable: boolean; hidden_title: boolean; closable: boolean }

/** tauri-specta globals **/

import {
	invoke as TAURI_INVOKE,
	Channel as TAURI_CHANNEL,
} from "@tauri-apps/api/core";
import * as TAURI_API_EVENT from "@tauri-apps/api/event";
import { type WebviewWindow as __WebviewWindow__ } from "@tauri-apps/api/webviewWindow";

type __EventObj__<T> = {
	listen: (
		cb: TAURI_API_EVENT.EventCallback<T>,
	) => ReturnType<typeof TAURI_API_EVENT.listen<T>>;
	once: (
		cb: TAURI_API_EVENT.EventCallback<T>,
	) => ReturnType<typeof TAURI_API_EVENT.once<T>>;
	emit: null extends T
		? (payload?: T) => ReturnType<typeof TAURI_API_EVENT.emit>
		: (payload: T) => ReturnType<typeof TAURI_API_EVENT.emit>;
};

export type Result<T, E> =
	| { status: "ok"; data: T }
	| { status: "error"; error: E };

function __makeEvents__<T extends Record<string, any>>(
	mappings: Record<keyof T, string>,
) {
	return new Proxy(
		{} as unknown as {
			[K in keyof T]: __EventObj__<T[K]> & {
				(handle: __WebviewWindow__): __EventObj__<T[K]>;
			};
		},
		{
			get: (_, event) => {
				const name = mappings[event as keyof T];

				return new Proxy((() => {}) as any, {
					apply: (_, __, [window]: [__WebviewWindow__]) => ({
						listen: (arg: any) => window.listen(name, arg),
						once: (arg: any) => window.once(name, arg),
						emit: (arg: any) => window.emit(name, arg),
					}),
					get: (_, command: keyof __EventObj__<any>) => {
						switch (command) {
							case "listen":
								return (arg: any) => TAURI_API_EVENT.listen(name, arg);
							case "once":
								return (arg: any) => TAURI_API_EVENT.once(name, arg);
							case "emit":
								return (arg: any) => TAURI_API_EVENT.emit(name, arg);
						}
					},
				});
			},
		},
	);
}
