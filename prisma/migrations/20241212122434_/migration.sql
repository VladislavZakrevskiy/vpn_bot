/*
  Warnings:

  - You are about to drop the column `vpn_token` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "vpn_token" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "vpn_token";
