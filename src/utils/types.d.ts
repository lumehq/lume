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

export interface Account {
  id: number;
  npub: string;
  pubkey: string;
  privkey: string;
  follows: string[] | string;
  is_active: number;
}

export interface Profile extends NDKUserProfile {
  ident?: string;
  pubkey?: string;
}

export interface Block {
  id: string;
  account_id: number;
  kind: number;
  title: string;
  content: string;
}

export interface Chats {
  id: string;
  event_id: string;
  receiver_pubkey: string;
  sender_pubkey: string;
  content: string;
  tags: string[][];
  created_at: number;
  new_messages: number;
}

export interface Settings {
  id: string;
  key: string;
  value: string;
}
