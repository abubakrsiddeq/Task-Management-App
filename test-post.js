const { z } = require("zod");

const taskBaseSchema = z.object({
  title: z.string(),
  dueDate: z.string().optional().or(z.literal("")),
});

console.log(taskBaseSchema.safeParse({ title: "test", dueDate: "2026-05-05" }));
