-- Add migration script here
ALTER TABLE accounts
ADD COLUMN last_login_at NUMBER NOT NULL DEFAULT 0;