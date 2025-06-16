/*
  Warnings:

  - You are about to drop the column `kinerja_sistem` on the `evaluasi_sistem` table. All the data in the column will be lost.
  - You are about to drop the column `kritik_saran` on the `evaluasi_sistem` table. All the data in the column will be lost.
  - You are about to drop the column `kualitas_ui` on the `evaluasi_sistem` table. All the data in the column will be lost.
  - Added the required column `dokumentasi_jelas` to the `evaluasi_sistem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fitur_berjalan_baik` to the `evaluasi_sistem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `konten_relevan_up_to_date` to the `evaluasi_sistem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kritik` to the `evaluasi_sistem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mudah_digunakan` to the `evaluasi_sistem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saran` to the `evaluasi_sistem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `website_responsive` to the `evaluasi_sistem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `evaluasi_sistem` DROP COLUMN `kinerja_sistem`,
    DROP COLUMN `kritik_saran`,
    DROP COLUMN `kualitas_ui`,
    ADD COLUMN `dokumentasi_jelas` INTEGER NOT NULL,
    ADD COLUMN `fitur_berjalan_baik` INTEGER NOT NULL,
    ADD COLUMN `konten_relevan_up_to_date` INTEGER NOT NULL,
    ADD COLUMN `kritik` TEXT NOT NULL,
    ADD COLUMN `mudah_digunakan` INTEGER NOT NULL,
    ADD COLUMN `saran` TEXT NOT NULL,
    ADD COLUMN `website_responsive` INTEGER NOT NULL,
    MODIFY `id_evaluasi` INTEGER NOT NULL AUTO_INCREMENT;
