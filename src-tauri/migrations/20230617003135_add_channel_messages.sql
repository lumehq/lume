-- Add migration script here
CREATE TABLE
  channel_messages (
    id INTEGER NOT NULL PRIMARY KEY,
    channel_id TEXT NOT NULL,
    event_id TEXT NOT NULL UNIQUE,
    pubkey TEXT NOT NULL,
    kind INTEGER NOT NULL,
    content TEXT NOT NULL,
    tags JSON,
    mute BOOLEAN DEFAULT 0,
    hide BOOLEAN DEFAULT 0,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (channel_id) REFERENCES channels (event_id)
  );