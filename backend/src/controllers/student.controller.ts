import type { Request, Response } from "express";
import { StudentService } from "../services/student.service.js";
import type { ApiResponse } from "@shared/types.js";
import { errorHandler } from "../middleware/error.middleware.js";
import type { Mark, Student } from "../generated/prisma/client.js";
import { Prisma } from "../generated/prisma/client.js";

export const StudentController = {
  createStudent: async (req: Request, res: Response<ApiResponse<Student>>) => {
    try {
      const studentData = req.body;
      const newStudent = await StudentService.createStudent(studentData);
      res.status(201).json({ status: 'success', data: newStudent });
    } catch (error) {
        errorHandler(error, req, res, () => {});
    }
  },

  getAllStudents: async (req: Request, res: Response<ApiResponse<Student[]>>) => {
    try {
      const page = Number(req.query._page) || 1;
      const limit = Number(req.query._limit) || 10;
      const sortField = (req.query._sort as string) || "id";
      const sortOrder = (req.query._order as string) || "asc";
      const search = (req.query.q as string) || "";

      const { students, totalCount } = await StudentService.getAllStudents({
        page,
        limit,
        sortField,
        sortOrder,
        search,
      });

      res.setHeader("x-total-count", String(totalCount));
      res.setHeader("Access-Control-Expose-Headers", "x-total-count"); 

      return res.json({ status: 'success', data: students });
    } catch (error) {
      return errorHandler(error, req, res, () => {});
    }
  },

  getStudentById: async (req: Request, res: Response<ApiResponse<Student | null>>) => {
    try {
      const id = req.params.id!.toString();
      const student = await StudentService.getStudentById(id);
      if (student) {
        res.status(200).json({ status: 'success', data: student });
      } else {
        res.status(404).json({ status: 'error', data: null, message: "Student not found" });
      }
    } catch (error) {
      errorHandler(error, req, res, () => {});  
    }
  },

  updateStudent: async (req: Request, res: Response<ApiResponse<Student | null>>) => {
    try {
      const id = req.params.id!.toString();
      const studentData = req.body;
      const updatedStudent = await StudentService.updateStudent(id, studentData);
      if (updatedStudent) {
        res.status(200).json({ status: 'success', data: updatedStudent });
      } else {
        res.status(404).json({ status: 'error', data: null, message: "Student not found" });
      }
    } catch (error) {
      errorHandler(error, req, res, () => {});
    }
  },

  deleteStudent: async (req: Request, res: Response<ApiResponse<Student | null>>) => {
    try {
      const id = req.params.id!.toString();
      const deleted = await StudentService.deleteStudent(id);
      if (deleted) {
        res.status(200).json({ status: 'success', data: deleted, message: "Student deleted successfully" });
      } else {
        res.status(404).json({ status: 'error', data: null, message: "Student not found" });
      }
    } catch (error) {
      errorHandler(error, req, res, () => {});
    }
  },

  createMarksForStudent: async (req: Request, res: Response<ApiResponse<Mark>>) => {
    try {
      const studentId = req.params.id!.toString();
      const marksData = req.body;
      const newMark = await StudentService.createMarksForStudent(studentId, marksData);
      res.status(201).json({ status: 'success', data: newMark });
    } catch (error) {
      errorHandler(error, req, res, () => {});
    }
  },

  getMarksForStudent: async (req: Request, res: Response<ApiResponse<Mark[]>>) => {
    try {
      const studentId = req.params.id!.toString();
      const marks = await StudentService.getMarksForStudent(studentId);
      res.status(200).json({ status: 'success', data: marks });
    } catch (error) {
      errorHandler(error, req, res, () => {});
    }
  },

  updateMarksForStudent: async (req: Request, res: Response<ApiResponse<Prisma.BatchPayload | null>>) => {
    try {
      const studentId = req.params.id!.toString();
      const markId = req.params.markId!.toString();
      const marksData = req.body;
      const updatedMarks = await StudentService.updateMarksForStudent(markId, studentId, marksData);
      
      if (updatedMarks && updatedMarks.count > 0) {
        res.status(200).json({ status: 'success', data: updatedMarks, message: "Marks updated successfully" });
      } else {
        res.status(404).json({ status: 'error', data: null, message: "Marks not found for the student" });
      }
    } catch (error) {
      errorHandler(error, req, res, () => {});
    }
  },

  deleteMarksForStudent: async (req: Request, res: Response<ApiResponse<Prisma.BatchPayload | null>>) => {
    try {
      const id = req.params.markId!.toString();
      const studentId = req.params.id!.toString();
      const deletedMarks = await StudentService.deleteMarksForStudent(id, studentId);
      
      if (deletedMarks && deletedMarks.count > 0) {
        res.status(200).json({ status: 'success', data: deletedMarks, message: "Marks deleted successfully" });
      } else {
        res.status(404).json({ status: 'error', data: null, message: "Marks not found for the student" });
      }
    } catch (error) {
      errorHandler(error, req, res, () => {});
    }
  },
};
