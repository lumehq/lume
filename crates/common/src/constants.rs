pub const CLIENT_NAME: &str = "Lume";
pub const APP_ID: &str = "su.reya.lume";

/// Bootstrap Relays.
pub const BOOTSTRAP_RELAYS: [&str; 5] = [
    "wss://relay.damus.io",
    "wss://relay.primal.net",
    "wss://relay.nos.social",
    "wss://user.kindpag.es",
    "wss://purplepag.es",
];

/// Search Relays.
pub const SEARCH_RELAYS: [&str; 3] = [
    "wss://relay.nostr.band",
    "wss://search.nos.today",
    "wss://relay.noswhere.com",
];

/// Default relay for Nostr Connect
pub const NOSTR_CONNECT_RELAY: &str = "wss://relay.nsec.app";

/// Default width of the sidebar.
pub const DEFAULT_SIDEBAR_WIDTH: f32 = 240.;
