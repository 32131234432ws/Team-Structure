"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Users, Code, TestTube, Settings, FileText } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import rolesData from "@/lib/roles-responsibilities-data.json";

interface RoleData {
  category: string;
  role: string;
  responsibilities: string[];
}

// Map roles to categories and icons
const roleCategories: Record<string, { category: string; icon: React.ReactNode; color: string; badgeColor: string }> = {
  "ONSHORE SOLUTION ANALYST": { 
    category: "Solution Analysts", 
    icon: <FileText className="h-4 w-4" />,
    color: "from-blue-500/20 to-blue-500/5",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30"
  },
  "OFFSHORE SOLUTION ANALYST": { 
    category: "Solution Analysts", 
    icon: <FileText className="h-4 w-4" />,
    color: "from-cyan-500/20 to-cyan-500/5",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
  },
  "DEVELOPER": { 
    category: "Development", 
    icon: <Code className="h-4 w-4" />,
    color: "from-amber-500/20 to-amber-500/5",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30"
  },
  "DEVELOPMENT LEAD": { 
    category: "Development", 
    icon: <Code className="h-4 w-4" />,
    color: "from-emerald-500/20 to-emerald-500/5",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
  },
  "QUALITY ASSURANCE": { 
    category: "QA / Testing", 
    icon: <TestTube className="h-4 w-4" />,
    color: "from-rose-500/20 to-rose-500/5",
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30"
  },
  "INTEGRATION POD": { 
    category: "Cross-Functional", 
    icon: <Settings className="h-4 w-4" />,
    color: "from-violet-500/20 to-violet-500/5",
    badgeColor: "bg-violet-500/20 text-violet-400 border-violet-500/30"
  },
  "DEVOPS POD": { 
    category: "Cross-Functional", 
    icon: <Settings className="h-4 w-4" />,
    color: "from-indigo-500/20 to-indigo-500/5",
    badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
  },
  "PROGRAM MANAGEMENT OFFICE (PMO)": { 
    category: "Program Management", 
    icon: <Users className="h-4 w-4" />,
    color: "from-pink-500/20 to-pink-500/5",
    badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30"
  },
};

export function RolesResponsibilitiesView() {
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());

  const typedRolesData = (rolesData as RoleData[]).filter(
    (r) => r.role !== "Role" && r.responsibilities.length > 0
  );

  const toggleRole = (roleKey: string) => {
    const newExpanded = new Set(expandedRoles);
    if (newExpanded.has(roleKey)) {
      newExpanded.delete(roleKey);
    } else {
      newExpanded.add(roleKey);
    }
    setExpandedRoles(newExpanded);
  };

  const expandAll = () => {
    setExpandedRoles(new Set(typedRolesData.map((r) => r.role)));
  };

  const collapseAll = () => {
    setExpandedRoles(new Set());
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Roles & Responsibilities</h2>
          <p className="text-sm text-muted-foreground mt-1">
            FPL Program role definitions derived from RACI matrix
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted"
          >
            Collapse All
          </button>
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            {typedRolesData.length} Roles
          </Badge>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
        <span className="font-medium">Legend:</span>
        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">R = Responsible</span>
        <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">A = Accountable</span>
        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">C = Consulted</span>
      </div>

      {/* Roles List */}
      <div className="space-y-3">
        {typedRolesData.map((role) => {
          const isExpanded = expandedRoles.has(role.role);
          const roleInfo = roleCategories[role.role] || {
            category: "Other",
            icon: <Users className="h-4 w-4" />,
            color: "from-muted/20 to-muted/5",
            badgeColor: "bg-muted text-muted-foreground border-border"
          };

          return (
            <Card
              key={role.role}
              className={cn(
                "bg-gradient-to-br border-border/50 overflow-hidden",
                roleInfo.color
              )}
            >
              <CardHeader className="py-3 px-4">
                <button
                  onClick={() => toggleRole(role.role)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("p-1.5 rounded", roleInfo.badgeColor)}>
                      {roleInfo.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{role.role}</h3>
                      <p className="text-xs text-muted-foreground">{roleInfo.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("text-xs", roleInfo.badgeColor)}>
                      {role.responsibilities.length} items
                    </Badge>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0 pb-4 px-4">
                  <div className="border-t border-border/30 pt-3">
                    <div className="space-y-2">
                      {role.responsibilities.map((resp, idx) => {
                        // Parse the responsibility to highlight phase and R/A/C markers
                        const parts = resp.split("|");
                        const phase = parts[0]?.trim() || "";
                        const details = parts[1]?.trim() || resp;

                        return (
                          <div
                            key={idx}
                            className="flex items-start gap-3 py-2 px-3 rounded-lg bg-background/50 border border-border/30"
                          >
                            {phase && parts.length > 1 && (
                              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded whitespace-nowrap">
                                {phase}
                              </span>
                            )}
                            <span className="text-sm text-muted-foreground flex-1">
                              {parts.length > 1 ? details : resp}
                            </span>
                          </div>
                        );
                      })}
                    </div>
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
