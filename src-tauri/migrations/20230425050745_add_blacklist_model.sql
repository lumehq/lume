-- Add migration script here
-- create blacklist table
CREATE TABLE
  blacklist (
    id INTEGER NOT NULL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    content TEXT NOT NULL UNIQUE,
    status INTEGER NOT NULL DEFAULT 0,
    kind INTEGER NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts (id)
  );