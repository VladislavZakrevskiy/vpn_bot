/*
  Warnings:

  - You are about to drop the column `rate_id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_rate_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "rate_id";

-- CreateTable
CREATE TABLE "Purchase" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "rate_id" UUID NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_id_key" ON "Purchase"("id");

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_rate_id_fkey" FOREIGN KEY ("rate_id") REFERENCES "Rate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
