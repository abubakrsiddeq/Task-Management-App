import {
  TASK_ASSIGNEE_OPTIONS,
  TASK_BOARD_COLUMNS,
  TASK_LABEL_OPTIONS,
  TASK_PRIORITIES,
  TASK_STATUS_FILTERS,
} from "@/lib/constants";

export type Priority = (typeof TASK_PRIORITIES)[number];
export type TaskStatusFilter = (typeof TASK_STATUS_FILTERS)[number];
export type TaskBoardStatus = (typeof TASK_BOARD_COLUMNS)[number]["id"];
export type TaskLabel = (typeof TASK_LABEL_OPTIONS)[number]["id"];
export type TaskAssignee = (typeof TASK_ASSIGNEE_OPTIONS)[number]["id"];

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
  status: TaskBoardStatus;
  label: TaskLabel;
  assignee: TaskAssignee;
  dueDate?: string | Date | null;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
};
