const { z } = require("zod");

const TASK_BOARD_COLUMNS = [
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
];

const taskBoardStatuses = TASK_BOARD_COLUMNS.map((column) => column.id);

const schema = z.object({
  status: z.enum(taskBoardStatuses).default("backlog"),
});

console.log(schema.safeParse({ status: "in-progress" }));
