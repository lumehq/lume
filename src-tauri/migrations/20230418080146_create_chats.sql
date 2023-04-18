-- Add migration script here
-- create chats table
CREATE TABLE
  chats (
    id INTEGER NOT NULL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    pubkey TEXT NOT NULL UNIQUE,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts (id)
  );