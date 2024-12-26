/*
  Warnings:

  - The primary key for the `Tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Tag` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tag_id` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_tag_id_fkey";

-- AlterTable
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Tag_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "tag_id",
ADD COLUMN     "tag_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
