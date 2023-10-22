import { NDKEvent } from '@nostr-dev-kit/ndk';

export function toRawEvent(event: NDKEvent) {
  delete event.ndk;
  delete event.decrypt;
  delete event.encrypt;
  delete event.encode;
  delete event.isParamReplaceable;
  delete event.isReplaceable;
  delete event.repost;
  return event;
}
