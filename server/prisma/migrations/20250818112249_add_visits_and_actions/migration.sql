-- CreateTable
CREATE TABLE "public"."visits" (
    "id" SERIAL NOT NULL,
    "hiveId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "temperature" DOUBLE PRECISION,
    "weather" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."visitActions" (
    "id" SERIAL NOT NULL,
    "visitId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "visitActions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."visits" ADD CONSTRAINT "visits_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "public"."hives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."visitActions" ADD CONSTRAINT "visitActions_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "public"."visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
