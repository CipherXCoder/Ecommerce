/*
  Warnings:

  - You are about to alter the column `price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(7,2)`.

*/
-- AlterTable
ALTER TABLE `products` MODIFY `price` DECIMAL(7, 2) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `defaultBillingAddress` INTEGER NULL,
    ADD COLUMN `defaultShippingAddress` INTEGER NULL;
