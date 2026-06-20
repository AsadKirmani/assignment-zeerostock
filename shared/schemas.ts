import { z }from 'zod';

export const studentSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[A-Za-z\s]+$/, "Name can only contain alphabetic characters and spaces"),
  
  rollNumber: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .pipe(
      z.number({ error: "Roll number is required" })
       .int("Roll number must be an integer")
       .positive("Roll number must be a positive number")
    ),
  
  grade: z
    .string()
    .min(1, "Grade/Class label is required")
    .transform((val) => val.trim().toUpperCase()),
  
  age: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((val) => (val === "" || val === null || val === undefined ? null : Number(val)))
    .pipe(
      z.number().int().min(4, "Minimum age is 4").max(100, "Maximum age is 100").nullable()
    )
});

export const markSchema = z.object({
  subject: z
    .string()
    .min(1, "Subject name is required")
    .transform((val) => val.trim().toLowerCase()),
    
  score: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .pipe(
      z.number()
       .int("Score must be an integer")
       .min(0, "Score cannot be less than 0")
       .max(100, "Score cannot exceed 100")
    )
});

export type StudentInput = z.infer<typeof studentSchema>;
export type MarkInput = z.infer<typeof markSchema>;
