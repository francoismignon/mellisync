/*
  Warnings:

  - The primary key for the `action_weather_restriction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `weatherRestrictionId` on the `action_weather_restriction` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `periodes` table. All the data in the column will be lost.
  - You are about to drop the `weather_restrictions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `periodes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `weatherConditionId` to the `action_weather_restriction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `periodes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label_en` to the `periodes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label_fr` to the `periodes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."action_weather_restriction" DROP CONSTRAINT "action_weather_restriction_weatherRestrictionId_fkey";

-- AlterTable
ALTER TABLE "public"."action_weather_restriction" DROP CONSTRAINT "action_weather_restriction_pkey",
DROP COLUMN "weatherRestrictionId",
ADD COLUMN     "weatherConditionId" INTEGER NOT NULL,
ADD CONSTRAINT "action_weather_restriction_pkey" PRIMARY KEY ("actionId", "weatherConditionId");

-- AlterTable
ALTER TABLE "public"."periodes" DROP COLUMN "label",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "label_en" TEXT NOT NULL,
ADD COLUMN     "label_fr" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."weather_restrictions";

-- CreateTable
CREATE TABLE "public"."weather_conditions" (
    "id" SERIAL NOT NULL,
    "wmo_code" INTEGER NOT NULL,
    "label_fr" TEXT NOT NULL,
    "label_en" TEXT NOT NULL,

    CONSTRAINT "weather_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "weather_conditions_wmo_code_key" ON "public"."weather_conditions"("wmo_code");

-- CreateIndex
CREATE UNIQUE INDEX "periodes_code_key" ON "public"."periodes"("code");

-- AddForeignKey
ALTER TABLE "public"."action_weather_restriction" ADD CONSTRAINT "action_weather_restriction_weatherConditionId_fkey" FOREIGN KEY ("weatherConditionId") REFERENCES "public"."weather_conditions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
