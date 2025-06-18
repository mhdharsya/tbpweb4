-- DropForeignKey
ALTER TABLE `mahasiswa` DROP FOREIGN KEY `fk_user_mahasiswa`;

-- AlterTable
ALTER TABLE `mahasiswa` MODIFY `email` VARCHAR(100) NULL;

-- AddForeignKey
ALTER TABLE `mahasiswa` ADD CONSTRAINT `fk_mahasiswa_user` FOREIGN KEY (`email`) REFERENCES `user`(`email`) ON DELETE SET NULL ON UPDATE CASCADE;
