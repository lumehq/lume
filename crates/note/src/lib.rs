use std::collections::{HashMap, HashSet};

use gpui::{App, AppContext, Context, Entity, Global, Task};
use nostr_sdk::prelude::*;
use smallvec::{smallvec, SmallVec};
use state::client;

pub fn init(cx: &mut App) {
    NoteRegistry::set_global(cx.new(NoteRegistry::new), cx);
}

struct GlobalNoteRegistry(Entity<NoteRegistry>);

impl Global for GlobalNoteRegistry {}

/// Note Registry
#[derive(Debug)]
pub struct NoteRegistry {
    /// Collection of all notes
    pub notes: HashMap<EventId, Event>,

    /// Tasks for asynchronous operations
    _tasks: SmallVec<[Task<()>; 2]>,
}

impl NoteRegistry {
    /// Retrieve the global note registry state
    pub fn global(cx: &App) -> Entity<Self> {
        cx.global::<GlobalNoteRegistry>().0.clone()
    }

    /// Set the global note registry instance
    pub(crate) fn set_global(state: Entity<Self>, cx: &mut App) {
        cx.set_global(GlobalNoteRegistry(state));
    }

    /// Create a new note registry instance
    pub(crate) fn new(cx: &mut Context<Self>) -> Self {
        let mut tasks = smallvec![];

        // Channel for communication between Nostr and GPUI
        let (tx, rx) = flume::bounded::<Event>(2048);

        tasks.push(
            // Handle nostr notifications
            cx.background_spawn(async move {
                let client = client();
                let mut notifications = client.notifications();
                let mut processed_events: HashSet<EventId> = HashSet::default();

                while let Ok(notification) = notifications.recv().await {
                    let RelayPoolNotification::Message { message, .. } = notification else {
                        continue;
                    };

                    if let RelayMessage::Event { event, .. } = message {
                        // Skip if already processed
                        if !processed_events.insert(event.id) {
                            continue;
                        }

                        if event.kind == Kind::TextNote || event.kind == Kind::Repost {
                            tx.send_async(event.into_owned()).await.ok();
                        }
                    }
                }
            }),
        );

        tasks.push(
            // Update GPUI state
            cx.spawn(async move |this, cx| {
                while let Ok(event) = rx.recv_async().await {
                    this.update(cx, |this, cx| {
                        this.notes.insert(event.id, event);
                        cx.notify();
                    })
                    .ok();
                }
            }),
        );

        Self {
            notes: HashMap::new(),
            _tasks: tasks,
        }
    }

    pub fn get(&self, id: &EventId) -> Option<&Event> {
        self.notes.get(id)
    }
}
