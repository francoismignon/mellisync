/*
  Warnings:

  - The values [EMPTY,WINTERING,SWARMED,DEAD,QUARANTINE,MAINTENANCE] on the enum `HiveStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."HiveStatus_new" AS ENUM ('ACTIVE', 'INACTIVE');
ALTER TABLE "public"."hives" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."hives" ALTER COLUMN "status" TYPE "public"."HiveStatus_new" USING ("status"::text::"public"."HiveStatus_new");
ALTER TYPE "public"."HiveStatus" RENAME TO "HiveStatus_old";
ALTER TYPE "public"."HiveStatus_new" RENAME TO "HiveStatus";
DROP TYPE "public"."HiveStatus_old";
ALTER TABLE "public"."hives" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "public"."hives" ADD COLUMN     "statusChangedAt" TIMESTAMP(3),
ADD COLUMN     "statusReason" TEXT;
