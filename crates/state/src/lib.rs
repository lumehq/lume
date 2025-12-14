use std::sync::OnceLock;
use std::time::Duration;

use common::config_dir;
pub use event::*;
use nostr_gossip_memory::prelude::*;
use nostr_lmdb::NostrLmdb;
use nostr_sdk::prelude::*;

mod event;

static NOSTR_CLIENT: OnceLock<Client> = OnceLock::new();

pub fn client() -> &'static Client {
    NOSTR_CLIENT.get_or_init(|| {
        // rustls uses the `aws_lc_rs` provider by default
        // This only errors if the default provider has already
        // been installed. We can ignore this `Result`.
        rustls::crypto::aws_lc_rs::default_provider()
            .install_default()
            .ok();

        // Construct the nostr client options
        let opts = ClientOptions::new()
            .automatic_authentication(false)
            .verify_subscriptions(false)
            .sleep_when_idle(SleepWhenIdle::Enabled {
                timeout: Duration::from_secs(600),
            });

        // Construct the lmdb
        let lmdb = smol::block_on(async move {
            let path = config_dir().join("nostr");
            NostrLmdb::open(path)
                .await
                .expect("Failed to initialize database")
        });

        // Construct the nostr client
        ClientBuilder::default()
            .database(lmdb)
            .gossip(NostrGossipMemory::unbounded())
            .opts(opts)
            .build()
    })
}
