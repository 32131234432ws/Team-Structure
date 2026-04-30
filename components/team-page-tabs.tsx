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

  const tabConfig = {
    structure: {
      activeBg: "bg-blue-500/20",
      activeText: "text-blue-300",
      activeBorder: "border-blue-500/40",
      contentBg: "bg-blue-500/5 border-blue-500/20",
    },
    detailed: {
      activeBg: "bg-emerald-500/20",
      activeText: "text-emerald-300",
      activeBorder: "border-emerald-500/40",
      contentBg: "bg-emerald-500/5 border-emerald-500/20",
    },
    roles: {
      activeBg: "bg-amber-500/20",
      activeText: "text-amber-300",
      activeBorder: "border-amber-500/40",
      contentBg: "bg-amber-500/5 border-amber-500/20",
    },
  };

  return (
    <div>
      {/* Tab Navigation - Browser Style */}
      <div className="flex items-end gap-1 relative">
        {/* Structure Tab */}
        <button
          onClick={() => setActiveTab("structure")}
          className={cn(
            "relative flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-t-xl border border-b-0 transition-all",
            activeTab === "structure"
              ? cn(tabConfig.structure.activeBg, tabConfig.structure.activeText, tabConfig.structure.activeBorder, "z-10 -mb-px")
              : "bg-muted/30 text-muted-foreground border-border/30 hover:bg-muted/50 hover:text-foreground -mb-px"
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          Team Structure
        </button>

        {/* Detailed Tab */}
        <button
          onClick={() => setActiveTab("detailed")}
          className={cn(
            "relative flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-t-xl border border-b-0 transition-all",
            activeTab === "detailed"
              ? cn(tabConfig.detailed.activeBg, tabConfig.detailed.activeText, tabConfig.detailed.activeBorder, "z-10 -mb-px")
              : "bg-muted/30 text-muted-foreground border-border/30 hover:bg-muted/50 hover:text-foreground -mb-px"
          )}
        >
          <Users className="h-4 w-4" />
          Detailed Team View
        </button>

        {/* Roles Tab */}
        <button
          onClick={() => setActiveTab("roles")}
          className={cn(
            "relative flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-t-xl border border-b-0 transition-all",
            activeTab === "roles"
              ? cn(tabConfig.roles.activeBg, tabConfig.roles.activeText, tabConfig.roles.activeBorder, "z-10 -mb-px")
              : "bg-muted/30 text-muted-foreground border-border/30 hover:bg-muted/50 hover:text-foreground -mb-px"
          )}
        >
          <ClipboardList className="h-4 w-4" />
          Roles & Responsibilities
        </button>

        {/* Tab bar line extending to right */}
        <div className="flex-1 border-b border-border/30" />
      </div>

      {/* Tab Content with colored background - connected to active tab */}
      <div className={cn(
        "rounded-b-xl rounded-tr-xl border border-t-0 p-6 transition-colors",
        tabConfig[activeTab].contentBg
      )}>
        {activeTab === "structure" && structureView}
        {activeTab === "detailed" && detailedView}
        {activeTab === "roles" && rolesView}
      </div>
    </div>
  );
}
