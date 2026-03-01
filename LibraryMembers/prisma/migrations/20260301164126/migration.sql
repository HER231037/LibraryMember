/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `LibraryMember` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "LibraryMember" ADD COLUMN     "email" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "LibraryMember_email_key" ON "LibraryMember"("email");
