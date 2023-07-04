import { NDKEvent } from '@nostr-dev-kit/ndk';

export interface LumeEvent extends NDKEvent {
  event_id: string;
  parent_id: string;
}
