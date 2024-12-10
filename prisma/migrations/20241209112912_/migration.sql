-- AlterEnum
ALTER TYPE "Currency" ADD VALUE 'CRYPTO';

-- CreateTable
CREATE TABLE "Settings" (
    "id" UUID NOT NULL,
    "proxy_path" TEXT NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_id_key" ON "Settings"("id");
