-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gastoNome" TEXT,
    "description" TEXT,
    "value" REAL NOT NULL,
    "transactionType" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Transactions" ("gastoNome", "id", "transactionType", "userId", "value") SELECT "gastoNome", "id", "transactionType", "userId", "value" FROM "Transactions";
DROP TABLE "Transactions";
ALTER TABLE "new_Transactions" RENAME TO "Transactions";
CREATE UNIQUE INDEX "Transactions_id_key" ON "Transactions"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
