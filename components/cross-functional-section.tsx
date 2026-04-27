"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Users, Layers } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CrossFunctionalTeam,
  roleColors,
  statusColors,
  TeamMember,
} from "@/lib/team-data";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CrossFunctionalSectionProps {
  teams: CrossFunctionalTeam[];
  defaultOpen?: boolean;
}

const roleOrder: TeamMember["role"][] = [
  "Lead",
  "Onshore Solution Analyst",
  "Offshore Solution Analyst",
  "Team",
  "Dev",
  "QA",
];

export function CrossFunctionalSection({
  teams,
  defaultOpen = true,
}: CrossFunctionalSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>(
    teams.reduce((acc, team) => ({ ...acc, [team.id]: true }), {})
  );
  const [expandedRoles, setExpandedRoles] = useState<Record<string, boolean>>({
    Lead: true,
    "Onshore Solution Analyst": true,
    "Offshore Solution Analyst": true,
    Team: true,
    Dev: true,
    QA: true,
  });

  const toggleTeam = (teamId: string) => {
    setExpandedTeams((prev) => ({ ...prev, [teamId]: !prev[teamId] }));
  };

  const toggleRole = (teamId: string, role: string) => {
    const key = `${teamId}-${role}`;
    setExpandedRoles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalMembers = teams.reduce((acc, team) => acc + team.team.length, 0);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-8">
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 rounded-xl border border-violet-500/20 hover:border-violet-500/40 transition-colors">
          <div className="flex items-center gap-3">
            {isOpen ? (
              <ChevronDown className="h-5 w-5 text-violet-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-violet-400" />
            )}
            <Layers className="h-5 w-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-foreground">
              Cross-Functional PODs
            </h2>
            <Badge
              variant="outline"
              className="bg-violet-500/20 text-violet-400 border-violet-500/30"
            >
              {teams.length} PODs
            </Badge>
            <Badge
              variant="outline"
              className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
            >
              {totalMembers} Members
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            Works across all releases
          </span>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => {
            const roleGroups = roleOrder.reduce((acc, role) => {
              const members = team.team.filter((m) => m.role === role);
              if (members.length > 0) {
                acc[role] = members;
              }
              return acc;
            }, {} as Record<string, typeof team.team>);

            return (
              <Card
                key={team.id}
                className={cn(
                  "bg-gradient-to-br border-border/50 hover:border-border transition-colors",
                  team.color
                )}
              >
                <CardHeader className="pb-2">
                  <button
                    onClick={() => toggleTeam(team.id)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-2">
                      {expandedTeams[team.id] ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                      <h3 className="text-lg font-semibold text-foreground">
                        {team.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{team.team.length}</span>
                    </div>
                  </button>
                  <p className="text-sm text-muted-foreground mt-2 ml-7">
                    {team.description}
                  </p>
                </CardHeader>

                {expandedTeams[team.id] && (
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {Object.entries(roleGroups).map(([role, members]) => {
                        const roleKey = `${team.id}-${role}`;
                        const isRoleExpanded = expandedRoles[roleKey] !== false;

                        return (
                          <div key={role} className="space-y-2">
                            <button
                              onClick={() => toggleRole(team.id, role)}
                              className="flex items-center gap-2 w-full text-left"
                            >
                              {isRoleExpanded ? (
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
                            {isRoleExpanded && (
                              <div className="grid gap-2 ml-5">
                                {members.map((member, idx) => (
                                  <div
                                    key={`${member.name}-${idx}`}
                                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-background/50 border border-border/50"
                                  >
                                    <span className="text-sm text-foreground">
                                      {member.name}
                                    </span>
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
                        );
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
