-- AlterTable
ALTER TABLE `panduan` ADD COLUMN `file_data` BLOB NULL,
    MODIFY `id_panduan` INTEGER NOT NULL AUTO_INCREMENT;
