/*
  Warnings:

  - Added the required column `currency` to the `Rate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Rate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rate" ADD COLUMN     "currency" "Currency" NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL;
