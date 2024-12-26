-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "tp_close_support_message" TEXT NOT NULL DEFAULT 'Конец саппорт',
ADD COLUMN     "tp_close_user_message" TEXT NOT NULL DEFAULT 'Конец юзер',
ADD COLUMN     "tp_hello_message" TEXT NOT NULL DEFAULT 'Привет';
