-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'BEEKEEPER');

-- CreateEnum
CREATE TYPE "public"."HiveType" AS ENUM ('DADANT', 'LANGSTROTH', 'WARRE', 'KENYAN', 'VOIRNOT');

-- CreateEnum
CREATE TYPE "public"."FrameCount" AS ENUM ('FRAME_8', 'FRAME_10', 'FRAME_12', 'FRAME_14');

-- CreateEnum
CREATE TYPE "public"."TranshumanceReason" AS ENUM ('HONEY_FLOW', 'WINTERING', 'POLLINATION', 'TREATMENT', 'MAINTENANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."HiveStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'EMPTY', 'WINTERING', 'SWARMED', 'DEAD', 'QUARANTINE', 'MAINTENANCE');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'BEEKEEPER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."apiaries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "apiaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."hives" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."HiveType" NOT NULL DEFAULT 'DADANT',
    "framecount" "public"."FrameCount" NOT NULL DEFAULT 'FRAME_10',
    "color" TEXT NOT NULL,
    "status" "public"."HiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "yearBuilt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."apiary_hives" (
    "id" SERIAL NOT NULL,
    "apiaryId" INTEGER NOT NULL,
    "hiveId" INTEGER NOT NULL,
    "reason" "public"."TranshumanceReason" NOT NULL,
    "note" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "apiary_hives_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."apiaries" ADD CONSTRAINT "apiaries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."apiary_hives" ADD CONSTRAINT "apiary_hives_apiaryId_fkey" FOREIGN KEY ("apiaryId") REFERENCES "public"."apiaries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."apiary_hives" ADD CONSTRAINT "apiary_hives_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "public"."hives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
