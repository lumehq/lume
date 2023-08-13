-- Add migration script here
CREATE TABLE
  relays (
    id INTEGER NOT NULL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    relay TEXT NOT NULL,
    purpose TEXT NOT NULL DEFAULT '',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts (id)
  );