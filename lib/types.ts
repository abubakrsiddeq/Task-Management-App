import { TASK_PRIORITIES, TASK_STATUS_FILTERS } from "@/lib/constants";

export type Priority = (typeof TASK_PRIORITIES)[number];
export type TaskStatusFilter = (typeof TASK_STATUS_FILTERS)[number];

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  createdAt?: string | Date;
};

export type TaskItem = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string | Date | null;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
};
