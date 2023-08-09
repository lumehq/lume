import { NDKEvent, NDKUserProfile } from '@nostr-dev-kit/ndk';

export interface Content {
  original: string;
  parsed: string;
  notes: string[];
  images: string[];
  videos: string[];
  links: string[];
}

export interface LumeEvent extends NDKEvent {
  event_id?: string;
  parent_id?: string;
  replies?: LumeEvent[];
  content: Content;
}

export interface Account extends NDKUserProfile {
  id: number;
  npub: string;
  pubkey: string;
  follows: null | string[];
  network: null | string[];
  is_active: number;
  privkey?: string; // deprecated
}

export interface Profile extends NDKUserProfile {
  ident?: string;
  pubkey?: string;
}

export interface Block {
  id?: string;
  account_id?: number;
  kind: number;
  title: string;
  content: string;
}

export interface Chats {
  id: string;
  event_id?: string;
  receiver_pubkey: string;
  sender_pubkey: string;
  content: string;
  tags: string[][];
  created_at: number;
  new_messages?: number;
}

export interface Settings {
  id: string;
  key: string;
  value: string;
}

export interface Relays {
  id?: string;
  account_id?: number;
  relay: string;
  purpose?: string;
}
