/*
  Warnings:

  - Added the required column `plebId` to the `Pleb` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pleb" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "plebId" TEXT NOT NULL,
    "pubkey" TEXT NOT NULL,
    "kind" INTEGER NOT NULL,
    "metadata" TEXT NOT NULL,
    "accountId" INTEGER NOT NULL,
    CONSTRAINT "Pleb_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pleb" ("accountId", "id", "kind", "metadata", "pubkey") SELECT "accountId", "id", "kind", "metadata", "pubkey" FROM "Pleb";
DROP TABLE "Pleb";
ALTER TABLE "new_Pleb" RENAME TO "Pleb";
CREATE UNIQUE INDEX "Pleb_plebId_key" ON "Pleb"("plebId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
