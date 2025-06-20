/*
  Warnings:

  - You are about to drop the column `niku` on the `panduan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `panduan` DROP FOREIGN KEY `fk_admin_panduan`;

-- DropIndex
DROP INDEX `fk_admin_panduan` ON `panduan`;

-- AlterTable
ALTER TABLE `panduan` DROP COLUMN `niku`;
