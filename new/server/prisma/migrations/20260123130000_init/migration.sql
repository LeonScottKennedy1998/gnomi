-- CreateTable
CREATE TABLE "Content" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Insert default row to reserve id 1
INSERT INTO "Content" ("id", "data", "createdAt", "updatedAt")
VALUES (1, '{}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
