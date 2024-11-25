-- CreateTable
CREATE TABLE "_CategoryToPick" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToPick_AB_unique" ON "_CategoryToPick"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToPick_B_index" ON "_CategoryToPick"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToPick" ADD CONSTRAINT "_CategoryToPick_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToPick" ADD CONSTRAINT "_CategoryToPick_B_fkey" FOREIGN KEY ("B") REFERENCES "Pick"("id") ON DELETE CASCADE ON UPDATE CASCADE;
