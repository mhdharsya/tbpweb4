/*
  Warnings:

  - You are about to drop the column `dokumentasi_jelas` on the `evaluasi_sistem` table. All the data in the column will be lost.
  - You are about to drop the column `fitur_berjalan_baik` on the `evaluasi_sistem` table. All the data in the column will be lost.
  - You are about to drop the column `konten_relevan_up_to_date` on the `evaluasi_sistem` table. All the data in the column will be lost.
  - You are about to drop the column `kritik` on the `evaluasi_sistem` table. All the data in the column will be lost.
  - You are about to drop the column `mudah_digunakan` on the `evaluasi_sistem` table. All the data in the column will be lost.
  - You are about to drop the column `saran` on the `evaluasi_sistem` table. All the data in the column will be lost.
  - You are about to drop the column `website_responsive` on the `evaluasi_sistem` table. All the data in the column will be lost.
  - Added the required column `kinerja_sistem` to the `evaluasi_sistem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kritik_saran` to the `evaluasi_sistem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kualitas_ui` to the `evaluasi_sistem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `evaluasi_sistem` DROP COLUMN `dokumentasi_jelas`,
    DROP COLUMN `fitur_berjalan_baik`,
    DROP COLUMN `konten_relevan_up_to_date`,
    DROP COLUMN `kritik`,
    DROP COLUMN `mudah_digunakan`,
    DROP COLUMN `saran`,
    DROP COLUMN `website_responsive`,
    ADD COLUMN `kinerja_sistem` VARCHAR(100) NOT NULL,
    ADD COLUMN `kritik_saran` TEXT NOT NULL,
    ADD COLUMN `kualitas_ui` VARCHAR(100) NOT NULL,
    MODIFY `id_evaluasi` INTEGER NOT NULL;
