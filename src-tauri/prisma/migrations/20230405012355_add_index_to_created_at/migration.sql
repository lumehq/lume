-- DropIndex
DROP INDEX "Message_pubkey_idx";

-- DropIndex
DROP INDEX "Note_eventId_idx";

-- CreateIndex
CREATE INDEX "Message_pubkey_createdAt_idx" ON "Message"("pubkey", "createdAt");

-- CreateIndex
CREATE INDEX "Note_eventId_createdAt_idx" ON "Note"("eventId", "createdAt");
