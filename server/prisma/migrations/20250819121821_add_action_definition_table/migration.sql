/*
  Warnings:

  - You are about to drop the column `type` on the `visitActions` table. All the data in the column will be lost.
  - Added the required column `actionDefinitionId` to the `visitActions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."visitActions" DROP COLUMN "type",
ADD COLUMN     "actionDefinitionId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."actionDefinitions" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "options" TEXT,
    "periods" TEXT,
    "tempRange" TEXT,
    "weatherRestrictions" TEXT,

    CONSTRAINT "actionDefinitions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."visitActions" ADD CONSTRAINT "visitActions_actionDefinitionId_fkey" FOREIGN KEY ("actionDefinitionId") REFERENCES "public"."actionDefinitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
