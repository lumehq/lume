import { type NDKEvent, type NDKUserProfile } from '@nostr-dev-kit/ndk';
import { type Response } from '@tauri-apps/plugin-http';

export interface RichContent {
  parsed: string;
  images: string[];
  videos: string[];
  links: string[];
  notes: string[];
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
  id: string;
  pubkey: string;
  follows: null | string[];
  circles: null | string[];
  is_active: number;
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
  description: string;
  kind: number;
  icon?: string;
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

export interface NostrBuildResponse extends Response {
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

export interface Resource {
  id: string;
  title: string;
  image: string;
}

export interface Resources {
  title: string;
  data: Array<Resource>;
}

export interface NDKCacheUser {
  pubkey: string;
  profile: string | NDKUserProfile;
  createdAt: number;
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
