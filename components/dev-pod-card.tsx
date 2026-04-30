"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DevPod, HypercarePod, roleColors, statusColors, TeamMember } from "@/lib/team-data";
import { cn } from "@/lib/utils";

export interface DevPodCardProps {
  pod: DevPod | HypercarePod;
  defaultExpanded?: boolean;
}

const roleOrder: TeamMember["role"][] = ["Lead", "Onshore Solution Analyst", "Offshore Solution Analyst", "Dev", "QA"];

export function DevPodCard({ pod, defaultExpanded = true }: DevPodCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [expandedRoles, setExpandedRoles] = useState<Record<string, boolean>>({
    Lead: true,
    "Onshore Solution Analyst": true,
    "Offshore Solution Analyst": true,
    Dev: true,
    QA: true,
  });

  const toggleRole = (role: string) => {
    setExpandedRoles((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  const roleGroups = roleOrder.reduce((acc, role) => {
    const members = pod.team.filter((m) => m.role === role);
    if (members.length > 0) {
      acc[role] = members;
    }
    return acc;
  }, {} as Record<string, typeof pod.team>);

  return (
    <Card className={cn("bg-gradient-to-br border-border/50", pod.color)}>
      <CardHeader className="pb-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
            <h3 className="text-lg font-semibold text-foreground">
              {pod.name}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm">{pod.team.length}</span>
          </div>
        </button>
        <p className="text-sm text-muted-foreground mt-2 ml-7">
          {pod.description}
        </p>
        {pod.badges && pod.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 ml-7">
            {pod.badges.map((badge) => (
              <Badge
                key={badge}
                variant="outline"
                className="text-xs bg-primary/10 text-primary border-primary/30"
              >
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-4 ml-7">
            {Object.entries(roleGroups).map(([role, members]) => (
              <div key={role} className="space-y-2">
                <button
                  onClick={() => toggleRole(role)}
                  className="flex items-center gap-2 w-full text-left"
                >
                  {expandedRoles[role] ? (
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  )}
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium",
                      roleColors[role as keyof typeof roleColors]
                    )}
                  >
                    {role}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    ({members.length})
                  </span>
                </button>
                {expandedRoles[role] && (
                  <div className="grid gap-2 ml-5">
                    {members.map((member, idx) => (
                      <div
                        key={`${member.name}-${idx}`}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-background/50 border border-border/50"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm text-foreground">
                            {member.name}
                          </span>
                          {member.valueStreams && member.valueStreams.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {member.valueStreams.join(", ")}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "h-2 w-2 rounded-full",
                              statusColors[member.status]
                            )}
                          />
                          <span className="text-xs text-muted-foreground">
                            {member.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
