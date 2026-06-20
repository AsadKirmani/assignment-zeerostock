import { Router } from 'express';
import { StudentController } from '../controllers/student.controller.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { markSchema, studentSchema } from '@shared/schemas.js';

const studentRouter = Router();

studentRouter.post("/students", validateRequest(studentSchema), StudentController.createStudent);
studentRouter.get('/students', StudentController.getAllStudents);
studentRouter.get('/students/:id', StudentController.getStudentById);
studentRouter.put("/students/:id", validateRequest(studentSchema), StudentController.updateStudent);
studentRouter.delete('/students/:id', StudentController.deleteStudent);
studentRouter.post("/students/:id/marks", validateRequest(markSchema), StudentController.createMarksForStudent);
studentRouter.get('/students/:id/marks', StudentController.getMarksForStudent);
studentRouter.put("/students/:id/marks/:markId", validateRequest(markSchema), StudentController.updateMarksForStudent);
studentRouter.delete('/students/:id/marks/:markId', StudentController.deleteMarksForStudent);

export default studentRouter;