/// Client (or application) name.
pub const CLIENT_NAME: &str = "Lume";

/// Application ID.
pub const APP_ID: &str = "su.reya.lume";

/// Bootstrap Relays.
pub const BOOTSTRAP_RELAYS: [&str; 5] = [
    "wss://relay.damus.io",
    "wss://relay.primal.net",
    "wss://relay.nos.social",
    "wss://user.kindpag.es",
    "wss://purplepag.es",
];

/// Default relay for Nostr Connect
pub const NOSTR_CONNECT_RELAY: &str = "wss://relay.nsec.app";

/// Default timeout for Nostr Connect (seconds)
pub const NOSTR_CONNECT_TIMEOUT: u64 = 30;

/// Default width of the sidebar.
pub const DEFAULT_SIDEBAR_WIDTH: f32 = 240.;
