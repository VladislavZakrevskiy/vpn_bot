/*
  Warnings:

  - You are about to drop the `_RateToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('RUB', 'STARS');

-- DropForeignKey
ALTER TABLE "_RateToUser" DROP CONSTRAINT "_RateToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RateToUser" DROP CONSTRAINT "_RateToUser_B_fkey";

-- DropTable
DROP TABLE "_RateToUser";

-- CreateTable
CREATE TABLE "Purchase" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "rate_id" UUID NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_id_key" ON "Purchase"("id");

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_rate_id_fkey" FOREIGN KEY ("rate_id") REFERENCES "Rate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
