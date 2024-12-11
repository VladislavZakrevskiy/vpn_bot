-- AlterTable
ALTER TABLE "Rate" ALTER COLUMN "price_XTR" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "crypto_types" TEXT[] DEFAULT ARRAY['BTC', 'ETH', 'TON', 'BNB', 'BUSD', 'USDC', 'USDT']::TEXT[];
