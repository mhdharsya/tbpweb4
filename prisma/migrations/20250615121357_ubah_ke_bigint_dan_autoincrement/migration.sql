/*
  Warnings:

  - The primary key for the `dosen` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `kadep` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `mahasiswa` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `evaluasi_sistem` DROP FOREIGN KEY `fk_mahasiswa_evaluasi_sistem`;

-- DropForeignKey
ALTER TABLE `pendaftaran` DROP FOREIGN KEY `fk_dosen_pendaftaran`;

-- DropForeignKey
ALTER TABLE `pendaftaran` DROP FOREIGN KEY `fk_mahasiswa_pendaftaran`;

-- AlterTable
ALTER TABLE `dosen` DROP PRIMARY KEY,
    MODIFY `nip_dosen` BIGINT NOT NULL,
    ADD PRIMARY KEY (`nip_dosen`);

-- AlterTable
ALTER TABLE `evaluasi_sistem` MODIFY `nim` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `kadep` DROP PRIMARY KEY,
    MODIFY `nip_kadep` BIGINT NOT NULL,
    ADD PRIMARY KEY (`nip_kadep`);

-- AlterTable
ALTER TABLE `mahasiswa` DROP PRIMARY KEY,
    MODIFY `nim` BIGINT NOT NULL,
    ADD PRIMARY KEY (`nim`);

-- AlterTable
ALTER TABLE `pendaftaran` MODIFY `id_pendaftaran` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `nim` BIGINT NOT NULL,
    MODIFY `nip_dosen` BIGINT NOT NULL,
    MODIFY `nim_mhs` BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE `evaluasi_sistem` ADD CONSTRAINT `fk_mahasiswa_evaluasi_sistem` FOREIGN KEY (`nim`) REFERENCES `mahasiswa`(`nim`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pendaftaran` ADD CONSTRAINT `fk_dosen_pendaftaran` FOREIGN KEY (`nip_dosen`) REFERENCES `dosen`(`nip_dosen`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pendaftaran` ADD CONSTRAINT `fk_mahasiswa_pendaftaran` FOREIGN KEY (`nim`) REFERENCES `mahasiswa`(`nim`) ON DELETE NO ACTION ON UPDATE NO ACTION;
