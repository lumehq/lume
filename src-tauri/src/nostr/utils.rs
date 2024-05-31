use nostr_sdk::Event;

pub fn get_latest_event(events: &[Event]) -> Option<&Event> {
  events.iter().max_by_key(|event| event.created_at())
}
