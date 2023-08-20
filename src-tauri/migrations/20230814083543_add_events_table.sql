-- Add migration script here
CREATE TABLE
  events (
    id TEXT NOT NULL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    event TEXT NOT NULL,
    author TEXT NOT NULL,
    kind NUMBER NOT NULL DEFAULt 1,
    root_id TEXT,
    reply_id TEXT,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts (id)
  );