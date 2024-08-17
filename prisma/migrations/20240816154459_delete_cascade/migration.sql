-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL,
    "speaker" TEXT NOT NULL,
    "sequenceId" TEXT NOT NULL,
    CONSTRAINT "Message_sequenceId_fkey" FOREIGN KEY ("sequenceId") REFERENCES "Sequence" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("id", "order", "sequenceId", "speaker") SELECT "id", "order", "sequenceId", "speaker" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
CREATE TABLE "new_Text" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "languageId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "checked" BOOLEAN DEFAULT true,
    "messageId" TEXT NOT NULL,
    CONSTRAINT "Text_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Lang" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Text_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Text" ("checked", "id", "languageId", "messageId", "text") SELECT "checked", "id", "languageId", "messageId", "text" FROM "Text";
DROP TABLE "Text";
ALTER TABLE "new_Text" RENAME TO "Text";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
