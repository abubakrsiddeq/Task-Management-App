import { Model, Schema, model, models, type Types } from "mongoose";

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "backlog" | "in-progress" | "review" | "done";
export type TaskLabel = "email-campaign" | "blog" | "website" | "social-media" | "design" | "product";
export type TaskAssignee = "owner";

export type TaskDocument = {
  _id: string;
  userId: Types.ObjectId;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  status: TaskStatus;
  label: TaskLabel;
  assignee: TaskAssignee;
  dueDate?: Date | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

const taskSchema = new Schema<TaskDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["backlog", "in-progress", "review", "done"],
      default: "backlog",
    },
    label: {
      type: String,
      enum: ["email-campaign", "blog", "website", "social-media", "design", "product"],
      default: "product",
    },
    assignee: {
      type: String,
      enum: ["owner"],
      default: "owner",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Task =
  (models.Task as Model<TaskDocument>) || model<TaskDocument>("Task", taskSchema);
