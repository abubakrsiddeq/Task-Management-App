"use client";

import {
  useDeferredValue,
  useEffect,
  useState,
  type DragEvent,
} from "react";
import {
  CalendarDays,
  CheckCheck,
  LayoutGrid,
  LoaderCircle,
  LogOut,
  MoreHorizontal,
  PencilLine,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { ProfileFormDialog } from "@/components/tasks/profile-form-dialog";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TASK_ASSIGNEE_OPTIONS,
  TASK_BOARD_COLUMNS,
} from "@/lib/constants";
import { cn, formatDate, getInitials, isOverdue } from "@/lib/utils";
import {
  type Priority,
  type SessionUser,
  type TaskAssignee,
  type TaskBoardStatus,
  type TaskItem,
  type TaskLabel,
} from "@/lib/types";

type TaskDashboardProps = {
  user: SessionUser;
};

type TaskPayload = {
  title: string;
  description?: string;
  priority: Priority;
  status: TaskBoardStatus;
  label: TaskLabel;
  assignee: TaskAssignee;
  dueDate?: string;
  completed?: boolean;
  order?: number;
};

const priorityFilterOptions: Array<Priority | "all"> = [
  "all",
  "low",
  "medium",
  "high",
];

const priorityMeta: Record<
  Priority,
  { label: string; className: string; progressClassName: string }
> = {
  low: {
    label: "Low priority",
    className: "border border-slate-500/10 bg-slate-500/10 text-slate-400",
    progressClassName: "bg-slate-500 shadow-[0_0_12px_rgba(100,116,139,0.5)]",
  },
  medium: {
    label: "Medium priority",
    className: "border border-orange-500/10 bg-orange-500/10 text-orange-400",
    progressClassName: "bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.5)]",
  },
  high: {
    label: "High priority",
    className: "border border-red-500/10 bg-red-500/10 text-red-400",
    progressClassName: "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]",
  },
};

const labelMeta: Record<TaskLabel, { label: string; className: string }> = {
  "email-campaign": {
    label: "Email Campaign",
    className: "border border-fuchsia-500/10 bg-fuchsia-500/10 text-fuchsia-400",
  },
  blog: {
    label: "Blog",
    className: "border border-teal-500/10 bg-teal-500/10 text-teal-400",
  },
  website: {
    label: "Website",
    className: "border border-amber-500/10 bg-amber-500/10 text-amber-400",
  },
  "social-media": {
    label: "Social Media",
    className: "border border-pink-500/10 bg-pink-500/10 text-pink-400",
  },
  design: {
    label: "Design",
    className: "border border-cyan-500/10 bg-cyan-500/10 text-cyan-400",
  },
  product: {
    label: "Product",
    className: "border border-indigo-500/10 bg-indigo-500/10 text-indigo-400",
  },
};

const columnMeta: Record<
  TaskBoardStatus,
  {
    badgeClassName: string;
    dotClassName: string;
    surfaceClassName: string;
    dropClassName: string;
  }
> = {
  backlog: {
    badgeClassName: "border border-slate-500/20 bg-slate-500/10 text-slate-300",
    dotClassName: "bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.6)]",
    surfaceClassName: "bg-slate-900/30 border border-white/[0.03] shadow-2xl backdrop-blur-xl",
    dropClassName: "border-slate-500/40 bg-slate-900/60 shadow-[0_0_30px_rgba(71,85,105,0.2)]",
  },
  "in-progress": {
    badgeClassName: "border border-blue-500/20 bg-blue-500/10 text-blue-400",
    dotClassName: "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]",
    surfaceClassName: "bg-slate-900/30 border border-white/[0.03] shadow-2xl backdrop-blur-xl",
    dropClassName: "border-blue-500/40 bg-slate-900/60 shadow-[0_0_30px_rgba(59,130,246,0.2)]",
  },
  review: {
    badgeClassName: "border border-purple-500/20 bg-purple-500/10 text-purple-400",
    dotClassName: "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)]",
    surfaceClassName: "bg-slate-900/30 border border-white/[0.03] shadow-2xl backdrop-blur-xl",
    dropClassName: "border-purple-500/40 bg-slate-900/60 shadow-[0_0_30px_rgba(168,85,247,0.2)]",
  },
  done: {
    badgeClassName: "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    dotClassName: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]",
    surfaceClassName: "bg-slate-900/30 border border-white/[0.03] shadow-2xl backdrop-blur-xl",
    dropClassName: "border-emerald-500/40 bg-slate-900/60 shadow-[0_0_30px_rgba(16,185,129,0.2)]",
  },
};

const compactDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export function TaskDashboard({ user }: TaskDashboardProps) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [draftStatus, setDraftStatus] = useState<TaskBoardStatus>("backlog");
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<TaskBoardStatus | null>(null);

  useEffect(() => {
    void fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setIsLoading(true);

      const response = await fetch("/api/tasks?status=all", {
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
      const nextStatus = values.status;
      const payload = {
        ...values,
        completed: nextStatus === "done",
        order:
          taskId && activeTask?.status !== nextStatus
            ? Date.now()
            : (activeTask?.order ?? values.order ?? Date.now()),
        dueDate: values.dueDate?.trim() ? values.dueDate.trim() : undefined,
      };

      const response = await fetch(taskId ? `/api/tasks/${taskId}` : "/api/tasks", {
        method: taskId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to save task.");
      }

      toast.success(taskId ? "Task updated." : "Task created.");
      setEditingTask(null);
      setIsDialogOpen(false);
      await fetchTasks();
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
      await fetchTasks();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete task.");
    }
  }

  async function handleMoveTask(taskId: string, nextStatus: TaskBoardStatus) {
    const task = tasks.find((item) => item.id === taskId);

    if (!task || task.status === nextStatus) {
      return;
    }

    const previousTasks = tasks;
    const optimisticTask = {
      ...task,
      status: nextStatus,
      completed: nextStatus === "done",
      order: Date.now(),
    };

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === taskId ? optimisticTask : currentTask,
      ),
    );

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
          completed: nextStatus === "done",
          order: optimisticTask.order,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to move task.");
      }

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === taskId ? result.data.task : currentTask,
        ),
      );
    } catch (error) {
      setTasks(previousTasks);
      toast.error(error instanceof Error ? error.message : "Failed to move task.");
    }
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

  function handleDialogOpenChange(open: boolean) {
    setIsDialogOpen(open);

    if (!open) {
      setEditingTask(null);
    }
  }

  function openCreateDialog(status: TaskBoardStatus) {
    setEditingTask(null);
    setDraftStatus(status);
    setIsDialogOpen(true);
  }

  function openEditDialog(task: TaskItem) {
    setEditingTask(task);
    setDraftStatus(task.status);
    setIsDialogOpen(true);
  }

  function handleDragStart(event: DragEvent<HTMLElement>, taskId: string) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", taskId);
    setDraggingTaskId(taskId);
  }

  function handleDragEnd() {
    setDraggingTaskId(null);
    setDropTarget(null);
  }

  async function handleDrop(event: DragEvent<HTMLElement>, status: TaskBoardStatus) {
    event.preventDefault();
    const droppedTaskId = event.dataTransfer.getData("text/plain") || draggingTaskId;

    setDropTarget(null);
    setDraggingTaskId(null);

    if (!droppedTaskId) {
      return;
    }

    await handleMoveTask(droppedTaskId, status);
  }

  const normalizedSearch = deferredSearch.trim().toLowerCase();
  const workspaceFirstName = user.name.split(" ")[0] ?? user.name;
  const workspaceName = `${workspaceFirstName}'s Workspace`;
  const filteredTasks = tasks
    .filter((task) => {
      if (priorityFilter !== "all" && task.priority !== priorityFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const label = labelMeta[task.label].label;
      const haystack = [task.title, task.description, label]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    })
    .sort(
      (leftTask, rightTask) =>
        leftTask.order - rightTask.order ||
        new Date(leftTask.updatedAt).getTime() - new Date(rightTask.updatedAt).getTime(),
    );

  const activeTasks = tasks.filter((task) => task.status !== "done").length;
  const doneTasks = tasks.filter((task) => task.status === "done").length;
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length;
  const dueSoonTasks = tasks.filter((task) => {
    if (!task.dueDate || task.status === "done") {
      return false;
    }

    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    return dueDate >= now && dueDate <= sevenDaysFromNow;
  }).length;

  return (
    <>
      <div className="relative min-h-screen overflow-hidden text-slate-100">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[5%] top-[5%] h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]" />
          <div className="absolute right-[5%] top-[10%] h-96 w-96 rounded-full bg-rose-500/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
          <header className="rounded-3xl border border-white/[0.05] bg-slate-900/50 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 shadow-[0_16px_28px_-18px_rgba(226,232,240,0.2)]">
                  <LayoutGrid className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-400">
                    TaskFlow Board
                  </p>
                  <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
                    {workspaceName}
                  </h1>
                </div>
              </div>

              <div className="relative w-full xl:max-w-xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  className="pl-11 pr-24"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search tasks, labels, assignees, or notes"
                  value={search}
                />
                {search ? (
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-xs font-semibold text-slate-400 hover:bg-slate-900 hover:text-white"
                    onClick={() => setSearch("")}
                    type="button"
                  >
                    Clear
                  </button>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-5">
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-950 rounded-full">
                    <div className="flex items-center gap-3 xl:border-l xl:border-white/10 xl:pl-5 transition-opacity hover:opacity-80">
                      <div className="hidden text-right xl:block">
                        <p className="text-sm font-semibold text-slate-200">{user.name}</p>
                        <p className="text-[11px] text-slate-400">{user.email}</p>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold tracking-wider text-white shadow-inner">
                        {getInitials(user.name)}
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 border-white/5 bg-zinc-950 text-slate-200">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">{user.name}</p>
                        <p className="text-xs leading-none text-slate-400">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      className="cursor-pointer focus:bg-white/5 focus:text-white"
                      onClick={() => setIsProfileDialogOpen(true)}
                    >
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? "Logging out..." : "Log out"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="mt-6 rounded-[34px] border border-white/10 bg-slate-950/55 p-4 shadow-[0_30px_90px_-48px_rgba(2,6,23,1)] backdrop-blur-xl sm:p-6 lg:p-7">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-xs font-semibold text-slate-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Modern Kanban Workspace
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
                    Plan, review, and ship work with a calmer board.
                  </h2>
                  <p className="max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                    Keep backlog, active delivery, approvals, and completed work in one polished
                    board with clear labels, due dates, and collaborator ownership.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                {priorityFilterOptions.map((filter) => (
                  <button
                    key={filter}
                    className={cn(
                      "rounded-full border px-3.5 py-2 text-sm font-semibold shadow-sm transition",
                      priorityFilter === filter
                        ? "border-slate-200 bg-slate-100 text-slate-950 shadow-[0_16px_35px_-24px_rgba(226,232,240,0.18)]"
                        : "border-white/10 bg-slate-900/70 text-slate-300 hover:border-slate-500 hover:text-white",
                    )}
                    onClick={() => setPriorityFilter(filter)}
                    type="button"
                  >
                    {filter === "all" ? "All tasks" : priorityMeta[filter].label}
                  </button>
                ))}

                <Button onClick={() => openCreateDialog("backlog")}>
                  <Plus className="h-4 w-4" />
                  Create task
                </Button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                helper="Visible and ready to track"
                title="Board tasks"
                value={filteredTasks.length}
              />
              <MetricCard helper="Still moving across columns" title="Active work" value={activeTasks} />
              <MetricCard helper="Currently being built" title="In progress" value={inProgressTasks} />
              <MetricCard helper="Upcoming deadlines this week" title="Due soon" value={dueSoonTasks} />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-2 font-medium">
                {doneTasks} task{doneTasks === 1 ? "" : "s"} completed
              </span>
              <span className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-2 font-medium">
                {filteredTasks.length} of {tasks.length} task{tasks.length === 1 ? "" : "s"} visible
              </span>
            </div>

            {isLoading ? (
              <BoardSkeleton />
            ) : (
              <div className="mt-6 overflow-x-auto pb-3">
                <div className="grid min-w-[1120px] grid-flow-col auto-cols-[minmax(280px,1fr)] gap-5 xl:min-w-0 xl:grid-flow-row xl:grid-cols-4 xl:auto-cols-auto">
                  {TASK_BOARD_COLUMNS.map((column) => {
                    const columnTasks = filteredTasks.filter((task) => task.status === column.id);
                    const columnStyle = columnMeta[column.id];

                    return (
                      <section
                        key={column.id}
                        className={cn(
                          "flex h-[min(72vh,720px)] min-h-[520px] flex-col rounded-[28px] border border-white/10 p-4 shadow-[0_22px_48px_-34px_rgba(2,6,23,1)] backdrop-blur-sm transition",
                          columnStyle.surfaceClassName,
                          dropTarget === column.id ? columnStyle.dropClassName : "",
                        )}
                        onDragEnter={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          if (dropTarget !== column.id) {
                            setDropTarget(column.id);
                          }
                        }}
                        onDragLeave={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                        onDragOver={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          event.dataTransfer.dropEffect = "move";
                          if (dropTarget !== column.id) {
                            setDropTarget(column.id);
                          }
                        }}
                        onDrop={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          void handleDrop(event, column.id);
                        }}
                      >
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={cn("h-2.5 w-2.5 rounded-full", columnStyle.dotClassName)} />
                              <h3 className="text-base font-semibold text-slate-50">{column.title}</h3>
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                                  columnStyle.badgeClassName,
                                )}
                              >
                                {columnTasks.length}
                              </span>
                            </div>
                            <p className="text-xs leading-5 text-slate-400">{column.description}</p>
                          </div>

                          <button
                            className="rounded-full p-2 text-slate-500 hover:bg-slate-900 hover:text-white"
                            type="button"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                          {columnTasks.length === 0 ? (
                            <div className="flex h-full min-h-40 flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-slate-950/35 px-4 text-center">
                              <p className="text-sm font-semibold text-slate-200">No tasks here yet</p>
                              <p className="mt-1 text-xs leading-5 text-slate-400">
                                Drop a task into this column or create a new task to get started.
                              </p>
                            </div>
                          ) : (
                            columnTasks.map((task) => {
                              const overdue = task.dueDate ? isOverdue(task.dueDate) && task.status !== "done" : false;

                              return (
                                <article
                                  key={task.id}
                                  className={cn(
                                    "group cursor-grab rounded-[20px] border border-white/[0.05] bg-slate-900/60 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.2)] backdrop-blur-md transition-all",
                                    draggingTaskId === task.id
                                      ? "scale-[0.98] opacity-75 ring-2 ring-indigo-500/60 ring-offset-2 ring-offset-slate-950"
                                      : "hover:-translate-y-1 hover:border-white/10 hover:bg-slate-800/80 hover:shadow-[0_20px_40px_rgb(0,0,0,0.3)]",
                                    overdue ? "bg-red-950/20 ring-1 ring-red-500/40" : "",
                                    draggingTaskId && draggingTaskId !== task.id ? "pointer-events-none" : ""
                                  )}
                                  draggable
                                  onDragEnd={handleDragEnd}
                                  onDragStart={(event) => handleDragStart(event, task.id)}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <span
                                      className={cn(
                                        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold",
                                        labelMeta[task.label].className,
                                      )}
                                    >
                                      {labelMeta[task.label].label}
                                    </span>

                                    <div className="flex items-center gap-1">
                                      <button
                                        className="rounded-full p-2 text-slate-500 hover:bg-slate-900 hover:text-white"
                                        onClick={() => openEditDialog(task)}
                                        type="button"
                                      >
                                        <PencilLine className="h-4 w-4" />
                                      </button>
                                      <button
                                        className="rounded-full p-2 text-slate-500 hover:bg-rose-500/12 hover:text-rose-300"
                                        onClick={() => void handleDeleteTask(task.id)}
                                        type="button"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="mt-3 space-y-2">
                                    <h4 className="text-[15px] font-semibold leading-6 text-slate-50">
                                      {task.title}
                                    </h4>
                                    {task.description ? (
                                      <p className="text-sm leading-6 text-slate-400">
                                        {task.description}
                                      </p>
                                    ) : null}
                                  </div>

                                  <div className="mt-4 flex flex-wrap items-center gap-2">
                                    <span
                                      className={cn(
                                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                                        overdue
                                          ? "border border-rose-500/20 bg-rose-500/12 text-rose-200"
                                          : "border border-white/10 bg-slate-900/70 text-slate-300",
                                      )}
                                    >
                                      <CalendarDays className="h-3.5 w-3.5" />
                                      {task.dueDate ? compactDateFormatter.format(new Date(task.dueDate)) : "No date"}
                                    </span>

                                    <span
                                      className={cn(
                                        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                                        priorityMeta[task.priority].className,
                                      )}
                                    >
                                      {priorityMeta[task.priority].label}
                                    </span>
                                  </div>

                                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/5 pt-4">
                                    <div className="text-xs font-medium text-slate-400">
                                      {task.status === "done" ? (
                                        <span className="inline-flex items-center gap-1.5 text-emerald-400">
                                          <CheckCheck className="h-4 w-4" />
                                          Completed
                                        </span>
                                      ) : task.dueDate ? (
                                        <span className={cn("inline-flex items-center gap-1.5", overdue ? "text-rose-400" : "")}>
                                          <CalendarDays className="h-4 w-4" />
                                          {formatDate(task.dueDate)}
                                        </span>
                                      ) : (
                                        <span className="text-slate-500">No due date</span>
                                      )}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                      Updated {formatDate(task.updatedAt)}
                                    </div>
                                  </div>
                                </article>
                              );
                            })
                          )}
                        </div>

                        <button
                          className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-dashed border-white/10 bg-slate-900/70 px-3 py-3 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:bg-slate-900 hover:text-white"
                          onClick={() => openCreateDialog(column.id)}
                          type="button"
                        >
                          <Plus className="h-4 w-4" />
                          Add a task
                        </button>
                      </section>
                    );
                  })}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <TaskFormDialog
        defaultStatus={draftStatus}
        initialTask={editingTask}
        isSubmitting={isSubmitting}
        onOpenChange={handleDialogOpenChange}
        onSubmit={async (values) => {
          await saveTask(values);
        }}
        open={isDialogOpen}
        ownerName={user.name}
      />

      <ProfileFormDialog
        onOpenChange={setIsProfileDialogOpen}
        open={isProfileDialogOpen}
        user={user}
      />
    </>
  );
}

function MetricCard({
  title,
  value,
  helper,
}: {
  title: string;
  value: number;
  helper: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.88),rgba(2,6,23,0.88))] p-4 shadow-[0_20px_42px_-30px_rgba(2,6,23,1)]">
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <span className="text-3xl font-semibold tracking-tight text-slate-100">{value}</span>
        <span className="text-right text-xs leading-5 text-slate-500">{helper}</span>
      </div>
    </div>
  );
}

function BoardSkeleton() {
  return (
    <div className="mt-6 overflow-x-auto pb-3">
      <div className="grid min-w-[1120px] grid-flow-col auto-cols-[minmax(280px,1fr)] gap-5 xl:min-w-0 xl:grid-flow-row xl:grid-cols-4 xl:auto-cols-auto">
        {TASK_BOARD_COLUMNS.map((column) => (
          <div
            key={column.id}
            className="flex h-[min(72vh,720px)] min-h-[520px] flex-col rounded-[28px] border border-white/10 bg-slate-950/65 p-4 shadow-[0_18px_40px_-32px_rgba(2,6,23,1)]"
          >
            <div className="space-y-2">
              <Skeleton className="h-5 w-28 rounded-full" />
              <Skeleton className="h-4 w-40 rounded-full" />
            </div>
            <div className="mt-4 space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[24px] border border-white/10 bg-slate-950/85 p-4 shadow-[0_18px_35px_-24px_rgba(2,6,23,1)]"
                >
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="mt-4 h-5 w-4/5 rounded-full" />
                  <Skeleton className="mt-3 h-4 w-3/5 rounded-full" />
                  <Skeleton className="mt-4 h-16 rounded-[20px]" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
