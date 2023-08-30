import { NDKEvent, NDKUserProfile } from '@nostr-dev-kit/ndk';

export interface RichContent {
  parsed: string;
  notes: string[];
  images: string[];
  videos: string[];
  links: string[];
}

export interface DBEvent {
  id: string;
  account_id: number;
  event: string | NDKEvent;
  author: string;
  kind: number;
  root_id: string;
  reply_id: string;
  created_at: number;
  richContent?: RichContent;
}

export interface Account extends NDKUserProfile {
  id: number;
  npub: string;
  pubkey: string;
  follows: null | string[];
  network: null | string[];
  is_active: number;
  privkey?: string; // deprecated
  last_login_at: number;
}

export interface Profile extends NDKUserProfile {
  ident?: string;
  pubkey?: string;
}

export interface WidgetGroup {
  title: string;
  data: WidgetGroupItem[];
}

export interface WidgetGroupItem {
  title: string;
  kind: number;
}

export interface Widget {
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

export interface Opengraph {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

export interface NDKEventWithReplies extends NDKEvent {
  replies: Array<NDKEvent>;
}
