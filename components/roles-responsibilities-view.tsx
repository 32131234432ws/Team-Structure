"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, UserCircle, Code, TestTube, Network, Server, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import raciData from "@/lib/roles-responsibilities-data.json";

interface RACIData {
  roles: string[];
  phases: Record<string, { phase: string; activity: string; raci: Record<string, string> }[]>;
  activities: { phase: string; activity: string; raci: Record<string, string> }[];
}

const roleConfig: Record<string, { icon: React.ReactNode; color: string; badgeColor: string }> = {
  "Onshore Solution Analyst": {
    icon: <UserCircle className="h-5 w-5" />,
    color: "from-blue-500/20 to-blue-500/5 border-blue-500/30",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  "Offshore Solution Analyst": {
    icon: <UserCircle className="h-5 w-5" />,
    color: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
  "Developer": {
    icon: <Code className="h-5 w-5" />,
    color: "from-amber-500/20 to-amber-500/5 border-amber-500/30",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  "Development Lead": {
    icon: <Code className="h-5 w-5" />,
    color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  "Quality Assurance": {
    icon: <TestTube className="h-5 w-5" />,
    color: "from-rose-500/20 to-rose-500/5 border-rose-500/30",
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  },
  "Integration POD": {
    icon: <Network className="h-5 w-5" />,
    color: "from-violet-500/20 to-violet-500/5 border-violet-500/30",
    badgeColor: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  },
  "DevOps POD": {
    icon: <Server className="h-5 w-5" />,
    color: "from-indigo-500/20 to-indigo-500/5 border-indigo-500/30",
    badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  },
  "Program Management Office": {
    icon: <ClipboardList className="h-5 w-5" />,
    color: "from-pink-500/20 to-pink-500/5 border-pink-500/30",
    badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  },
};

const phaseColors: Record<string, string> = {
  "Requirements": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Design": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Development": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "SIT": "bg-rose-500/20 text-rose-400 border-rose-500/30",
  "UAT": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Cutover": "bg-teal-500/20 text-teal-400 border-teal-500/30",
  "Go Live": "bg-green-500/20 text-green-400 border-green-500/30",
  "Post-Dev": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Sprint": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  "Hypercare": "bg-red-500/20 text-red-400 border-red-500/30",
};

const raciColors: Record<string, string> = {
  "R": "bg-emerald-500 text-white",
  "A": "bg-blue-500 text-white",
  "C": "bg-amber-500 text-white",
  "I": "bg-slate-400 text-white",
  "R/A": "bg-purple-500 text-white",
  "-": "bg-muted text-muted-foreground",
};

const defaultConfig = {
  icon: <Code className="h-5 w-5" />,
  color: "from-muted/20 to-muted/5 border-border",
  badgeColor: "bg-muted text-muted-foreground border-border",
};

export function RolesResponsibilitiesView() {
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());
  const typedRaciData = raciData as RACIData;

  const toggleRole = (role: string) => {
    const newExpanded = new Set(expandedRoles);
    if (newExpanded.has(role)) {
      newExpanded.delete(role);
    } else {
      newExpanded.add(role);
    }
    setExpandedRoles(newExpanded);
  };

  const expandAll = () => {
    setExpandedRoles(new Set(typedRaciData.roles));
  };

  const collapseAll = () => {
    setExpandedRoles(new Set());
  };

  // Get activities where role has R or A
  const getRoleKeyActivities = (role: string) => {
    return typedRaciData.activities.filter(
      (a) => a.raci[role] === "R" || a.raci[role] === "A" || a.raci[role] === "R/A"
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Roles & Responsibilities</h2>
          <p className="text-sm text-muted-foreground mt-1">
            RACI Matrix - Responsibility assignments across lifecycle phases
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted/50 transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted/50 transition-colors"
          >
            Collapse All
          </button>
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            {typedRaciData.roles.length} Roles
          </Badge>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border/50">
        <span className="text-xs font-medium text-muted-foreground mr-2">RACI Legend:</span>
        <Badge className={cn("text-xs", raciColors["R"])}>R = Responsible</Badge>
        <Badge className={cn("text-xs", raciColors["A"])}>A = Accountable</Badge>
        <Badge className={cn("text-xs", raciColors["C"])}>C = Consulted</Badge>
        <Badge className={cn("text-xs", raciColors["I"])}>I = Informed</Badge>
      </div>

      {/* Role Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {typedRaciData.roles.map((role) => {
          const config = roleConfig[role] || defaultConfig;
          const isExpanded = expandedRoles.has(role);
          const keyActivities = getRoleKeyActivities(role);
          const responsibleCount = typedRaciData.activities.filter((a) => a.raci[role] === "R" || a.raci[role] === "R/A").length;
          const accountableCount = typedRaciData.activities.filter((a) => a.raci[role] === "A" || a.raci[role] === "R/A").length;

          return (
            <Card
              key={role}
              className={cn(
                "bg-gradient-to-br border transition-all duration-200",
                config.color,
                isExpanded ? "md:col-span-2" : ""
              )}
            >
              <CardHeader className="p-4 pb-2">
                <button
                  onClick={() => toggleRole(role)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", config.badgeColor)}>
                      {config.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{role}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          {responsibleCount} R
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {accountableCount} A
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>
              </CardHeader>

              {isExpanded && (
                <CardContent className="p-4 pt-2">
                  <div className="space-y-3">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Key Responsibilities (R/A Activities)
                    </h4>
                    {Object.keys(typedRaciData.phases).map((phase) => {
                      const phaseActivities = keyActivities.filter((a) => a.phase === phase);
                      if (phaseActivities.length === 0) return null;

                      return (
                        <div key={phase} className="space-y-1.5">
                          <Badge
                            variant="outline"
                            className={cn("text-xs", phaseColors[phase] || "bg-muted text-muted-foreground")}
                          >
                            {phase}
                          </Badge>
                          <div className="ml-2 space-y-1">
                            {phaseActivities.map((activity, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 p-2 rounded bg-background/50 border border-border/30"
                              >
                                <Badge className={cn("text-xs w-6 h-6 flex items-center justify-center p-0", raciColors[activity.raci[role]])}>
                                  {activity.raci[role]}
                                </Badge>
                                <span className="text-sm text-foreground/90">{activity.activity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
