"use client";

import { AssetStatus } from "@/lib/query/types/asset";

const statusConfig = {
  [AssetStatus.ACTIVE]: {
    label: "Active",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  [AssetStatus.ASSIGNED]: {
    label: "Assigned",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  [AssetStatus.MAINTENANCE]: {
    label: "Maintenance",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  [AssetStatus.RETIRED]: {
    label: "Retired",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

interface StatusBadgeProps {
  status: AssetStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  if (!config) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border">
        {status}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
}
