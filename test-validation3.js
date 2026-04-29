const { z } = require("zod");

const taskBaseSchema = z.object({
  checklistCompleted: z.number().int().min(0).max(20).default(0),
  checklistTotal: z.number().int().min(0).max(20).default(3),
});

const updateTaskSchema = taskBaseSchema.partial();

console.log(updateTaskSchema.safeParse({ checklistCompleted: undefined }));
console.log(updateTaskSchema.safeParse({}));
console.log(updateTaskSchema.safeParse({ checklistCompleted: 5 }));
