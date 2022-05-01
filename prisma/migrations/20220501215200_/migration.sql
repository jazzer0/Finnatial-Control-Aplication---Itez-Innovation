/*
  Warnings:

  - You are about to drop the column `gastoNome` on the `Transactions` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "areaDeGasto" TEXT,
    "description" TEXT,
    "value" REAL NOT NULL,
    "transactionType" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Transactions" ("description", "id", "transactionType", "userId", "value") SELECT "description", "id", "transactionType", "userId", "value" FROM "Transactions";
DROP TABLE "Transactions";
ALTER TABLE "new_Transactions" RENAME TO "Transactions";
CREATE UNIQUE INDEX "Transactions_id_key" ON "Transactions"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
