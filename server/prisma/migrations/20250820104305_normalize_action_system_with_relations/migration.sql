/*
  Warnings:

  - You are about to drop the column `createdAt` on the `visits` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `visits` table. All the data in the column will be lost.
  - You are about to drop the column `temperature` on the `visits` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `visits` table. All the data in the column will be lost.
  - You are about to drop the column `weather` on the `visits` table. All the data in the column will be lost.
  - You are about to drop the `actionDefinitions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `visitActions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."visitActions" DROP CONSTRAINT "visitActions_actionDefinitionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."visitActions" DROP CONSTRAINT "visitActions_visitId_fkey";

-- AlterTable
ALTER TABLE "public"."visits" DROP COLUMN "createdAt",
DROP COLUMN "notes",
DROP COLUMN "temperature",
DROP COLUMN "updatedAt",
DROP COLUMN "weather";

-- DropTable
DROP TABLE "public"."actionDefinitions";

-- DropTable
DROP TABLE "public"."visitActions";

-- CreateTable
CREATE TABLE "public"."visit_action" (
    "id" SERIAL NOT NULL,
    "visitId" INTEGER NOT NULL,
    "actionId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "visit_action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."actions" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."options" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."periodes" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "periodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."weather_restrictions" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "weather_restrictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."action_option" (
    "actionId" INTEGER NOT NULL,
    "optionId" INTEGER NOT NULL,

    CONSTRAINT "action_option_pkey" PRIMARY KEY ("actionId","optionId")
);

-- CreateTable
CREATE TABLE "public"."action_periode" (
    "actionId" INTEGER NOT NULL,
    "periodeId" INTEGER NOT NULL,

    CONSTRAINT "action_periode_pkey" PRIMARY KEY ("actionId","periodeId")
);

-- CreateTable
CREATE TABLE "public"."action_weather_restriction" (
    "actionId" INTEGER NOT NULL,
    "weatherRestrictionId" INTEGER NOT NULL,

    CONSTRAINT "action_weather_restriction_pkey" PRIMARY KEY ("actionId","weatherRestrictionId")
);

-- AddForeignKey
ALTER TABLE "public"."visit_action" ADD CONSTRAINT "visit_action_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "public"."visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."visit_action" ADD CONSTRAINT "visit_action_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "public"."actions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."action_option" ADD CONSTRAINT "action_option_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "public"."actions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."action_option" ADD CONSTRAINT "action_option_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "public"."options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."action_periode" ADD CONSTRAINT "action_periode_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "public"."actions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."action_periode" ADD CONSTRAINT "action_periode_periodeId_fkey" FOREIGN KEY ("periodeId") REFERENCES "public"."periodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."action_weather_restriction" ADD CONSTRAINT "action_weather_restriction_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "public"."actions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."action_weather_restriction" ADD CONSTRAINT "action_weather_restriction_weatherRestrictionId_fkey" FOREIGN KEY ("weatherRestrictionId") REFERENCES "public"."weather_restrictions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
