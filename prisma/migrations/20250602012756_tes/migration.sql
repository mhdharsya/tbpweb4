-- CreateTable
CREATE TABLE `user` (
    `username` VARCHAR(99) NOT NULL,
    `password` VARCHAR(99) NOT NULL,

    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
