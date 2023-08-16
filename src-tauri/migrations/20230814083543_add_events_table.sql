-- Add migration script here
CREATE TABLE
  events (
    id INTEGER NOT NULL PRIMARY KEY,
    cache_key TEXT NOT NULL,
    event_id TEXT NOT NULL UNIQUE,
    event_kind INTEGER NOT NULL DEFAULT 1,
    event TEXT NOT NULL
  );