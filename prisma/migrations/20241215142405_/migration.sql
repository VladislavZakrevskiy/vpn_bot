-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "is_cart_enable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_crypto_enable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_star_enable" BOOLEAN NOT NULL DEFAULT true;
