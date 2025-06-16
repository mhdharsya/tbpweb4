/*
  Warnings:

  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Enum(EnumId(0))`.
  - A unique constraint covering the columns `[email]` on the table `admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `dosen` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `kadep` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `mahasiswa` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('ADMIN', 'DOSEN', 'KADEP', 'MAHASISWA') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `admin_email_key` ON `admin`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `dosen_email_key` ON `dosen`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `kadep_email_key` ON `kadep`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `mahasiswa_email_key` ON `mahasiswa`(`email`);
