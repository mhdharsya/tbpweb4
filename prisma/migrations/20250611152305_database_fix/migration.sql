/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.
  - Added the required column `email` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `username`,
    ADD COLUMN `email` VARCHAR(100) NOT NULL,
    ADD COLUMN `role` VARCHAR(50) NOT NULL,
    ADD PRIMARY KEY (`email`);

-- CreateTable
CREATE TABLE `admin` (
    `niku` INTEGER NOT NULL,
    `nama_admin` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NOT NULL,

    INDEX `fk_user_admin`(`email`),
    PRIMARY KEY (`niku`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dosen` (
    `nip_dosen` INTEGER NOT NULL,
    `nama_dosen` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `bidang_keahlian` VARCHAR(99) NOT NULL,
    `id_jadwal_dosen` INTEGER NOT NULL,

    INDEX `fk_jadwal_dosen_dosen`(`id_jadwal_dosen`),
    INDEX `fk_user_dosen`(`email`),
    PRIMARY KEY (`nip_dosen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evaluasi_sistem` (
    `id_evaluasi` INTEGER NOT NULL,
    `kualitas_ui` VARCHAR(100) NOT NULL,
    `kinerja_sistem` VARCHAR(100) NOT NULL,
    `kritik_saran` TEXT NOT NULL,
    `tanggal_isi` DATE NOT NULL,
    `nim` INTEGER NOT NULL,

    INDEX `fk_mahasiswa_evaluasi_sistem`(`nim`),
    PRIMARY KEY (`id_evaluasi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jadwal_dosen` (
    `id_jadwal_dosen` INTEGER NOT NULL,
    `tanggal_mulai` DATE NOT NULL,
    `tanggal_selesai` DATE NOT NULL,

    PRIMARY KEY (`id_jadwal_dosen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jadwal_pendaftaran` (
    `id_jadwal` VARCHAR(100) NOT NULL,
    `id_pendaftaran` INTEGER NOT NULL,
    `jam_mulai` TIME(0) NOT NULL,
    `jam_selesai` TIME(0) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `dosen_penguji` VARCHAR(99) NOT NULL,
    `id_kuota` INTEGER NOT NULL,

    INDEX `fk_kuota_semhas_jadwal_pendaftaran`(`id_kuota`),
    INDEX `fk_pendaftaran_jadwal_pendaftaran`(`id_pendaftaran`),
    PRIMARY KEY (`id_jadwal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kadep` (
    `nip_kadep` INTEGER NOT NULL,
    `nama_kadep` VARCHAR(99) NOT NULL,
    `email` VARCHAR(100) NOT NULL,

    INDEX `fk_user_kadep`(`email`),
    PRIMARY KEY (`nip_kadep`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kuota_semhas` (
    `id_kuota` INTEGER NOT NULL,
    `kuota_max` INTEGER NOT NULL,
    `minggu` TIME(0) NOT NULL,

    PRIMARY KEY (`id_kuota`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mahasiswa` (
    `nim` INTEGER NOT NULL,
    `nama_lengkap` VARCHAR(99) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `status` VARCHAR(99) NOT NULL,

    INDEX `fk_user_mahasiswa`(`email`),
    PRIMARY KEY (`nim`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nilai_semhas` (
    `id_nilai` INTEGER NOT NULL,
    `status_semhas` VARCHAR(50) NOT NULL,
    `bobot_penilaian` INTEGER NOT NULL,
    `komentar` TEXT NOT NULL,
    `id_rubik` INTEGER NOT NULL,
    `id_pendaftaran` INTEGER NOT NULL,

    INDEX `fk_pendaftaran_nilai_semhas`(`id_pendaftaran`),
    INDEX `fk_rubik_nilai_semhas`(`id_rubik`),
    PRIMARY KEY (`id_nilai`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `panduan` (
    `id_panduan` INTEGER NOT NULL,
    `nama_file` VARCHAR(255) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `tanggal_unggah` DATE NOT NULL,
    `niku` INTEGER NOT NULL,

    INDEX `fk_admin_panduan`(`niku`),
    PRIMARY KEY (`id_panduan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pendaftaran` (
    `id_pendaftaran` INTEGER NOT NULL,
    `nim` INTEGER NOT NULL,
    `nama_lengkap` VARCHAR(255) NOT NULL,
    `judul` VARCHAR(799) NOT NULL,
    `bidang_penelitian` VARCHAR(99) NOT NULL,
    `nip_dosen` INTEGER NOT NULL,
    `nim_mhs` INTEGER NOT NULL,
    `nama_laporan` VARCHAR(255) NOT NULL,
    `file_laporan` BLOB NOT NULL,
    `nama_krs` VARCHAR(255) NOT NULL,
    `file_krs` BLOB NOT NULL,
    `nama_pengesahan` VARCHAR(255) NOT NULL,
    `file_pengesahan` BLOB NOT NULL,
    `nama_ppt` VARCHAR(255) NOT NULL,
    `file_ppt` BLOB NOT NULL,
    `id_periode` INTEGER NOT NULL,

    INDEX `fk_dosen_pendaftaran`(`nip_dosen`),
    INDEX `fk_mahasiswa_pendaftaran`(`nim`),
    INDEX `fk_periode_semhas_pendaftaran`(`id_periode`),
    PRIMARY KEY (`id_pendaftaran`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `periode_semhas` (
    `id_periode` INTEGER NOT NULL,
    `semester` INTEGER NOT NULL,
    `tanggal_buka` DATE NOT NULL,
    `tanggal_tutup` DATE NOT NULL,
    `status` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id_periode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rubik` (
    `id_rubik` INTEGER NOT NULL,
    `kriteria` VARCHAR(255) NOT NULL,
    `bobot` INTEGER NOT NULL,

    PRIMARY KEY (`id_rubik`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admin` ADD CONSTRAINT `fk_user_admin` FOREIGN KEY (`email`) REFERENCES `user`(`email`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dosen` ADD CONSTRAINT `fk_jadwal_dosen_dosen` FOREIGN KEY (`id_jadwal_dosen`) REFERENCES `jadwal_dosen`(`id_jadwal_dosen`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dosen` ADD CONSTRAINT `fk_user_dosen` FOREIGN KEY (`email`) REFERENCES `user`(`email`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `evaluasi_sistem` ADD CONSTRAINT `fk_mahasiswa_evaluasi_sistem` FOREIGN KEY (`nim`) REFERENCES `mahasiswa`(`nim`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `jadwal_pendaftaran` ADD CONSTRAINT `fk_kuota_semhas_jadwal_pendaftaran` FOREIGN KEY (`id_kuota`) REFERENCES `kuota_semhas`(`id_kuota`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `jadwal_pendaftaran` ADD CONSTRAINT `fk_pendaftaran_jadwal_pendaftaran` FOREIGN KEY (`id_pendaftaran`) REFERENCES `pendaftaran`(`id_pendaftaran`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kadep` ADD CONSTRAINT `fk_user_kadep` FOREIGN KEY (`email`) REFERENCES `user`(`email`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `mahasiswa` ADD CONSTRAINT `fk_user_mahasiswa` FOREIGN KEY (`email`) REFERENCES `user`(`email`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `nilai_semhas` ADD CONSTRAINT `fk_pendaftaran_nilai_semhas` FOREIGN KEY (`id_pendaftaran`) REFERENCES `pendaftaran`(`id_pendaftaran`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `nilai_semhas` ADD CONSTRAINT `fk_rubik_nilai_semhas` FOREIGN KEY (`id_rubik`) REFERENCES `rubik`(`id_rubik`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `panduan` ADD CONSTRAINT `fk_admin_panduan` FOREIGN KEY (`niku`) REFERENCES `admin`(`niku`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pendaftaran` ADD CONSTRAINT `fk_dosen_pendaftaran` FOREIGN KEY (`nip_dosen`) REFERENCES `dosen`(`nip_dosen`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pendaftaran` ADD CONSTRAINT `fk_mahasiswa_pendaftaran` FOREIGN KEY (`nim`) REFERENCES `mahasiswa`(`nim`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pendaftaran` ADD CONSTRAINT `fk_periode_semhas_pendaftaran` FOREIGN KEY (`id_periode`) REFERENCES `periode_semhas`(`id_periode`) ON DELETE NO ACTION ON UPDATE NO ACTION;
