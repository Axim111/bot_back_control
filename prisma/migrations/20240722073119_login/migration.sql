/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `login` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `userLogin` on the `Groups` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Groups" DROP CONSTRAINT "Groups_userLogin_fkey";

-- DropIndex
DROP INDEX "User_login_key";

-- AlterTable
ALTER TABLE "Groups" DROP COLUMN "userLogin",
ADD COLUMN     "userLogin" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "login",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- AddForeignKey
ALTER TABLE "Groups" ADD CONSTRAINT "Groups_userLogin_fkey" FOREIGN KEY ("userLogin") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
