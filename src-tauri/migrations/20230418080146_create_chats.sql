-- Add migration script here
-- create chats table
CREATE TABLE
  chats (
    id INTEGER NOT NULL PRIMARY KEY,
    event_id TEXT NOT NULL UNIQUE,
    receiver_pubkey INTEGER NOT NULL,
    sender_pubkey TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );