"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import type { input as ZodInput, output as ZodOutput } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  TASK_ASSIGNEE_OPTIONS,
  TASK_BOARD_COLUMNS,
  TASK_LABEL_OPTIONS,
} from "@/lib/constants";
import { type TaskBoardStatus, type TaskItem } from "@/lib/types";
import { taskSchema } from "@/lib/validations/task";

type TaskFormValues = ZodInput<typeof taskSchema>;
type TaskResolvedValues = ZodOutput<typeof taskSchema>;

type TaskFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTask?: TaskItem | null;
  onSubmit: (values: TaskResolvedValues) => Promise<void>;
  isSubmitting: boolean;
  ownerName: string;
  defaultStatus: TaskBoardStatus;
};

const fieldClassName =
  "flex h-11 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3.5 py-2 text-sm text-slate-100 shadow-[0_16px_36px_-26px_rgba(2,6,23,0.95)] outline-none focus:border-cyan-400/35 focus:ring-4 focus:ring-cyan-500/10";

export function TaskFormDialog({
  open,
  onOpenChange,
  initialTask,
  onSubmit,
  isSubmitting,
  ownerName,
  defaultStatus,
}: TaskFormDialogProps) {
  const form = useForm<TaskFormValues, undefined, TaskResolvedValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: defaultStatus,
      label: "product",
      assignee: "owner",
      dueDate: "",
      completed: false,
    },
  });

  useEffect(() => {
    form.reset({
      title: initialTask?.title ?? "",
      description: initialTask?.description ?? "",
      priority: initialTask?.priority ?? "medium",
      status: initialTask?.status ?? defaultStatus,
      label: initialTask?.label ?? "product",
      assignee: initialTask?.assignee ?? "owner",
      dueDate: initialTask?.dueDate
        ? new Date(initialTask.dueDate).toISOString().slice(0, 10)
        : "",
      completed: initialTask?.completed ?? false,
    });
  }, [defaultStatus, form, initialTask, open]);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialTask ? "Edit task" : "Create a new task"}</DialogTitle>
          <DialogDescription>
            {initialTask
              ? "Update task details, due dates, and collaborators without leaving the board."
              : "Add a focused task with a label, assignee, and checklist so the board stays easy to scan."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Prepare Q2 launch kickoff plan" {...form.register("title")} />
            <p className="text-xs text-rose-300">{form.formState.errors.title?.message}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add context, links, or the next decision needed from the team."
              {...form.register("description")}
            />
            <p className="text-xs text-rose-300">{form.formState.errors.description?.message}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">Column</Label>
              <select className={fieldClassName} id="status" {...form.register("status")}>
                {TASK_BOARD_COLUMNS.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select className={fieldClassName} id="priority" {...form.register("priority")}>
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <select className={fieldClassName} id="label" {...form.register("label")}>
                {TASK_LABEL_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <select className={fieldClassName} id="assignee" {...form.register("assignee")}>
                {TASK_ASSIGNEE_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.id === "owner" ? `${ownerName} (You)` : option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due date</Label>
            <Input id="dueDate" type="date" {...form.register("dueDate")} />
          </div>

          <DialogFooter>
            <Button onClick={() => onOpenChange(false)} type="button" variant="ghost">
              Cancel
            </Button>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {initialTask ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
