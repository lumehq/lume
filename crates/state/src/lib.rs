use std::time::Duration;

use common::{config_dir, BOOTSTRAP_RELAYS, SEARCH_RELAYS};
use gpui::{App, AppContext, Context, Entity, Global, Task};
use nostr_lmdb::NostrLmdb;
use nostr_sdk::prelude::*;
use smallvec::{smallvec, SmallVec};

pub fn init(cx: &mut App) {
    NostrRegistry::set_global(cx.new(NostrRegistry::new), cx);
}

struct GlobalNostrRegistry(Entity<NostrRegistry>);

impl Global for GlobalNostrRegistry {}

/// Nostr Registry
#[derive(Debug)]
pub struct NostrRegistry {
    /// Nostr Client
    client: Client,

    /// Tasks for asynchronous operations
    _tasks: SmallVec<[Task<()>; 1]>,
}

impl NostrRegistry {
    /// Retrieve the global nostr state
    pub fn global(cx: &App) -> Entity<Self> {
        cx.global::<GlobalNostrRegistry>().0.clone()
    }

    /// Set the global nostr instance
    fn set_global(state: Entity<Self>, cx: &mut App) {
        cx.set_global(GlobalNostrRegistry(state));
    }

    /// Create a new nostr instance
    fn new(cx: &mut Context<Self>) -> Self {
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
        let lmdb = cx.background_executor().block(async move {
            let path = config_dir().join("nostr");
            NostrLmdb::open(path)
                .await
                .expect("Failed to initialize database")
        });

        // Construct the nostr client
        let client = ClientBuilder::default().database(lmdb).opts(opts).build();

        let mut tasks = smallvec![];

        tasks.push(
            // Establish connection to the bootstrap relays
            //
            // And handle notifications from the nostr relay pool channel
            cx.background_spawn({
                let client = client.clone();

                async move {
                    // Connect to the bootstrap relays
                    Self::connect(&client).await;

                    // Handle notifications from the relay pool
                    // Self::handle_notifications(&client, &gossip, &tracker).await;
                }
            }),
        );

        Self {
            client,
            _tasks: tasks,
        }
    }

    /// Establish connection to the bootstrap relays
    async fn connect(client: &Client) {
        // Get all bootstrapping relays
        let mut urls = vec![];
        urls.extend(BOOTSTRAP_RELAYS);
        urls.extend(SEARCH_RELAYS);

        // Add relay to the relay pool
        for url in urls.into_iter() {
            client.add_relay(url).await.ok();
        }

        // Connect to all added relays
        client.connect().await;
    }

    /// Get the nostr client instance
    pub fn client(&self) -> Client {
        self.client.clone()
    }
}
