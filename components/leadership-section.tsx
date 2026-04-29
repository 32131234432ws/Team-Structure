"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Crown } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  leadershipTeam,
  leadershipRoleColors,
  LeadershipMember,
} from "@/lib/team-data";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface LeadershipSectionProps {
  defaultOpen?: boolean;
}

export function LeadershipSection({ defaultOpen = false }: LeadershipSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Group by role
  const roleGroups = leadershipTeam.reduce((acc, member) => {
    if (!acc[member.role]) {
      acc[member.role] = [];
    }
    acc[member.role].push(member);
    return acc;
  }, {} as Record<string, LeadershipMember[]>);

  const roleOrder: LeadershipMember["role"][] = [
    "Lead",
    "Architect",
    "PMO",
  ];

  const roleDisplayNames: Record<LeadershipMember["role"], string> = {
    Lead: "Engagement Leads",
    Architect: "Architects",
    PMO: "PMO",
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-8">
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-colors">
          <div className="flex items-center gap-3">
            {isOpen ? (
              <ChevronDown className="h-5 w-5 text-purple-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-purple-400" />
            )}
            <Crown className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-foreground">
              Leadership
            </h2>
            <Badge
              variant="outline"
              className="bg-purple-500/20 text-purple-400 border-purple-500/30"
            >
              {leadershipTeam.length} Leaders
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            Program Leadership & Governance
          </span>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-4">
        <div className="grid grid-cols-1 gap-6">
          {/* Leadership Team Card */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-foreground">
                  Program Leadership
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Executive sponsors and program management
              </p>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {roleOrder.map((role) => {
                  const members = roleGroups[role];
                  if (!members || members.length === 0) return null;

                  return (
                    <div key={role} className="space-y-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-medium",
                          leadershipRoleColors[role]
                        )}
                      >
                        {roleDisplayNames[role]} ({members.length})
                      </Badge>
                      <div className="grid gap-2 ml-2">
                        {members.map((member, idx) => (
                          <div
                            key={`${member.name}-${idx}`}
                            className="flex items-center justify-between py-2 px-3 rounded-lg bg-background/50 border border-border/50"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm text-foreground">
                                {member.name}
                              </span>
                              {member.subRole && (
                                <span className="text-xs text-muted-foreground">
                                  {member.subRole}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "h-2 w-2 rounded-full",
                                  member.status === "Active"
                                    ? "bg-emerald-500"
                                    : member.status === "Planned"
                                    ? "bg-amber-500"
                                    : "bg-muted-foreground"
                                )}
                              />
                              <span className="text-xs text-muted-foreground">
                                {member.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
