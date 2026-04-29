import { z } from "zod";

import {

  TASK_BOARD_COLUMNS,
  TASK_LABEL_OPTIONS,
  TASK_PRIORITIES,
  TASK_STATUS_FILTERS,
} from "@/lib/constants";

const taskBoardStatuses = TASK_BOARD_COLUMNS.map((column) => column.id) as [
  (typeof TASK_BOARD_COLUMNS)[number]["id"],
  ...(typeof TASK_BOARD_COLUMNS)[number]["id"][],
];

const taskLabels = TASK_LABEL_OPTIONS.map((option) => option.id) as [
  (typeof TASK_LABEL_OPTIONS)[number]["id"],
  ...(typeof TASK_LABEL_OPTIONS)[number]["id"][],
];



const taskBaseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(120, "Title must be under 120 characters."),
  description: z
    .string()
    .trim()
    .max(500, "Description must be under 500 characters.")
    .optional()
    .or(z.literal("")),
  priority: z.enum(TASK_PRIORITIES),
  status: z.enum(taskBoardStatuses),
  label: z.enum(taskLabels),

  dueDate: z.string().optional().or(z.literal("")),
  completed: z.boolean().optional(),
  order: z.number().int().optional(),
});

export const taskSchema = taskBaseSchema;

export const updateTaskSchema = taskBaseSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, "Provide at least one field to update.");

export const taskQuerySchema = z.object({
  status: z.enum(TASK_STATUS_FILTERS).optional().default("all"),
  q: z.string().trim().max(120).optional().default(""),
});

export type TaskInput = z.infer<typeof taskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
