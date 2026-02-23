"use client";

import { AssetCondition } from "@/lib/query/types/asset";

const conditionConfig = {
  [AssetCondition.NEW]: {
    label: "New",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  [AssetCondition.GOOD]: {
    label: "Good",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  [AssetCondition.FAIR]: {
    label: "Fair",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  [AssetCondition.POOR]: {
    label: "Poor",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  [AssetCondition.DAMAGED]: {
    label: "Damaged",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

interface ConditionBadgeProps {
  condition: AssetCondition;
}

export function ConditionBadge({ condition }: ConditionBadgeProps) {
  const config = conditionConfig[condition];
  
  if (!config) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border">
        {condition}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
}
