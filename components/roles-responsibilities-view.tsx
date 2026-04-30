"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, UserCircle, Code, TestTube, Cog, ClipboardList, Network, Server } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import rolesData from "@/lib/roles-responsibilities-data.json";

interface RoleData {
  category: string;
  role: string;
  responsibilities: string[];
}

const roleConfig: Record<string, { icon: React.ReactNode; color: string; badgeColor: string }> = {
  "ONSHORE SOLUTION ANALYST": {
    icon: <UserCircle className="h-5 w-5" />,
    color: "from-blue-500/20 to-blue-500/5 border-blue-500/30",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  "OFFSHORE SOLUTION ANALYST": {
    icon: <UserCircle className="h-5 w-5" />,
    color: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
  "DEVELOPER": {
    icon: <Code className="h-5 w-5" />,
    color: "from-amber-500/20 to-amber-500/5 border-amber-500/30",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  "DEVELOPMENT LEAD": {
    icon: <Code className="h-5 w-5" />,
    color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  "QUALITY ASSURANCE": {
    icon: <TestTube className="h-5 w-5" />,
    color: "from-rose-500/20 to-rose-500/5 border-rose-500/30",
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  },
  "INTEGRATION POD": {
    icon: <Network className="h-5 w-5" />,
    color: "from-violet-500/20 to-violet-500/5 border-violet-500/30",
    badgeColor: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  },
  "DEVOPS POD": {
    icon: <Server className="h-5 w-5" />,
    color: "from-indigo-500/20 to-indigo-500/5 border-indigo-500/30",
    badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  },
  "PROGRAM MANAGEMENT OFFICE (PMO)": {
    icon: <ClipboardList className="h-5 w-5" />,
    color: "from-pink-500/20 to-pink-500/5 border-pink-500/30",
    badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  },
};

const defaultConfig = {
  icon: <Cog className="h-5 w-5" />,
  color: "from-muted/20 to-muted/5 border-border",
  badgeColor: "bg-muted text-muted-foreground border-border",
};

const phaseColors: Record<string, string> = {
  "Requirements": "bg-blue-500/20 text-blue-400",
  "Design": "bg-purple-500/20 text-purple-400",
  "Development": "bg-amber-500/20 text-amber-400",
  "SIT": "bg-rose-500/20 text-rose-400",
  "UAT": "bg-orange-500/20 text-orange-400",
  "Cutover": "bg-teal-500/20 text-teal-400",
  "Cutover & Go-Live": "bg-teal-500/20 text-teal-400",
  "Go-Live": "bg-green-500/20 text-green-400",
  "Post-Dev": "bg-cyan-500/20 text-cyan-400",
  "Sprint Ceremonies": "bg-indigo-500/20 text-indigo-400",
  "Hypercare": "bg-red-500/20 text-red-400",
  "Requirements & Design": "bg-violet-500/20 text-violet-400",
};

export function RolesResponsibilitiesView() {
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());

  const typedRolesData = (rolesData as RoleData[]).filter(
    (r) => r.role !== "Role" && r.role.trim() !== ""
  );

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
    setExpandedRoles(new Set(typedRolesData.map((r) => r.role)));
  };

  const collapseAll = () => {
    setExpandedRoles(new Set());
  };

  // Parse responsibility into phase and description
  const parseResponsibility = (resp: string) => {
    const parts = resp.split("|");
    if (parts.length >= 2) {
      return {
        phase: parts[0].trim(),
        description: parts.slice(1).join("|").trim(),
      };
    }
    return { phase: "", description: resp };
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Roles & Responsibilities</h2>
          <p className="text-sm text-muted-foreground mt-1">
            FPL Program role definitions and key responsibilities
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
            {typedRolesData.length} Roles
          </Badge>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border/50">
        <span className="text-xs font-medium text-muted-foreground mr-2">Legend:</span>
        <Badge variant="outline" className="text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          R = Responsible
        </Badge>
        <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
          A = Accountable
        </Badge>
        <Badge variant="outline" className="text-xs bg-amber-500/20 text-amber-400 border-amber-500/30">
          C = Consulted
        </Badge>
      </div>

      {/* Role Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {typedRolesData.map((role) => {
          const config = roleConfig[role.role] || defaultConfig;
          const isExpanded = expandedRoles.has(role.role);

          return (
            <Card
              key={role.role}
              className={cn(
                "bg-gradient-to-br border transition-all duration-200",
                config.color,
                isExpanded ? "md:col-span-2" : ""
              )}
            >
              <CardHeader className="p-4 pb-2">
                <button
                  onClick={() => toggleRole(role.role)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", config.badgeColor)}>
                      {config.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{role.role}</h3>
                      <p className="text-xs text-muted-foreground">
                        {role.responsibilities.length} responsibilities
                      </p>
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
                  <div className="space-y-2">
                    {role.responsibilities.map((resp, idx) => {
                      const { phase, description } = parseResponsibility(resp);
                      const phaseColor = phaseColors[phase] || "bg-muted text-muted-foreground";

                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-2 rounded-lg bg-background/50 border border-border/30"
                        >
                          {phase && (
                            <Badge
                              variant="outline"
                              className={cn("text-xs shrink-0 mt-0.5", phaseColor)}
                            >
                              {phase}
                            </Badge>
                          )}
                          <span className="text-sm text-foreground/90 leading-relaxed">
                            {description}
                          </span>
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
