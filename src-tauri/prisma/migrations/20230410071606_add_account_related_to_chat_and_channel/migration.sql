/*
  Warnings:

  - Added the required column `accountId` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pubkey" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,
    CONSTRAINT "Chat_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Chat" ("createdAt", "id", "pubkey") SELECT "createdAt", "id", "pubkey" FROM "Chat";
DROP TABLE "Chat";
ALTER TABLE "new_Chat" RENAME TO "Chat";
CREATE UNIQUE INDEX "Chat_pubkey_key" ON "Chat"("pubkey");
CREATE INDEX "Chat_pubkey_idx" ON "Chat"("pubkey");
CREATE TABLE "new_Channel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "accountId" INTEGER NOT NULL,
    CONSTRAINT "Channel_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Channel" ("content", "eventId", "id") SELECT "content", "eventId", "id" FROM "Channel";
DROP TABLE "Channel";
ALTER TABLE "new_Channel" RENAME TO "Channel";
CREATE UNIQUE INDEX "Channel_eventId_key" ON "Channel"("eventId");
CREATE INDEX "Channel_eventId_idx" ON "Channel"("eventId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
