import { cn } from "@/lib/utils";
import type { PatientStatus } from "@/types/patient";

const statusStyles: Record<PatientStatus, string> = {
  Stable: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Recovering: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Discharged: "bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400",
};

export const StatusBadge = ({ status }: { status: PatientStatus }) => (
  <span
    className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      statusStyles[status]
    )}
  >
    <span
      className={cn("w-1.5 h-1.5 rounded-full mr-1.5", {
        "bg-emerald-500": status === "Stable",
        "bg-red-500": status === "Critical",
        "bg-amber-500": status === "Recovering",
        "bg-slate-400": status === "Discharged",
      })}
    />
    {status}
  </span>
);
