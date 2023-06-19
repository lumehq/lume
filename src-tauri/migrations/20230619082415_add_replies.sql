-- Add migration script here
CREATE TABLE
  replies (
    id INTEGER NOT NULL PRIMARY KEY,
    parent_id TEXT NOT NULL,
    event_id TEXT NOT NULL UNIQUE,
    pubkey TEXT NOT NULL,
    kind INTEGER NOT NULL DEFAULT 1,
    tags JSON,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES notes (event_id)
  );