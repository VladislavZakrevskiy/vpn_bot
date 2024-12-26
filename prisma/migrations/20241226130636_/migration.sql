/*
  Warnings:

  - You are about to drop the `_TagToTicket` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TagToTicket" DROP CONSTRAINT "_TagToTicket_A_fkey";

-- DropForeignKey
ALTER TABLE "_TagToTicket" DROP CONSTRAINT "_TagToTicket_B_fkey";

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "tag_id" UUID;

-- DropTable
DROP TABLE "_TagToTicket";

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
