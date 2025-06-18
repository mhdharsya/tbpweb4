-- DropForeignKey
ALTER TABLE `admin` DROP FOREIGN KEY `fk_user_admin`;

-- DropForeignKey
ALTER TABLE `dosen` DROP FOREIGN KEY `fk_user_dosen`;

-- DropForeignKey
ALTER TABLE `kadep` DROP FOREIGN KEY `fk_user_kadep`;

-- DropForeignKey
ALTER TABLE `mahasiswa` DROP FOREIGN KEY `fk_user_mahasiswa`;

-- AddForeignKey
ALTER TABLE `admin` ADD CONSTRAINT `fk_user_admin` FOREIGN KEY (`email`) REFERENCES `user`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dosen` ADD CONSTRAINT `fk_user_dosen` FOREIGN KEY (`email`) REFERENCES `user`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kadep` ADD CONSTRAINT `fk_user_kadep` FOREIGN KEY (`email`) REFERENCES `user`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mahasiswa` ADD CONSTRAINT `fk_user_mahasiswa` FOREIGN KEY (`email`) REFERENCES `user`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `admin_email_idx` ON `admin`(`email`);
DROP INDEX `fk_user_admin` ON `admin`;

-- RedefineIndex
CREATE INDEX `dosen_email_idx` ON `dosen`(`email`);
DROP INDEX `fk_user_dosen` ON `dosen`;

-- RedefineIndex
CREATE INDEX `kadep_email_idx` ON `kadep`(`email`);
DROP INDEX `fk_user_kadep` ON `kadep`;

-- RedefineIndex
CREATE INDEX `mahasiswa_email_idx` ON `mahasiswa`(`email`);
DROP INDEX `fk_user_mahasiswa` ON `mahasiswa`;
