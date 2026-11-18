
export function validate(schema) {
  return function validationMiddleware(req, res, next) {
    // Native validators return { valid, message }; Zod schemas expose safeParse.
    if (typeof schema.safeParse !== 'function') {
      const result = schema(req.body);
      if (!result.valid) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Request body validation failed',
            details: [{ path: '', message: result.message }],
          },
        });
      }
      return next();
    }

    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.errors.map(e => ({
        path:    e.path.join('.'),
        message: e.message,
      }));

      return res.status(400).json({
        error: {
          code:    'VALIDATION_ERROR',
          message: 'Request body validation failed',
          details,
        },
      });
    }

    req.body = result.data;
    next();
  };
}
