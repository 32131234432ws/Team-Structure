"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, HeartPulse } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { HypercarePod, TeamMember } from "@/lib/team-data";
import { DevPodCard } from "@/components/dev-pod-card";
import { cn } from "@/lib/utils";

interface HypercareSectionProps {
  title: string;
  pods: HypercarePod[];
  badgeColor: string;
  defaultOpen?: boolean;
}

export function HypercareSection({
  title,
  pods,
  badgeColor,
  defaultOpen = true,
}: HypercareSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Calculate resource counts
  const resourceCounts = useMemo(() => {
    const allMembers = pods.flatMap((pod) => pod.team);

    const getUniqueActiveCountByRole = (role: TeamMember["role"]) => {
      const members = allMembers.filter(
        (m) => m.role === role && m.status === "Active"
      );
      const uniqueNames = new Set(
        members
          .map((m) => m.name)
          .filter((name) => name !== "TBD" && name !== "FPL")
      );
      const fplCount = members.some((m) => m.name === "FPL") ? 1 : 0;
      return uniqueNames.size + fplCount;
    };

    const tbdCount = allMembers.filter((m) => m.name === "TBD").length;

    return {
      Lead: getUniqueActiveCountByRole("Lead"),
      Dev: getUniqueActiveCountByRole("Dev"),
      QA: getUniqueActiveCountByRole("QA"),
      TBD: tbdCount,
    };
  }, [pods]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex flex-wrap items-center gap-3 mb-4 cursor-pointer group">
          <div className="flex items-center gap-2">
            {isOpen ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
            <HeartPulse className="h-5 w-5 text-green-400" />
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h2>
          </div>
          <span
            className={cn(
              "px-2 py-0.5 text-xs font-medium rounded-full border",
              badgeColor
            )}
          >
            {pods.length} {pods.length === 1 ? "Pod" : "Pods"}
          </span>
          <span
            className={cn(
              "px-2 py-0.5 text-xs font-medium rounded-full border",
              "bg-green-500/20 text-green-400 border-green-500/30"
            )}
          >
            Hypercare
          </span>
          <div className="flex flex-wrap items-center gap-1.5 ml-2">
            <span className="px-2 py-0.5 text-xs font-medium rounded-full border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              {resourceCounts.Lead} Lead
            </span>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full border bg-amber-500/20 text-amber-400 border-amber-500/30">
              {resourceCounts.Dev} Dev
            </span>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full border bg-rose-500/20 text-rose-400 border-rose-500/30">
              {resourceCounts.QA} QA
            </span>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full border bg-muted text-muted-foreground border-border">
              {resourceCounts.TBD} TBD
            </span>
          </div>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pods.map((pod) => (
            <DevPodCard
              key={pod.id}
              pod={pod}
              defaultExpanded={true}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
