/*
  Warnings:

  - Added the required column `codigo` to the `Aeronave` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Funcionario" ADD COLUMN "email" TEXT;

-- CreateTable
CREATE TABLE "Peca" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'NACIONAL',
    "fornecedor" TEXT,
    "status" TEXT NOT NULL DEFAULT 'EM_PRODUCAO',
    "aeronaveId" TEXT,
    CONSTRAINT "Peca_aeronaveId_fkey" FOREIGN KEY ("aeronaveId") REFERENCES "Aeronave" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Etapa" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "prazo" TEXT,
    "responsavel" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "aeronaveId" TEXT NOT NULL,
    CONSTRAINT "Etapa_aeronaveId_fkey" FOREIGN KEY ("aeronaveId") REFERENCES "Aeronave" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Teste" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "data" TEXT,
    "responsavel" TEXT,
    "resultado" TEXT NOT NULL DEFAULT 'APROVADO',
    "aeronaveId" TEXT NOT NULL,
    CONSTRAINT "Teste_aeronaveId_fkey" FOREIGN KEY ("aeronaveId") REFERENCES "Aeronave" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Aeronave" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "fabricante" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'COMERCIAL',
    "capacidade" TEXT,
    "alcance" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE'
);
INSERT INTO "new_Aeronave" ("fabricante", "id", "modelo") SELECT "fabricante", "id", "modelo" FROM "Aeronave";
DROP TABLE "Aeronave";
ALTER TABLE "new_Aeronave" RENAME TO "Aeronave";
CREATE UNIQUE INDEX "Aeronave_codigo_key" ON "Aeronave"("codigo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Peca_codigo_key" ON "Peca"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Teste_codigo_key" ON "Teste"("codigo");
