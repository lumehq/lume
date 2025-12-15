use std::collections::HashMap;

use gpui::{App, AppContext, AsyncApp, Context, Entity, Global, Task};
use nostr_sdk::prelude::*;
use smallvec::{smallvec, SmallVec};
use state::client;

pub fn init(cx: &mut App) {
    PersonRegistry::set_global(cx.new(PersonRegistry::new), cx);
}

struct GlobalPersonRegistry(Entity<PersonRegistry>);

impl Global for GlobalPersonRegistry {}

/// Person Registry
#[derive(Debug)]
pub struct PersonRegistry {
    /// Collection of all profiels
    pub persons: HashMap<PublicKey, Entity<Profile>>,

    /// Tasks for asynchronous operations
    _tasks: SmallVec<[Task<()>; 2]>,
}

impl PersonRegistry {
    /// Retrieve the global person registry state
    pub fn global(cx: &App) -> Entity<Self> {
        cx.global::<GlobalPersonRegistry>().0.clone()
    }

    /// Set the global person registry instance
    pub(crate) fn set_global(state: Entity<Self>, cx: &mut App) {
        cx.set_global(GlobalPersonRegistry(state));
    }

    /// Create a new person registry instance
    pub(crate) fn new(cx: &mut Context<Self>) -> Self {
        let mut tasks = smallvec![];

        tasks.push(
            // Load all user profiles from the database
            cx.spawn(async move |this, cx| {
                let task = Self::init(cx);

                match task.await {
                    Ok(profiles) => {
                        this.update(cx, |this, cx| {
                            this.bulk_insert(profiles, cx);
                        })
                        .ok();
                    }
                    Err(e) => {
                        log::error!("Failed to load user profiles from database: {e}");
                    }
                }
            }),
        );

        Self {
            persons: HashMap::new(),
            _tasks: tasks,
        }
    }

    /// Load all user profiles from the database
    fn init(cx: &AsyncApp) -> Task<Result<Vec<Profile>, Error>> {
        cx.background_spawn(async move {
            let client = client();
            let filter = Filter::new().kind(Kind::Metadata).limit(200);
            let events = client.database().query(filter).await?;

            let mut profiles = vec![];

            for event in events.into_iter() {
                let metadata = Metadata::from_json(event.content).unwrap_or_default();
                let profile = Profile::new(event.pubkey, metadata);
                profiles.push(profile);
            }

            Ok(profiles)
        })
    }

    /// Insert batch of persons
    fn bulk_insert(&mut self, profiles: Vec<Profile>, cx: &mut Context<Self>) {
        for profile in profiles.into_iter() {
            self.persons
                .insert(profile.public_key(), cx.new(|_| profile));
        }
        cx.notify();
    }

    /// Insert or update a person
    pub fn insert_or_update(&mut self, profile: &Profile, cx: &mut App) {
        let public_key = profile.public_key();

        if let Some(person) = self.persons.get(&public_key) {
            person.update(cx, |this, cx| {
                *this = profile.to_owned();
                cx.notify();
            });
        } else {
            self.persons
                .insert(public_key, cx.new(|_| profile.to_owned()));
        }
    }

    /// Get person
    pub fn get(&self, public_key: &PublicKey, cx: &App) -> Profile {
        self.persons
            .get(public_key)
            .map(|e| e.read(cx))
            .cloned()
            .unwrap_or(Profile::new(public_key.to_owned(), Metadata::default()))
    }
}
