-- Add migration script here
CREATE TABLE
  blocks (
    id INTEGER NOT NULL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    kind INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts (id)
  );