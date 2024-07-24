/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Groups" DROP CONSTRAINT "Groups_userLogin_fkey";

-- AlterTable
ALTER TABLE "Groups" ALTER COLUMN "userLogin" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Groups" ADD CONSTRAINT "Groups_userLogin_fkey" FOREIGN KEY ("userLogin") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
