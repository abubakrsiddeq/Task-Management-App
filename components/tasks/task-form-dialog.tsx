"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { z } from "zod";

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
import { type TaskItem } from "@/lib/types";
import { taskSchema } from "@/lib/validations/task";

const clientTaskSchema = taskSchema.extend({
  dueDate: z.string().optional(),
});

type TaskFormValues = z.infer<typeof clientTaskSchema>;

type TaskFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTask?: TaskItem | null;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  isSubmitting: boolean;
};

export function TaskFormDialog({
  open,
  onOpenChange,
  initialTask,
  onSubmit,
  isSubmitting,
}: TaskFormDialogProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(clientTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      completed: false,
    },
  });

  useEffect(() => {
    form.reset({
      title: initialTask?.title ?? "",
      description: initialTask?.description ?? "",
      priority: initialTask?.priority ?? "medium",
      dueDate: initialTask?.dueDate
        ? new Date(initialTask.dueDate).toISOString().slice(0, 10)
        : "",
      completed: initialTask?.completed ?? false,
    });
  }, [form, initialTask, open]);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialTask ? "Edit task" : "Create a new task"}</DialogTitle>
          <DialogDescription>
            {initialTask
              ? "Update details and deadline without leaving the dashboard."
              : "Add a task with a clear priority and due date to stay on track."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Prepare sprint planning notes" {...form.register("title")} />
            <p className="text-xs text-red-500">{form.formState.errors.title?.message}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add context, acceptance criteria, or reminders."
              {...form.register("description")}
            />
            <p className="text-xs text-red-500">{form.formState.errors.description?.message}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm focus-visible:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                {...form.register("priority")}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Set urgency so your task list highlights what to do first.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due date</Label>
              <Input id="dueDate" type="date" {...form.register("dueDate")} />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Optional. Pick a deadline to stay on track.
              </p>
            </div>
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
