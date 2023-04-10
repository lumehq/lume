-- CreateTable
CREATE TABLE "Channel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventId" TEXT NOT NULL,
    "content" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_eventId_key" ON "Channel"("eventId");

-- CreateIndex
CREATE INDEX "Channel_eventId_idx" ON "Channel"("eventId");
