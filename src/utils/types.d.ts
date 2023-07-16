import { NDKEvent } from '@nostr-dev-kit/ndk';

export interface LumeEvent extends NDKEvent {
  event_id: string;
  parent_id: string;
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
