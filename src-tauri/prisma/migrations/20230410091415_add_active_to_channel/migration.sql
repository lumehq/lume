-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Channel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "accountId" INTEGER NOT NULL,
    CONSTRAINT "Channel_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Channel" ("accountId", "content", "eventId", "id") SELECT "accountId", "content", "eventId", "id" FROM "Channel";
DROP TABLE "Channel";
ALTER TABLE "new_Channel" RENAME TO "Channel";
CREATE UNIQUE INDEX "Channel_eventId_key" ON "Channel"("eventId");
CREATE INDEX "Channel_eventId_idx" ON "Channel"("eventId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
