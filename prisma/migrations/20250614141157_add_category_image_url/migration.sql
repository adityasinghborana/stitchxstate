/*
  Warnings:

  - You are about to drop the `categoryimage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `categoryimage` DROP FOREIGN KEY `CategoryImage_categoryId_fkey`;

-- AlterTable
ALTER TABLE `category` ADD COLUMN `imageUrl` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `categoryimage`;
