-- create accounts table
CREATE TABLE
  accounts (
    id TEXT NOT NULL PRIMARY KEY,
    pubkey TEXT NOT NULL UNIQUE,
    follows TEXT,
    circles TEXT,
    is_active INTEGER NOT NULL DEFAULT 0,
    last_login_at NUMBER NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

-- create notes table
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

-- create settings table
CREATE TABLE
  settings (
    id INTEGER NOT NULL PRIMARY KEY,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  widgets (
    id INTEGER NOT NULL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    kind INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts (id)
  );

CREATE TABLE
  relays (
    id INTEGER NOT NULL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    relay TEXT NOT NULL UNIQUE,
    purpose TEXT NOT NULL DEFAULT '',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts (id)
  );
