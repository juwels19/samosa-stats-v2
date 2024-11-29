-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "isOngoing" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Pick" ADD COLUMN     "isRandom" BOOLEAN NOT NULL DEFAULT false;
