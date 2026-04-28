"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  LoaderCircle,
  LogOut,
  Plus,
  Search,
  Trash2,
  CalendarDays,
  Flag,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatDate, isOverdue } from "@/lib/utils";
import { type SessionUser, type TaskItem, type TaskStatusFilter } from "@/lib/types";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";

type TaskDashboardProps = {
  user: SessionUser;
};

type TaskPayload = {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  completed?: boolean;
};

const priorityVariants = {
  low: "default",
  medium: "warning",
  high: "danger",
} as const;

export function TaskDashboard({ user }: TaskDashboardProps) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [status, setStatus] = useState<TaskStatusFilter>("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<TaskPayload["priority"] | "all">("all");

  useEffect(() => {
    void fetchTasks(status, debouncedSearch);
  }, [status, debouncedSearch]);

  async function fetchTasks(nextStatus: TaskStatusFilter, nextSearch: string) {
    try {
      setIsLoading(true);

      const params = new URLSearchParams();
      params.set("status", nextStatus);
      if (nextSearch.trim()) {
        params.set("q", nextSearch.trim());
      }

      const response = await fetch(`/api/tasks?${params.toString()}`, {
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to load tasks.");
      }

      setTasks(result.data.tasks);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load tasks.");
    } finally {
      setIsLoading(false);
    }
  }

  async function saveTask(values: TaskPayload, taskToEdit?: TaskItem | null) {
    try {
      setIsSubmitting(true);
      const activeTask = taskToEdit ?? editingTask;
      const taskId = activeTask?.id;
      const payload = {
        ...values,
        dueDate: values.dueDate?.trim() ? values.dueDate.trim() : undefined,
      };

      const response = await fetch(
        taskId ? `/api/tasks/${taskId}` : "/api/tasks",
        {
          method: taskId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to save task.");
      }

      toast.success(activeTask ? "Task updated." : "Task created.");
      setEditingTask(null);
      setIsDialogOpen(false);
      await fetchTasks(status, debouncedSearch);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save task.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to delete task.");
      }

      toast.success("Task deleted.");
      await fetchTasks(status, debouncedSearch);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete task.");
    }
  }

  async function handleToggleComplete(task: TaskItem) {
    await saveTask(
      {
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "",
      completed: !task.completed,
      },
      task,
    );
  }

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } finally {
      setIsLoggingOut(false);
    }
  }

  const filteredTasks = tasks.filter(
    (task) => priorityFilter === "all" || task.priority === priorityFilter,
  );

  const counts = {
    total: tasks.length,
    completed: tasks.filter((task) => task.completed).length,
    pending: tasks.filter((task) => !task.completed).length,
    overdue: tasks.filter((task) => isOverdue(task.dueDate) && !task.completed).length,
  };

  return (
    <>
      <div className="min-h-screen bg-zinc-50 text-slate-900 dark:bg-zinc-950 dark:text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
          <aside className="border-b border-zinc-200 bg-white/95 px-6 py-8 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-cyan-300">
                  TaskFlow
                </p>
                <h1 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">Dashboard</h1>
              </div>
            </div>

            <nav className="mt-10 space-y-2">
              <div className="flex items-center gap-3 rounded-3xl bg-slate-950 px-4 py-3 text-sm font-medium text-white shadow-sm dark:bg-white dark:text-slate-950">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </div>
              <Link
                className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                href="/"
              >
                <CalendarDays className="h-4 w-4" />
                Home
              </Link>
            </nav>

            <Separator className="my-8" />

            <div className="space-y-3 rounded-[1.75rem] border border-zinc-200 bg-slate-50 p-5 text-sm dark:border-zinc-800 dark:bg-slate-900/90">
              <p className="font-semibold text-slate-950 dark:text-slate-100">Signed in as</p>
              <div className="space-y-1">
                <p className="text-base font-semibold text-slate-900 dark:text-white">{user.name}</p>
                <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>
              <Button
                className="w-full"
                disabled={isLoggingOut}
                onClick={handleLogout}
                variant="outline"
              >
                {isLoggingOut ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                Logout
              </Button>
            </div>
          </aside>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
            <div className="space-y-8">
              <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/95">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-indigo-600 dark:text-cyan-300">
                      Overview
                    </p>
                    <h2 className="text-3xl font-semibold text-slate-950 dark:text-white">
                      Keep your tasks clear and easy to manage.
                    </h2>
                    <p className="max-w-2xl text-slate-600 dark:text-slate-400">
                      Quickly find, filter, and update tasks in a calm, well-structured dashboard.
                    </p>
                  </div>
                  <Button onClick={() => setIsDialogOpen(true)} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create task
                  </Button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricCard description="All current work" title="Total tasks" value={counts.total} />
                  <MetricCard description="Already completed" title="Completed" value={counts.completed} />
                  <MetricCard description="Requires attention" title="Pending" value={counts.pending} />
                  <MetricCard description="Late work that needs review" title="Overdue" value={counts.overdue} />
                </div>
              </section>

              <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/95">
                <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div className="relative w-full max-w-xl">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      className="pl-11"
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search tasks by title or description"
                      value={search}
                    />
                    {search ? (
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                        onClick={() => setSearch("")}
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 justify-end">
                    {(["all", "pending", "completed"] as TaskStatusFilter[]).map((filter) => (
                      <Button
                        key={filter}
                        onClick={() => setStatus(filter)}
                        size="sm"
                        variant={status === filter ? "default" : "outline"}
                      >
                        {filter}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Priority:</span>
                  {(["all", "low", "medium", "high"] as const).map((filter) => (
                    <Button
                      key={filter}
                      onClick={() => setPriorityFilter(filter)}
                      size="sm"
                      variant={priorityFilter === filter ? "default" : "outline"}
                    >
                      {filter === "all" ? "All" : filter}
                    </Button>
                  ))}
                </div>

                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                  Results update automatically as you search, filter, and sort your tasks.
                </p>

                {isLoading ? (
                  <TaskListSkeleton />
                ) : tasks.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                      <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-900">
                        <CheckCircle2 className="h-8 w-8 text-zinc-500" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                          No tasks found
                        </h3>
                        <p className="max-w-md text-zinc-500 dark:text-zinc-400">
                          Create your first task or adjust the active filters to see matching work.
                        </p>
                      </div>
                      <Button onClick={() => setIsDialogOpen(true)}>
                        <Plus className="h-4 w-4" />
                        Add task
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {filteredTasks.map((task) => (
                      <Card
                        key={task.id}
                        className={`overflow-hidden transition hover:-translate-y-0.5 hover:shadow-xl ${
                          task.dueDate && isOverdue(task.dueDate) && !task.completed
                            ? "border border-rose-200 dark:border-rose-500"
                            : "border border-zinc-200 dark:border-zinc-800"
                        }`}
                      >
                        <CardContent className="p-0">
                          <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex gap-4">
                              <button
                                className="mt-0.5 rounded-full border border-zinc-200 p-2 text-zinc-500 transition hover:border-slate-400 hover:text-slate-900 dark:border-zinc-800 dark:hover:border-slate-600 dark:hover:text-slate-100"
                                onClick={() => void handleToggleComplete(task)}
                                type="button"
                              >
                                {task.completed ? (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                ) : (
                                  <Circle className="h-5 w-5" />
                                )}
                              </button>

                              <div className="space-y-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3
                                    className={`text-lg font-semibold ${
                                      task.completed
                                        ? "text-slate-400 line-through dark:text-slate-500"
                                        : "text-slate-950 dark:text-white"
                                    }`}
                                  >
                                    {task.title}
                                  </h3>
                                  <Badge variant={priorityVariants[task.priority]}>
                                    <Flag className="mr-1 h-3 w-3" />
                                    {task.priority}
                                  </Badge>
                                  <Badge variant={task.completed ? "success" : "outline"}>
                                    {task.completed ? "Completed" : "Pending"}
                                  </Badge>
                                </div>

                                {task.description ? (
                                  <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    {task.description}
                                  </p>
                                ) : null}

                                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 dark:border-slate-800 dark:bg-slate-950/90">
                                    <CalendarDays className="h-4 w-4" />
                                    Due {formatDate(task.dueDate)}
                                  </span>
                                  <span>Updated {formatDate(task.updatedAt)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => {
                                  setEditingTask(task);
                                  setIsDialogOpen(true);
                                }}
                                size="sm"
                                variant="outline"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => void handleDeleteTask(task.id)}
                                size="sm"
                                variant="ghost"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </main>
        </div>
      </div>

      <TaskFormDialog
        initialTask={editingTask}
        isSubmitting={isSubmitting}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingTask(null);
          }
        }}
        onSubmit={(values) => saveTask(values, editingTask)}
        open={isDialogOpen}
      />
    </>
  );
}

function MetricCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <Card className="border-zinc-200/80 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/50">
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      </CardContent>
    </Card>
  );
}

function TaskListSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-5 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-full max-w-2xl" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
