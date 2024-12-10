/*
  Warnings:

  - You are about to drop the column `proxy_path` on the `Settings` table. All the data in the column will be lost.
  - Added the required column `admin_proxy_path` to the `Settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_proxy_path` to the `Settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "proxy_path",
ADD COLUMN     "admin_proxy_path" TEXT NOT NULL,
ADD COLUMN     "user_proxy_path" TEXT NOT NULL;
