-- Add migration script here
ALTER TABLE accounts
DROP COLUMN channels;

ALTER TABLE accounts
DROP COLUMN chats;