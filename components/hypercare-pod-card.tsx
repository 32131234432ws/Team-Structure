"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HypercarePod, roleColors, statusColors } from "@/lib/team-data";
import { cn } from "@/lib/utils";

interface HypercarePodCardProps {
  pod: HypercarePod;
}

export function HypercarePodCard({ pod }: HypercarePodCardProps) {
  return (
    <Card className={cn("bg-gradient-to-br border-border/50", pod.color)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{pod.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{pod.description}</p>
          </div>
        </div>
        {pod.badges && pod.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {pod.badges.map((badge, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs bg-green-500/20 text-green-400 border-green-500/30"
              >
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          {pod.team.map((member, idx) => (
            <div
              key={`${member.name}-${idx}`}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-background/50 border border-border/50"
            >
              <div className="flex flex-col">
                <span className="text-sm text-foreground">{member.name}</span>
                <Badge
                  variant="outline"
                  className={cn("text-xs w-fit mt-1", roleColors[member.role])}
                >
                  {member.role}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={cn("h-2 w-2 rounded-full", statusColors[member.status])}
                />
                <span className="text-xs text-muted-foreground">{member.status}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
