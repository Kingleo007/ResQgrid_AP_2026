// =============================================================================
// src/middleware/validate.js — Zod request body validation middleware
// Wraps Zod schema.safeParse() and returns a structured 400 error on failure.
// On success, replaces req.body with the parsed (and coerced) output.
// =============================================================================

/**
 * Middleware factory. Validates req.body against a Zod schema.
 * On failure: responds 400 with error envelope.
 * On success: sets req.body to schema output and calls next().
 *
 * @param {import('zod').ZodTypeAny} schema
 * @returns {import('express').RequestHandler}
 */
export function validate(schema) {
  return function validationMiddleware(req, res, next) {
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
