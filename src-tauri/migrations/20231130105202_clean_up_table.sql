ALTER TABLE accounts DROP COLUMN follows;
ALTER TABLE accounts DROP COLUMN circles;
ALTER TABLE accounts DROP COLUMN last_login_at;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS relays;
