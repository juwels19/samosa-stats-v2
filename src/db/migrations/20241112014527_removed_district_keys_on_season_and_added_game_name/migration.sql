/*
  Warnings:

  - You are about to drop the column `district` on the `Season` table. All the data in the column will be lost.
  - You are about to drop the column `districtKey` on the `Season` table. All the data in the column will be lost.
  - Added the required column `gameName` to the `Season` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Season" DROP COLUMN "district",
DROP COLUMN "districtKey",
ADD COLUMN     "gameName" TEXT NOT NULL;
