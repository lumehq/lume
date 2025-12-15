use nostr_sdk::prelude::*;

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub enum StateEvent {
    ReceivedContactList,
    ReceivedProfile(Box<Profile>),
}
