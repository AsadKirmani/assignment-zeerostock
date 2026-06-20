import type { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

// High utility middleware wrapper that accepts any target Zod schema template
export const validateRequest = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and rewrite req.body with the sanitized and formatted Zod conversions
      req.body = await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Map complex nested Zod issues arrays into an accessible client dictionary
        const formattedErrors = error.issues.reduce((acc, current) => {
          const key = current.path[0] as string;
          acc[key] = current.message;
          return acc;
        }, {} as Record<string, string>);

        return res.status(400).json({
          status: 'error',
          message: 'API Request boundary validation failed.',
          errors: formattedErrors
        });
      }

      return res.status(500).json({ status: 'error', message: 'Internal validation failure' });
    }
  };
};
