/*
  Warnings:

  - You are about to drop the `Purchase` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_rate_id_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_user_id_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rate_id" UUID;

-- DropTable
DROP TABLE "Purchase";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rate_id_fkey" FOREIGN KEY ("rate_id") REFERENCES "Rate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
