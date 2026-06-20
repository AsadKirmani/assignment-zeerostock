/*
  Warnings:

  - A unique constraint covering the columns `[subject]` on the table `Mark` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Mark_subject_key" ON "Mark"("subject");
