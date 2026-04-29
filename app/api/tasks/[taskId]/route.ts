import { NextRequest } from "next/server";
import { Types } from "mongoose";

import { apiError, apiSuccess, getErrorMessage } from "@/lib/api";
import { getCurrentUserFromRequest } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { serializeTask } from "@/lib/serializers";
import { updateTaskSchema } from "@/lib/validations/task";
import { Task } from "@/models/Task";

type RouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUserFromRequest(request);

    if (!user) {
      return apiError("Unauthorized.", 401);
    }

    const { taskId } = await context.params;

    if (!taskId) {
      return apiError("Task ID is required.", 400);
    }

    if (!Types.ObjectId.isValid(taskId)) {
      return apiError("Invalid task ID.", 400);
    }

    const body = await request.json();
    const parsed = updateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Invalid task update.");
    }

    await connectToDatabase();

    const existingTask = await Task.findOne({
      _id: taskId,
      userId: user.userId,
    });

    if (!existingTask) {
      return apiError("Task not found.", 404);
    }

    const nextStatus =
      parsed.data.status ??
      (parsed.data.completed === true
        ? "done"
        : parsed.data.completed === false && existingTask.status === "done"
          ? "backlog"
          : existingTask.status ?? (existingTask.completed ? "done" : "backlog"));

    const updateData = {
      ...parsed.data,
      status: nextStatus,
      completed: nextStatus === "done" ? true : (parsed.data.completed ?? false),
      dueDate:
        parsed.data.dueDate === undefined
          ? undefined
          : parsed.data.dueDate?.trim()
            ? new Date(`${parsed.data.dueDate}T00:00:00.000Z`)
            : null,
    };

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId: user.userId },
      updateData,
      {
        new: true,
      },
    );

    if (!task) {
      return apiError("Task not found.", 404);
    }

    return apiSuccess({ task: serializeTask(task) });
  } catch (error) {
    return apiError(getErrorMessage(error), 500);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUserFromRequest(request);

    if (!user) {
      return apiError("Unauthorized.", 401);
    }

    const { taskId } = await context.params;

    if (!taskId) {
      return apiError("Task ID is required.", 400);
    }

    if (!Types.ObjectId.isValid(taskId)) {
      return apiError("Invalid task ID.", 400);
    }

    await connectToDatabase();

    const task = await Task.findOneAndDelete({
      _id: taskId,
      userId: user.userId,
    });

    if (!task) {
      return apiError("Task not found.", 404);
    }

    return apiSuccess({ message: "Task deleted successfully." });
  } catch (error) {
    return apiError(getErrorMessage(error), 500);
  }
}
