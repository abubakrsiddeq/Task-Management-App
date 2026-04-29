import { Skeleton } from "@/components/ui/skeleton";
import { TASK_BOARD_COLUMNS } from "@/lib/constants";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-[1600px]">
        <div className="rounded-[30px] border border-white/10 bg-slate-950/65 p-4 shadow-[0_28px_80px_-42px_rgba(2,6,23,1)] backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-3">
              <Skeleton className="h-4 w-32 rounded-full" />
              <Skeleton className="h-8 w-64 rounded-full" />
            </div>
            <Skeleton className="h-11 w-full rounded-2xl xl:max-w-xl" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-40 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-2xl" />
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[34px] border border-white/10 bg-slate-950/55 p-4 shadow-[0_30px_90px_-48px_rgba(2,6,23,1)] backdrop-blur-xl sm:p-6 lg:p-7">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-[24px]" />
            ))}
          </div>

          <div className="mt-6 overflow-x-auto pb-3">
            <div className="grid min-w-[1120px] grid-flow-col auto-cols-[minmax(280px,1fr)] gap-5 xl:min-w-0 xl:grid-flow-row xl:grid-cols-4 xl:auto-cols-auto">
              {TASK_BOARD_COLUMNS.map((column) => (
                <div
                  key={column.id}
                  className="flex h-[min(72vh,720px)] min-h-[520px] flex-col rounded-[28px] border border-white/10 bg-slate-950/65 p-4 shadow-[0_18px_40px_-32px_rgba(2,6,23,1)]"
                >
                  <Skeleton className="h-5 w-28 rounded-full" />
                  <Skeleton className="mt-2 h-4 w-40 rounded-full" />
                  <div className="mt-4 space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="rounded-[24px] border border-white/10 bg-slate-950/85 p-4 shadow-[0_18px_35px_-24px_rgba(2,6,23,1)]"
                      >
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="mt-4 h-5 w-4/5 rounded-full" />
                        <Skeleton className="mt-3 h-4 w-3/5 rounded-full" />
                        <Skeleton className="mt-4 h-14 rounded-[20px]" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
