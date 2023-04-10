-- CreateTable
CREATE TABLE "Chat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pubkey" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat_pubkey_key" ON "Chat"("pubkey");

-- CreateIndex
CREATE INDEX "Chat_pubkey_idx" ON "Chat"("pubkey");
