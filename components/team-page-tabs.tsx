"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { LayoutGrid, Users, ClipboardList } from "lucide-react";

interface TeamPageTabsProps {
  structureView: React.ReactNode;
  detailedView: React.ReactNode;
  rolesView: React.ReactNode;
}

export function TeamPageTabs({ structureView, detailedView, rolesView }: TeamPageTabsProps) {
  const [activeTab, setActiveTab] = useState<"structure" | "detailed" | "roles">("structure");

  const contentBgColors = {
    structure: "bg-blue-500/5 border-blue-500/20",
    detailed: "bg-emerald-500/5 border-emerald-500/20",
    roles: "bg-amber-500/5 border-amber-500/20",
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setActiveTab("structure")}
          className={cn(
            "flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl border-2 transition-all",
            activeTab === "structure"
              ? "bg-blue-500/30 text-blue-300 border-blue-500/50 shadow-lg shadow-blue-500/20 scale-105"
              : "bg-muted/20 text-muted-foreground border-border/30 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30"
          )}
        >
          <LayoutGrid className="h-5 w-5" />
          Team Structure
        </button>
        <button
          onClick={() => setActiveTab("detailed")}
          className={cn(
            "flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl border-2 transition-all",
            activeTab === "detailed"
              ? "bg-emerald-500/30 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/20 scale-105"
              : "bg-muted/20 text-muted-foreground border-border/30 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30"
          )}
        >
          <Users className="h-5 w-5" />
          Detailed Team View
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={cn(
            "flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl border-2 transition-all",
            activeTab === "roles"
              ? "bg-amber-500/30 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/20 scale-105"
              : "bg-muted/20 text-muted-foreground border-border/30 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30"
          )}
        >
          <ClipboardList className="h-5 w-5" />
          Roles & Responsibilities
        </button>
      </div>

      {/* Tab Content with colored background */}
      <div className={cn(
        "rounded-xl border p-6 transition-colors",
        contentBgColors[activeTab]
      )}>
        {activeTab === "structure" && structureView}
        {activeTab === "detailed" && detailedView}
        {activeTab === "roles" && rolesView}
      </div>
    </div>
  );
}
