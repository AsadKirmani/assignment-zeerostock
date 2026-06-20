/*
  Warnings:

  - You are about to drop the column `Age` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rollNumber]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rollNumber` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "Age",
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "rollNumber" INTEGER NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_rollNumber_key" ON "Student"("rollNumber");
