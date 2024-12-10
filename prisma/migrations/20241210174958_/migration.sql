/*
  Warnings:

  - Added the required column `GB_limit` to the `Rate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `MB_speed` to the `Rate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `max_devices` to the `Rate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rate" ADD COLUMN     "GB_limit" INTEGER NOT NULL,
ADD COLUMN     "MB_speed" INTEGER NOT NULL,
ADD COLUMN     "max_devices" INTEGER NOT NULL;
