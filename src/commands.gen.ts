
// This file was generated by [tauri-specta](https://github.com/oscartbeaumont/tauri-specta). Do not edit this file manually.

/** user-defined commands **/


export const commands = {
async getRelays() : Promise<Result<Relays, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_relays") };
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
async createAccount(name: string, about: string, picture: string, password: string) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("create_account", { name, about, picture, password }) };
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
async login(account: string, password: string) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("login", { account, password }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getProfile(id: string | null) : Promise<Result<string, string>> {
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
async getContactList() : Promise<Result<string[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_contact_list") };
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
async isContactListEmpty() : Promise<Result<boolean, null>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("is_contact_list_empty") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async checkContact(hex: string) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("check_contact", { hex }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async toggleContact(hex: string, alias: string | null) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("toggle_contact", { hex, alias }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getLumeStore(key: string) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_lume_store", { key }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async setLumeStore(key: string, content: string) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("set_lume_store", { key, content }) };
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
async loadWallet() : Promise<Result<string, string>> {
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
async zapProfile(id: string, amount: string, message: string) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("zap_profile", { id, amount, message }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async zapEvent(id: string, amount: string, message: string) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("zap_event", { id, amount, message }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async friendToFriend(npub: string) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("friend_to_friend", { npub }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getNotifications() : Promise<Result<string[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_notifications") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getSettings() : Promise<Result<Settings, null>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_settings") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async setSettings(settings: string) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("set_settings", { settings }) };
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
async getEventMeta(content: string) : Promise<Result<Meta, null>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_event_meta", { content }) };
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
async getEventFrom(id: string, relayHint: string) : Promise<Result<RichEvent, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_event_from", { id, relayHint }) };
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
async getEventsBy(publicKey: string, limit: number) : Promise<Result<RichEvent[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_events_by", { publicKey, limit }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getEventsFromContacts(until: string | null) : Promise<Result<RichEvent[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_events_from_contacts", { until }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getGroupEvents(publicKeys: string[], until: string | null) : Promise<Result<RichEvent[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_group_events", { publicKeys, until }) };
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
async getHashtagEvents(hashtags: string[], until: string | null) : Promise<Result<RichEvent[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_hashtag_events", { hashtags, until }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async search(query: string, until: string | null) : Promise<Result<RichEvent[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("search", { query, until }) };
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
async closeColumn(label: string) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("close_column", { label }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async repositionColumn(label: string, x: number, y: number) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("reposition_column", { label, x, y }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async resizeColumn(label: string, width: number, height: number) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("resize_column", { label, width, height }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async reloadColumn(label: string) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("reload_column", { label }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async openWindow(window: Window) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("open_window", { window }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async reopenLume() : Promise<void> {
    await TAURI_INVOKE("reopen_lume");
},
async quit() : Promise<void> {
    await TAURI_INVOKE("quit");
}
}

/** user-defined events **/


export const events = __makeEvents__<{
newSettings: NewSettings,
subscription: Subscription
}>({
newSettings: "new-settings",
subscription: "subscription"
})

/** user-defined constants **/



/** user-defined types **/

export type Column = { label: string; url: string; x: number; y: number; width: number; height: number }
export type Meta = { content: string; images: string[]; videos: string[]; events: string[]; mentions: string[]; hashtags: string[] }
export type NewSettings = Settings
export type Profile = { name: string; display_name: string; about: string | null; picture: string; banner: string | null; nip05: string | null; lud16: string | null; website: string | null }
export type Relays = { connected: string[]; read: string[] | null; write: string[] | null; both: string[] | null }
export type RichEvent = { raw: string; parsed: Meta | null }
export type Settings = { proxy: string | null; image_resize_service: string | null; use_relay_hint: boolean; content_warning: boolean; display_avatar: boolean; display_zap_button: boolean; display_repost_button: boolean; display_media: boolean; transparent: boolean }
export type SubKind = "Subscribe" | "Unsubscribe"
export type Subscription = { label: string; kind: SubKind; event_id: string | null }
export type Window = { label: string; title: string; url: string; width: number; height: number; maximizable: boolean; minimizable: boolean; hidden_title: boolean }

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
	emit: T extends null
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