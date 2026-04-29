import { NextRequest } from "next/server";

import { apiError, apiSuccess, getErrorMessage } from "@/lib/api";
import { getCurrentUserFromRequest } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { serializeTask } from "@/lib/serializers";
import { taskQuerySchema, taskSchema } from "@/lib/validations/task";
import { Task } from "@/models/Task";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(request);

    if (!user) {
      return apiError("Unauthorized.", 401);
    }

    await connectToDatabase();

    const parsedQuery = taskQuerySchema.safeParse({
      status: request.nextUrl.searchParams.get("status") ?? "all",
      q: request.nextUrl.searchParams.get("q") ?? "",
    });

    if (!parsedQuery.success) {
      return apiError("Invalid task filters.");
    }

    const query: {
      userId: string;
      completed?: boolean;
      $or?: Array<{
        title?: { $regex: string; $options: string };
        description?: { $regex: string; $options: string };
      }>;
    } = {
      userId: user.userId,
    };

    if (parsedQuery.data.status === "completed") {
      query.completed = true;
    }

    if (parsedQuery.data.status === "pending") {
      query.completed = false;
    }

    if (parsedQuery.data.q) {
      query.$or = [
        { title: { $regex: parsedQuery.data.q, $options: "i" } },
        { description: { $regex: parsedQuery.data.q, $options: "i" } },
      ];
    }

    const tasks = await Task.find(query).sort({
      order: 1,
      createdAt: -1,
    });

    return apiSuccess({
      tasks: tasks.map((task) => serializeTask(task)),
    });
  } catch (error) {
    return apiError(getErrorMessage(error), 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(request);

    if (!user) {
      return apiError("Unauthorized.", 401);
    }

    const body = await request.json();
    const parsed = taskSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Invalid task details.");
    }

    await connectToDatabase();

    const dueDate = parsed.data.dueDate?.trim() ? new Date(`${parsed.data.dueDate}T00:00:00.000Z`) : null;
    const completed = parsed.data.status === "done" ? true : (parsed.data.completed ?? false);

    const task = await Task.create({
      userId: user.userId,
      title: parsed.data.title,
      description: parsed.data.description || "",
      priority: parsed.data.priority,
      completed,
      status: parsed.data.status,
      label: parsed.data.label,
      assignee: parsed.data.assignee,
      dueDate,
      order: parsed.data.order ?? Date.now(),
    });

    return apiSuccess({ task: serializeTask(task) }, { status: 201 });
  } catch (error) {
    return apiError(getErrorMessage(error), 500);
  }
}
