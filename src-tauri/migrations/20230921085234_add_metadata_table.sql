-- Add migration script here
CREATE TABLE
  metadata (
    id TEXT NOT NULL PRIMARY KEY,
    event TEXT NOT NULL,
    author TEXT NOT NULL,
    kind NUMBER NOT NULL DEFAULt 0,
    created_at INTEGER NOT NULL
  );