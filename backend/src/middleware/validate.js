export function validate(validatorFn) {
  return function validationMiddleware(req, res, next) {
    const result = validatorFn(req.body);

    if (!result.valid) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request body validation failed',
          details: [{ path: '', message: result.message }],
        },
      });
    }

    next();
  };
}