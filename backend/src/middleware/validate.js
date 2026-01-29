/**
 * @desc    Middleware to validate request data against a Zod schema
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against
 * @param {'body' | 'query' | 'params'} property - The request property to validate
 * @returns {import('express').RequestHandler}
 */
const validate = (schema, property = 'body') => {
  return async (req, res, next) => {
    try {
      const validatedData = await schema.parseAsync(req[property]);
      // Replace the original data with the validated/transformed data
      req[property] = validatedData;
      next();
    } catch (error) {
      console.error(`❌ Validation Error [${property}]:`, error.errors);

      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }
  };
};

module.exports = validate;
