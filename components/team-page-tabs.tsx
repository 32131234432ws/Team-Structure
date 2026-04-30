"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { LayoutGrid, Users } from "lucide-react";

interface TeamPageTabsProps {
  structureView: React.ReactNode;
  detailedView: React.ReactNode;
}

export function TeamPageTabs({ structureView, detailedView }: TeamPageTabsProps) {
  const [activeTab, setActiveTab] = useState<"structure" | "detailed">("structure");

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab("structure")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "structure"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          Team Structure
        </button>
        <button
          onClick={() => setActiveTab("detailed")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "detailed"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Users className="h-4 w-4" />
          Detailed Team View
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "structure" && structureView}
        {activeTab === "detailed" && detailedView}
      </div>
    </div>
  );
}
