export const AUTH_COOKIE_NAME = "taskflow_token";

export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

export const TASK_BOARD_COLUMNS = [
  {
    id: "backlog",
    title: "Backlog",
    description: "Ideas, requests, and next-up work.",
  },
  {
    id: "in-progress",
    title: "In Progress",
    description: "Active tasks your team is moving forward.",
  },
  {
    id: "review",
    title: "Review",
    description: "Waiting on approval, QA, or feedback.",
  },
  {
    id: "done",
    title: "Done",
    description: "Shipped work and completed deliverables.",
  },
] as const;

export const TASK_LABEL_OPTIONS = [
  { id: "email-campaign", label: "Email Campaign" },
  { id: "blog", label: "Blog" },
  { id: "website", label: "Website" },
  { id: "social-media", label: "Social Media" },
  { id: "design", label: "Design" },
  { id: "product", label: "Product" },
] as const;


export const TASK_STATUS_FILTERS = ["all", "pending", "completed"] as const;
