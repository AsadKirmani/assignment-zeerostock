import express from 'express';
import type { Application, Response } from 'express';
import studentRouter from './routes/student.route.js';
import cors from 'cors';

const app: Application = express();
const PORT: number = 3000;

app.use(express.json());
app.use(cors({
  origin: '*',
}));

app.get('/', (res: Response) => {
  res.status(200).json({ message: 'Welcome to the Student Management API' });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.use('/', studentRouter);