/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `dosen` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `kadep` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `mahasiswa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `admin_email_key` ON `admin`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `dosen_email_key` ON `dosen`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `kadep_email_key` ON `kadep`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `mahasiswa_email_key` ON `mahasiswa`(`email`);
