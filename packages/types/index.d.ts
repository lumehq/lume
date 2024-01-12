import {
	type NDKEvent,
	NDKRelayList,
	type NDKUserProfile,
} from "@nostr-dev-kit/ndk";

export interface RichContent {
	parsed: string;
	images: string[];
	videos: string[];
	links: string[];
	notes: string[];
}

export interface Account {
	id: string;
	pubkey: string;
	is_active: number;
	contacts: string[];
	relayList: string[];
}

export interface IColumn {
	id?: number;
	kind: number;
	title: string;
	content: string;
}

export interface Opengraph {
	url: string;
	title?: string;
	description?: string;
	image?: string;
}

export interface NDKEventWithReplies extends NDKEvent {
	replies: Array<NDKEvent>;
}

export interface NostrBuildResponse {
	ok: boolean;
	data?: {
		message: string;
		status: string;
		data: Array<{
			blurhash: string;
			dimensions: {
				width: number;
				height: number;
			};
			mime: string;
			name: string;
			sha256: string;
			size: number;
			url: string;
		}>;
	};
}

export interface NDKCacheUser {
	pubkey: string;
	profile: string | NDKUserProfile;
	createdAt: number;
}

export interface NDKCacheUserProfile extends NDKUserProfile {
	npub: string;
}

export interface NDKCacheEvent {
	id: string;
	pubkey: string;
	content: string;
	kind: number;
	createdAt: number;
	relay: string;
	event: string;
}

export interface NDKCacheEventTag {
	id: string;
	eventId: string;
	tag: string;
	value: string;
	tagValue: string;
}

export interface NIP11 {
	name: string;
	description: string;
	pubkey: string;
	contact: string;
	supported_nips: number[];
	software: string;
	version: string;
	limitation: {
		[key: string]: string | number | boolean;
	};
	relay_countries: string[];
	language_tags: string[];
	tags: string[];
	posting_policy: string;
	payments_url: string;
	icon: string[];
}

export interface NIP05 {
	names: {
		[key: string]: string;
	};
	nip46: {
		[key: string]: {
			[key: string]: string[];
		};
	};
}
