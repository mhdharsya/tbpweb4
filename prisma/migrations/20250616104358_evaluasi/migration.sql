/*
  Warnings:

  - The primary key for the `evaluasi_sistem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_evaluasi` on the `evaluasi_sistem` table. All the data in the column will be lost.
  - You are about to drop the column `kinerja_sistem` on the `evaluasi_sistem` table. All the data in the column will be lost.
  - You are about to drop the column `kritik_saran` on the `evaluasi_sistem` table. All the data in the column will be lost.
  - You are about to drop the column `kualitas_ui` on the `evaluasi_sistem` table. All the data in the column will be lost.
  - You are about to drop the column `nim` on the `evaluasi_sistem` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal_isi` on the `evaluasi_sistem` table. All the data in the column will be lost.
  - Added the required column `dokumentasi` to the `evaluasi_sistem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fitur` to the `evaluasi_sistem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `evaluasi_sistem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kemudahan` to the `evaluasi_sistem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `konten` to the `evaluasi_sistem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responsif` to the `evaluasi_sistem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `evaluasi_sistem` DROP FOREIGN KEY `fk_mahasiswa_evaluasi_sistem`;

-- DropIndex
DROP INDEX `fk_mahasiswa_evaluasi_sistem` ON `evaluasi_sistem`;

-- AlterTable
ALTER TABLE `evaluasi_sistem` DROP PRIMARY KEY,
    DROP COLUMN `id_evaluasi`,
    DROP COLUMN `kinerja_sistem`,
    DROP COLUMN `kritik_saran`,
    DROP COLUMN `kualitas_ui`,
    DROP COLUMN `nim`,
    DROP COLUMN `tanggal_isi`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `dokumentasi` INTEGER NOT NULL,
    ADD COLUMN `fitur` INTEGER NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `kemudahan` INTEGER NOT NULL,
    ADD COLUMN `konten` INTEGER NOT NULL,
    ADD COLUMN `kritik` VARCHAR(191) NULL,
    ADD COLUMN `responsif` INTEGER NOT NULL,
    ADD COLUMN `saran` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);
