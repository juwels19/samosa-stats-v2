/*
  Warnings:

  - A unique constraint covering the columns `[year]` on the table `Season` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Season_year_key" ON "Season"("year");
