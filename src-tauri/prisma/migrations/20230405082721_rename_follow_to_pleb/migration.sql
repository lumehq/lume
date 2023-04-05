/*
  Warnings:

  - You are about to drop the `Follow` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[pubkey]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Follow";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Pleb" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pubkey" TEXT NOT NULL,
    "kind" INTEGER NOT NULL,
    "metadata" TEXT NOT NULL,
    "accountId" INTEGER NOT NULL,
    CONSTRAINT "Pleb_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Pleb_pubkey_key" ON "Pleb"("pubkey");

-- CreateIndex
CREATE INDEX "Pleb_pubkey_idx" ON "Pleb"("pubkey");

-- CreateIndex
CREATE UNIQUE INDEX "Account_pubkey_key" ON "Account"("pubkey");
