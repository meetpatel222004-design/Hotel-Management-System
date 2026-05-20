import { cn } from "@/lib/cn";

const colors = {
  available: "bg-gray-500/15 text-gray-400 border-gray-500/20",
  occupied: "bg-green-500/15 text-green-500 border-green-500/20",
  reserved: "bg-blue-500/15 text-blue-500 border-blue-500/20",
  disabled: "bg-red-500/15 text-red-500 border-red-500/20",
  waiting: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20",
  called: "bg-blue-500/15 text-blue-500 border-blue-500/20",
  seated: "bg-green-500/15 text-green-500 border-green-500/20",
  cancelled: "bg-gray-500/15 text-gray-400 border-gray-500/20",
  received: "bg-blue-500/15 text-blue-500 border-blue-500/20",
  preparing: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20",
  cooking: "bg-orange-500/15 text-orange-500 border-orange-500/20",
  ready: "bg-green-500/15 text-green-500 border-green-500/20",
  served: "bg-green-600/15 text-green-600 border-green-600/20",
  completed: "bg-gray-500/15 text-gray-400 border-gray-500/20",
  pending: "bg-red-500/15 text-red-500 border-red-500/20",
  accepted: "bg-green-500/15 text-green-500 border-green-500/20",
  resolved: "bg-gray-500/15 text-gray-400 border-gray-500/20",
};

const labels = {
  available: "Available",
  occupied: "Occupied",
  reserved: "Reserved",
  disabled: "Disabled",
  waiting: "Waiting",
  called: "Called",
  seated: "Seated",
  cancelled: "Cancelled",
  received: "New",
  preparing: "Preparing",
  cooking: "Cooking",
  ready: "Ready",
  served: "Served",
  completed: "Done",
  pending: "Pending",
  accepted: "Accepted",
  resolved: "Resolved",
};

export function StatusPill({ status, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
        colors[status] || "bg-gray-500/15 text-gray-400 border-gray-500/20",
        className
      )}
    >
      {labels[status] || status}
    </span>
  );
}
