import { prisma } from '../config/db.js';
import type { Mark, Student, Prisma } from "../generated/prisma/client.js";
import type { FetchStudentsArgs } from "@shared/types.js";
export const StudentService = {
  createStudent: async (studentData: Student) => {
    return await prisma.student.create({
      data: studentData,
    });
  },
  
  getAllStudents: async ({ page, limit, sortField, sortOrder, search }: FetchStudentsArgs) => {
    const skip = (page - 1) * limit;
    const take = limit;
    const direction = sortOrder === 'desc' ? 'desc' : 'asc';

    const whereClause = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { grade: { contains: search, mode: 'insensitive' as const } },
            ...(!isNaN(Number(search)) ? [{ rollNumber: Number(search) }] : []),
          ],
        }
      : {};

    const totalCount = await prisma.student.count({
      where: whereClause,
    });

    const students = await prisma.student.findMany({
      where: whereClause,
      skip: skip,
      take: take,
      orderBy: {
        [sortField]: direction,
      },
    });

    return { students, totalCount };
  },

  getStudentById: async (id: string) => {
    return await prisma.student.findUnique({
      where: { id },
    });
  },

  updateStudent: async (id: string, studentData: Student) => {
    const { marks, ...cleanStudentData } = studentData as any;
    
    return await prisma.student.update({
      where: { id },
      data: {
        name: cleanStudentData.name,
        grade: cleanStudentData.grade,
        rollNumber: Number(cleanStudentData.rollNumber),
        age: cleanStudentData.age ? Number(cleanStudentData.age) : null
      },
    });
  },

  deleteStudent: async (id: string) => {
    return await prisma.student.delete({
      where: { id },
    });
  },

  createMarksForStudent: async (studentId: string, marksData: Mark) => {
    return await prisma.mark.create({
      data: {
        score: Number(marksData.score),
        subject: marksData.subject.trim().toLowerCase(),
        studentId: studentId,
      },
    });
  },

  getMarksForStudent: async (studentId: string) => {
    return await prisma.mark.findMany({
      where: { studentId },
      select: {
        id: true,
        subject: true,
        score: true,
        studentId: true,
      },
    });
  },

  updateMarksForStudent: async (id: string, studentId: string, marksData: Mark): Promise<Prisma.BatchPayload> => {
    return await prisma.mark.updateMany({
      where: { id, studentId },
      data: { 
        score: Number(marksData.score), 
        subject: marksData.subject.trim().toLowerCase() 
      },
    });
  },

  deleteMarksForStudent: async (id: string, studentId: string): Promise<Prisma.BatchPayload> => {
    return await prisma.mark.deleteMany({
      where: { id, studentId },
    });
  }
};