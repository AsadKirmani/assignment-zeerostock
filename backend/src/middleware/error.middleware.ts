export function errorHandler(err: any, _req: any, res: any, _next: any) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ message });
}
