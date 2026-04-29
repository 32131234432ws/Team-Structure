"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SitUatMember } from "@/lib/team-data";
import { cn } from "@/lib/utils";

interface SitUatPodCardProps {
  team: SitUatMember[];
}

export function SitUatPodCard({ team }: SitUatPodCardProps) {
  // Group by value streams
  const valueStreamGroups = team.reduce((acc, member) => {
    member.valueStreams.forEach((vs) => {
      if (!acc[vs]) {
        acc[vs] = [];
      }
      acc[vs].push(member);
    });
    return acc;
  }, {} as Record<string, SitUatMember[]>);

  const qaLeads = team.filter((m) => m.role === "QA Lead");
  const qaMembers = team.filter((m) => m.role === "QA");

  return (
    <Card className="bg-gradient-to-br from-rose-500/10 to-rose-500/5 border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">SIT / UAT Execution Team</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Quality assurance team supporting all value streams
            </p>
          </div>
          <Badge
            variant="outline"
            className="bg-rose-500/20 text-rose-400 border-rose-500/30"
          >
            {team.length} QA
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {/* QA Leads */}
          {qaLeads.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                QA Lead{qaLeads.length > 1 ? "s" : ""}
              </h4>
              <div className="space-y-2">
                {qaLeads.map((lead, idx) => (
                  <div
                    key={`${lead.name}-${idx}`}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-background/50 border border-border/50"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground">{lead.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {lead.valueStreams.join(", ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-xs text-muted-foreground">{lead.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Value Stream Coverage */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Value Stream Coverage</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(valueStreamGroups)
                .filter(([vs]) => vs !== "All Value Streams")
                .map(([vs, members]) => (
                  <Badge
                    key={vs}
                    variant="outline"
                    className="bg-background/50 text-foreground border-border"
                  >
                    {vs} ({members.length})
                  </Badge>
                ))}
            </div>
          </div>

          {/* QA Members */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">QA Team ({qaMembers.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {qaMembers.map((member, idx) => (
                <div
                  key={`${member.name}-${idx}`}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-background/50 border border-border/50"
                >
                  <div className="flex flex-col">
                    <span className="text-sm text-foreground">{member.name}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {member.valueStreams.join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        member.status === "Active" ? "bg-emerald-500" : "bg-amber-500"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
