const { default: z } = require("zod");

const feedbackValidation = z.object({
  driver_id: z.coerce.number().min(1, "Driver ID must be a positive number"),
  child_id: z.coerce.number().min(1, "Child ID must be a positive number"),
  comments: z.coerce
    .string()
    .min(2, "Feedback must be at least 2 characters")
    .trim(),
  rating: z.coerce
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5")
    .optional(),
});

module.exports = {
  feedbackValidation,
};
