/*
  Warnings:

  - The `admin_command` column on the `Settings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "admin_command",
ADD COLUMN     "admin_command" TEXT[] DEFAULT ARRAY['admin']::TEXT[];
