export interface Settings {
	notification: boolean;
	enhancedPrivacy: boolean;
	autoUpdate: boolean;
	zap: boolean;
	nsfw: boolean;
	[key: string]: string | number | boolean;
}

export interface Keys {
	npub: string;
	nsec: string;
}

export enum Kind {
	Metadata = 0,
	Text = 1,
	RecommendRelay = 2,
	Contacts = 3,
	Repost = 6,
	Reaction = 7,
	ZapReceipt = 9735,
	// NIP-89: App Metadata
	AppRecommendation = 31989,
	AppHandler = 31990,
	// #TODO: Add all nostr kinds
}

export interface Event {
	id: string;
	pubkey: string;
	created_at: number;
	kind: Kind;
	tags: string[][];
	content: string;
	sig: string;
	relay?: string;
}

export interface EventWithReplies extends Event {
	replies: Array<Event>;
}

export interface Metadata {
	name?: string;
	display_name?: string;
	about?: string;
	website?: string;
	picture?: string;
	banner?: string;
	nip05?: string;
	lud06?: string;
	lud16?: string;
}

export interface Contact {
	pubkey: string;
	profile: Metadata;
}

export interface Account {
	npub: string;
	nsec?: string;
	contacts?: string[];
	interests?: Interests;
}

export interface Topic {
	icon: string;
	title: string;
	content: string[];
}

export interface Interests {
	hashtags: string[];
	users: string[];
	words: string[];
}

export interface RichContent {
	parsed: string;
	images: string[];
	videos: string[];
	links: string[];
	notes: string[];
}

export interface AppRouteSearch {
	account: string;
}

export interface ColumnRouteSearch {
	account: string;
	label: string;
	name: string;
	redirect?: string;
}

export interface LumeColumn {
	label: string;
	name: string;
	content: URL | string;
	description?: string;
	author?: string;
	logo?: string;
	cover?: string;
	coverRetina?: string;
	featured?: boolean;
}

export interface EventColumns {
	type: "add" | "remove" | "update" | "left" | "right" | "set_title";
	label?: string;
	title?: string;
	column?: LumeColumn;
}

export interface Opengraph {
	url: string;
	title?: string;
	description?: string;
	image?: string;
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

export interface Relays {
	connected: string[];
	read: string[];
	write: string[];
	both: string[];
}
