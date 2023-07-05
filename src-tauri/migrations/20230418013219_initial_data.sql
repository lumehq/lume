-- Add migration script here
-- create accounts table
-- is_active (multi-account feature), value:
-- 0: false
-- 1: true
CREATE TABLE
  accounts (
    id INTEGER NOT NULL PRIMARY KEY,
    npub TEXT NOT NULL UNIQUE,
    pubkey TEXT NOT NULL UNIQUE,
    privkey TEXT NOT NULL,
    follows JSON,
    is_active INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

-- create notes table
CREATE TABLE
  notes (
    id INTEGER NOT NULL PRIMARY KEY,
    event_id TEXT NOT NULL UNIQUE,
    account_id INTEGER NOT NULL,
    pubkey TEXT NOT NULL,
    kind INTEGER NOT NULL DEFAULT 1,
    tags JSON,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    parent_id TEXT,
    FOREIGN KEY (account_id) REFERENCES accounts (id)
  );

-- create channels table
CREATE TABLE
  channels (
    id INTEGER NOT NULL PRIMARY KEY,
    event_id TEXT NOT NULL UNIQUE,
    name TEXT,
    about TEXT,
    picture TEXT,
    created_at INTEGER NOT NULL
  );

-- create settings table
CREATE TABLE
  settings (
    id INTEGER NOT NULL PRIMARY KEY,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

-- create metadata table
CREATE TABLE
  metadata (
    id TEXT NOT NULL PRIMARY KEY,
    pubkey TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );