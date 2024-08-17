-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sequence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "editable" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Sequence" ("context", "id", "name") SELECT "context", "id", "name" FROM "Sequence";
DROP TABLE "Sequence";
ALTER TABLE "new_Sequence" RENAME TO "Sequence";
CREATE UNIQUE INDEX "Sequence_name_key" ON "Sequence"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
