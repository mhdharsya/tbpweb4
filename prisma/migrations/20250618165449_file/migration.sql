/*
  Warnings:

  - Added the required column `file` to the `panduan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `panduan` ADD COLUMN `file` BLOB NOT NULL;
