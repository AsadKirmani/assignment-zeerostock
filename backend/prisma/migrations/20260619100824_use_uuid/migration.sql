/*
  Warnings:

  - The primary key for the `Mark` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `subjects` on the `Mark` table. All the data in the column will be lost.
  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `class` on the `Student` table. All the data in the column will be lost.
  - Added the required column `score` to the `Mark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `Mark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Mark" DROP CONSTRAINT "Mark_studentId_fkey";

-- AlterTable
ALTER TABLE "Mark" DROP CONSTRAINT "Mark_pkey",
DROP COLUMN "subjects",
ADD COLUMN     "score" INTEGER NOT NULL,
ADD COLUMN     "subject" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "studentId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Mark_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Mark_id_seq";

-- AlterTable
ALTER TABLE "Student" DROP CONSTRAINT "Student_pkey",
DROP COLUMN "class",
ADD COLUMN     "grade" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Student_id_seq";

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
