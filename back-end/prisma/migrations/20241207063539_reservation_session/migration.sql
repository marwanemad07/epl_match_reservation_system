/*
  Warnings:

  - You are about to alter the column `status` on the `Reservation` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(2))`.
  - Added the required column `sessionId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Reservation` ADD COLUMN `sessionId` INTEGER NOT NULL,
    MODIFY `status` ENUM('CONFIRMED', 'TEMP_BOOKED', 'EXPIRED', 'CANCELLED') NOT NULL DEFAULT 'TEMP_BOOKED';

-- CreateTable
CREATE TABLE `ReservationSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expiresAt` DATETIME(3) NOT NULL,
    `expired` BOOLEAN NOT NULL DEFAULT false,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `ReservationSession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReservationSession` ADD CONSTRAINT `ReservationSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
