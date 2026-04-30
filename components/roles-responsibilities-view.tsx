"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Briefcase, Users, Code, TestTube } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import rolesData from "@/lib/roles-responsibilities-data.json";

interface RoleData {
  category: string;
  role: string;
  responsibilities: string[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  LEADERSHIP: <Briefcase className="h-5 w-5" />,
  "CROSS-FUNCTIONAL PODS": <Users className="h-5 w-5" />,
  "DEVELOPMENT PODS": <Code className="h-5 w-5" />,
  "QA / SIT / UAT": <TestTube className="h-5 w-5" />,
};

const categoryColors: Record<string, string> = {
  LEADERSHIP: "from-purple-500/20 to-purple-500/5 border-purple-500/30",
  "CROSS-FUNCTIONAL PODS": "from-violet-500/20 to-violet-500/5 border-violet-500/30",
  "DEVELOPMENT PODS": "from-amber-500/20 to-amber-500/5 border-amber-500/30",
  "QA / SIT / UAT": "from-rose-500/20 to-rose-500/5 border-rose-500/30",
};

const categoryBadgeColors: Record<string, string> = {
  LEADERSHIP: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "CROSS-FUNCTIONAL PODS": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "DEVELOPMENT PODS": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "QA / SIT / UAT": "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

export function RolesResponsibilitiesView() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["LEADERSHIP", "CROSS-FUNCTIONAL PODS", "DEVELOPMENT PODS", "QA / SIT / UAT"])
  );
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());

  const typedRolesData = rolesData as RoleData[];
  
  // Group roles by category
  const groupedRoles = typedRolesData.reduce((acc, role) => {
    if (!acc[role.category]) {
      acc[role.category] = [];
    }
    acc[role.category].push(role);
    return acc;
  }, {} as Record<string, RoleData[]>);

  const categories = Object.keys(groupedRoles);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleRole = (roleKey: string) => {
    const newExpanded = new Set(expandedRoles);
    if (newExpanded.has(roleKey)) {
      newExpanded.delete(roleKey);
    } else {
      newExpanded.add(roleKey);
    }
    setExpandedRoles(newExpanded);
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
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            {typedRolesData.length} Roles
          </Badge>
          <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
            {categories.length} Categories
          </Badge>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {categories.map((category) => {
          const roles = groupedRoles[category];
          const isExpanded = expandedCategories.has(category);

          return (
            <Card
              key={category}
              className={cn(
                "bg-gradient-to-br border-border/50",
                categoryColors[category] || "from-muted/20 to-muted/5"
              )}
            >
              <CardHeader className="pb-2">
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-muted-foreground">
                      {categoryIcons[category] || <Briefcase className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{category}</h3>
                      <p className="text-sm text-muted-foreground">
                        {roles.length} role{roles.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={categoryBadgeColors[category] || "bg-muted text-muted-foreground"}
                    >
                      {roles.length}
                    </Badge>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-2">
                  <div className="space-y-2">
                    {roles.map((role, idx) => {
                      const roleKey = `${category}-${role.role}-${idx}`;
                      const isRoleExpanded = expandedRoles.has(roleKey);

                      return (
                        <div
                          key={roleKey}
                          className="bg-background/50 border border-border/50 rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => toggleRole(roleKey)}
                            className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-muted/30 transition-colors"
                          >
                            <span className="text-sm font-medium text-foreground">
                              {role.role}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {role.responsibilities.length} responsibilities
                              </span>
                              {isRoleExpanded ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </button>

                          {isRoleExpanded && (
                            <div className="px-4 pb-3 pt-1 border-t border-border/30">
                              <ul className="space-y-1.5">
                                {role.responsibilities.map((resp, respIdx) => (
                                  <li
                                    key={respIdx}
                                    className="flex items-start gap-2 text-sm text-muted-foreground"
                                  >
                                    <span className="text-primary mt-1.5 text-xs">●</span>
                                    <span>{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
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
