use std::env;

use gpui::{App, AppContext, Context, Entity, Global, Task};
use nostr_sdk::prelude::*;
use smallvec::{smallvec, SmallVec};
use state::NostrRegistry;

pub fn init(cx: &mut App) {
    Account::set_global(cx.new(Account::new), cx);
}

struct GlobalAccount(Entity<Account>);

impl Global for GlobalAccount {}

pub struct Account {
    /// The public key of the account
    public_key: Option<PublicKey>,

    /// Tasks for asynchronous operations
    _tasks: SmallVec<[Task<()>; 1]>,
}

impl Account {
    /// Retrieve the global account state
    pub fn global(cx: &App) -> Entity<Self> {
        cx.global::<GlobalAccount>().0.clone()
    }

    /// Check if the global account state exists
    pub fn has_global(cx: &App) -> bool {
        cx.has_global::<GlobalAccount>()
    }

    /// Remove the global account state
    pub fn remove_global(cx: &mut App) {
        cx.remove_global::<GlobalAccount>();
    }

    /// Set the global account instance
    fn set_global(state: Entity<Self>, cx: &mut App) {
        cx.set_global(GlobalAccount(state));
    }

    /// Create a new account instance
    fn new(cx: &mut Context<Self>) -> Self {
        let nostr = NostrRegistry::global(cx);
        let client = nostr.read(cx).client();

        // Collect command line arguments
        let args: Vec<String> = env::args().collect();
        let account = args.get(1).and_then(|s| Keys::parse(s).ok());

        let mut tasks = smallvec![];

        if let Some(keys) = account {
            tasks.push(
                // Background
                cx.spawn(async move |this, cx| {
                    let public_key = keys.public_key();

                    // Set the signer
                    cx.background_executor()
                        .await_on_background(async move {
                            client.set_signer(keys).await;
                            log::info!("Signer is set");
                        })
                        .await;

                    // Update state
                    this.update(cx, |this, cx| {
                        this.public_key = Some(public_key);
                        cx.notify();
                    })
                    .ok();
                }),
            );
        }

        Self {
            public_key: None,
            _tasks: tasks,
        }
    }

    /// Check if the account entity has a public key
    pub fn has_account(&self) -> bool {
        self.public_key.is_some()
    }

    /// Get the public key of the account
    pub fn public_key(&self) -> PublicKey {
        // This method is only called when user is logged in, so unwrap safely
        self.public_key.unwrap()
    }
}
