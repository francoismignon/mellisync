-- AlterTable
ALTER TABLE "public"."actions" ALTER COLUMN "incrementStep" DROP NOT NULL,
ALTER COLUMN "incrementStep" DROP DEFAULT;
