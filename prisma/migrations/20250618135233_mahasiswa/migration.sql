-- CreateTable
CREATE TABLE `berkas_pdf` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_file` VARCHAR(255) NOT NULL,
    `tipe` VARCHAR(50) NOT NULL,
    `file` BLOB NOT NULL,
    `uploaded_by` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `berkas_pdf_uploaded_by_idx`(`uploaded_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin` (
    `niku` VARCHAR(50) NOT NULL,
    `nama_admin` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `admin_email_key`(`email`),
    INDEX `admin_email_idx`(`email`),
    PRIMARY KEY (`niku`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dosen` (
    `id_user` VARCHAR(50) NOT NULL,
    `bidang_keahlian` VARCHAR(99) NULL,
    `id_jadwal_dosen` VARCHAR(50) NOT NULL,

    INDEX `fk_jadwal_dosen_dosen`(`id_jadwal_dosen`),
    INDEX `fk_user_dosen`(`id_user`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evaluasi_sistem` (
    `id_evaluasi` VARCHAR(50) NOT NULL,
    `kualitas_ui` VARCHAR(100) NOT NULL,
    `kinerja_sistem` VARCHAR(100) NOT NULL,
    `kritik_saran` TEXT NOT NULL,
    `tanggal_isi` DATE NOT NULL,
    `nim` VARCHAR(50) NOT NULL,

    INDEX `fk_mahasiswa_evaluasi_sistem`(`nim`),
    PRIMARY KEY (`id_evaluasi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jadwal_dosen` (
    `id_jadwal_dosen` VARCHAR(50) NOT NULL,
    `tanggal_mulai` DATE NOT NULL,
    `tanggal_selesai` DATE NOT NULL,

    PRIMARY KEY (`id_jadwal_dosen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jadwal_pendaftaran` (
    `id_jadwal` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pendaftaran` INTEGER NOT NULL,
    `jam_mulai` TIME(0) NOT NULL,
    `jam_selesai` TIME(0) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `dosen_penguji` VARCHAR(99) NOT NULL,
    `id_kuota` VARCHAR(50) NOT NULL,

    INDEX `fk_kuota_semhas_jadwal_pendaftaran`(`id_kuota`),
    INDEX `fk_pendaftaran_jadwal_pendaftaran`(`id_pendaftaran`),
    PRIMARY KEY (`id_jadwal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kadep` (
    `nip_kadep` VARCHAR(50) NOT NULL,
    `nama_kadep` VARCHAR(99) NOT NULL,
    `email` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `kadep_email_key`(`email`),
    INDEX `kadep_email_idx`(`email`),
    PRIMARY KEY (`nip_kadep`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kuota_semhas` (
    `id_kuota` VARCHAR(50) NOT NULL,
    `kuota_max` INTEGER NOT NULL,
    `minggu` TIME(0) NOT NULL,

    PRIMARY KEY (`id_kuota`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nilai_semhas` (
    `id_nilai` VARCHAR(50) NOT NULL,
    `status_semhas` VARCHAR(50) NOT NULL,
    `bobot_penilaian` INTEGER NOT NULL,
    `komentar` TEXT NOT NULL,
    `id_rubik` VARCHAR(50) NOT NULL,
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
    `niku` VARCHAR(191) NOT NULL,

    INDEX `fk_admin_panduan`(`niku`),
    PRIMARY KEY (`id_panduan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pendaftaran` (
    `id_pendaftaran` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(799) NULL,
    `bidang_penelitian` VARCHAR(99) NULL,
    `nip_dosen` VARCHAR(50) NULL,
    `nama_laporan` VARCHAR(255) NULL,
    `file_laporan` BLOB NULL,
    `nama_krs` VARCHAR(255) NULL,
    `file_krs` BLOB NULL,
    `nama_pengesahan` VARCHAR(255) NULL,
    `file_pengesahan` BLOB NULL,
    `nama_ppt` VARCHAR(255) NULL,
    `file_ppt` BLOB NULL,
    `id_periode` VARCHAR(50) NULL,
    `id_user` VARCHAR(50) NOT NULL,

    INDEX `fk_dosen_pendaftaran`(`nip_dosen`),
    INDEX `fk_periode_semhas_pendaftaran`(`id_periode`),
    PRIMARY KEY (`id_pendaftaran`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `periode_semhas` (
    `id_periode` VARCHAR(50) NOT NULL,
    `semester` INTEGER NOT NULL,
    `tanggal_buka` DATE NOT NULL,
    `tanggal_tutup` DATE NOT NULL,
    `status` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id_periode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rubik` (
    `id_rubik` VARCHAR(50) NOT NULL,
    `kriteria` VARCHAR(255) NOT NULL,
    `bobot` INTEGER NOT NULL,

    PRIMARY KEY (`id_rubik`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `password` VARCHAR(99) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    `id_user` VARCHAR(50) NULL,
    `nama_lengkap` VARCHAR(99) NOT NULL,

    UNIQUE INDEX `id_user`(`id_user`),
    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `berkas_pdf` ADD CONSTRAINT `berkas_pdf_uploaded_by_fkey` FOREIGN KEY (`uploaded_by`) REFERENCES `user`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin` ADD CONSTRAINT `fk_user_admin` FOREIGN KEY (`email`) REFERENCES `user`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dosen` ADD CONSTRAINT `dosen_id_jadwal_dosen_fkey` FOREIGN KEY (`id_jadwal_dosen`) REFERENCES `jadwal_dosen`(`id_jadwal_dosen`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dosen` ADD CONSTRAINT `dosen_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jadwal_pendaftaran` ADD CONSTRAINT `fk_kuota_semhas_jadwal_pendaftaran` FOREIGN KEY (`id_kuota`) REFERENCES `kuota_semhas`(`id_kuota`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `jadwal_pendaftaran` ADD CONSTRAINT `fk_pendaftaran_jadwal_pendaftaran` FOREIGN KEY (`id_pendaftaran`) REFERENCES `pendaftaran`(`id_pendaftaran`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `kadep` ADD CONSTRAINT `fk_user_kadep` FOREIGN KEY (`email`) REFERENCES `user`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nilai_semhas` ADD CONSTRAINT `fk_pendaftaran_nilai_semhas` FOREIGN KEY (`id_pendaftaran`) REFERENCES `pendaftaran`(`id_pendaftaran`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `nilai_semhas` ADD CONSTRAINT `fk_rubik_nilai_semhas` FOREIGN KEY (`id_rubik`) REFERENCES `rubik`(`id_rubik`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `panduan` ADD CONSTRAINT `fk_admin_panduan` FOREIGN KEY (`niku`) REFERENCES `admin`(`niku`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pendaftaran` ADD CONSTRAINT `pendaftaran_id_periode_fkey` FOREIGN KEY (`id_periode`) REFERENCES `periode_semhas`(`id_periode`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pendaftaran` ADD CONSTRAINT `pendaftaran_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
