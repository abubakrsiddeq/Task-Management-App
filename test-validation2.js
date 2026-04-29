const { z } = require("zod");

const TASK_BOARD_COLUMNS = [
  { id: "backlog" },
  { id: "in-progress" },
  { id: "review" },
  { id: "done" },
];

const taskBoardStatuses = TASK_BOARD_COLUMNS.map((column) => column.id);

const updateTaskSchema = z.object({
  status: z.enum(taskBoardStatuses).optional(),
  completed: z.boolean().optional(),
  order: z.number().int().optional(),
}).partial().refine((value) => Object.keys(value).length > 0, "Provide at least one field to update.")
  .refine(
    (value) =>
      value.checklistCompleted === undefined ||
      value.checklistTotal === undefined ||
      value.checklistCompleted <= value.checklistTotal,
    {
      message: "Completed checklist items cannot exceed the total.",
      path: ["checklistCompleted"],
    },
  );

console.log(updateTaskSchema.safeParse({ status: "in-progress", completed: false, order: Date.now() }));
console.log(updateTaskSchema.safeParse({ status: "review", completed: false, order: Date.now() }));
