import { TaskDocument } from "@/models/Task";
import { UserDocument } from "@/models/User";

export function serializeUser(user: UserDocument) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export function serializeTask(task: TaskDocument) {
  const status = task.status ?? (task.completed ? "done" : "backlog");

  return {
    id: String(task._id),
    title: task.title,
    description: task.description ?? "",
    completed: task.completed,
    priority: task.priority,
    status,
    label: task.label ?? "product",
    assignee: task.assignee ?? "owner",
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    order: task.order,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}
