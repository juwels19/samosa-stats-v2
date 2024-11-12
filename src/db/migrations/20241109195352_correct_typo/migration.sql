/*
  Warnings:

  - You are about to drop the column `isActie` on the `Season` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Season" DROP COLUMN "isActie",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;
