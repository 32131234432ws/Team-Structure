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

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setActiveTab("structure")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-all",
            activeTab === "structure"
              ? "bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-sm"
              : "bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted/50 hover:text-foreground"
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          Team Structure
        </button>
        <button
          onClick={() => setActiveTab("detailed")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-all",
            activeTab === "detailed"
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-sm"
              : "bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted/50 hover:text-foreground"
          )}
        >
          <Users className="h-4 w-4" />
          Detailed Team View
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-all",
            activeTab === "roles"
              ? "bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-sm"
              : "bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted/50 hover:text-foreground"
          )}
        >
          <ClipboardList className="h-4 w-4" />
          Roles & Responsibilities
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "structure" && structureView}
        {activeTab === "detailed" && detailedView}
        {activeTab === "roles" && rolesView}
      </div>
    </div>
  );
}
