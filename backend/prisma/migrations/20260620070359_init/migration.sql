/*
  Warnings:

  - A unique constraint covering the columns `[studentId,subject]` on the table `Mark` will be added. If there are existing duplicate values, this will fail.
  - Made the column `studentId` on table `Mark` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Mark" ALTER COLUMN "studentId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Mark_studentId_subject_key" ON "Mark"("studentId", "subject");
