import { redirect } from "next/navigation";

import { TaskDashboard } from "@/components/tasks/task-dashboard";
import { getCurrentUserFromCookies } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUserFromCookies();

  if (!user) {
    redirect("/login");
  }

  return (
    <TaskDashboard
      user={{
        id: user.userId,
        email: user.email,
        name: user.name,
      }}
    />
  );
}
