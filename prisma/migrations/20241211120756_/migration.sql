-- AlterTable
ALTER TABLE "Settings" ALTER COLUMN "crypto_types" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "vpn_token" TEXT NOT NULL DEFAULT '';
