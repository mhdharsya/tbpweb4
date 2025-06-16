/*
  Warnings:

  - You are about to drop the column `userId` on the `evaluasi_sistem` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `evaluasi_sistem_userId_key` ON `evaluasi_sistem`;

-- AlterTable
ALTER TABLE `evaluasi_sistem` DROP COLUMN `userId`;
