"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DevPod, TeamMember, HypercarePod, SitUatMember } from "@/lib/team-data";
import { DevPodCard } from "@/components/dev-pod-card";
import { HypercarePodCard } from "@/components/hypercare-pod-card";
import { SitUatPodCard } from "@/components/sit-uat-pod-card";
import { cn } from "@/lib/utils";

interface CombinedReleaseSectionProps {
  title: string;
  phase: string;
  devPods: DevPod[];
  hypercarePods?: HypercarePod[];
  sitUatTeam?: SitUatMember[];
  badgeColor: string;
  phaseColor: string;
  defaultOpen?: boolean;
}

export function CombinedReleaseSection({
  title,
  phase,
  devPods,
  hypercarePods = [],
  sitUatTeam = [],
  badgeColor,
  phaseColor,
  defaultOpen = true,
}: CombinedReleaseSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [devPodsOpen, setDevPodsOpen] = useState(true);
  const [sitUatOpen, setSitUatOpen] = useState(true);
  const [hypercareOpen, setHypercareOpen] = useState(true);

  // Calculate unique resource counts by role for dev pods
  const resourceCounts = useMemo(() => {
    const allMembers = devPods.flatMap((pod) => pod.team);
    
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
      "Onshore SA": getUniqueActiveCountByRole("Onshore Solution Analyst"),
      "Offshore SA": getUniqueActiveCountByRole("Offshore Solution Analyst"),
      Dev: getUniqueActiveCountByRole("Dev"),
      QA: getUniqueActiveCountByRole("QA"),
      TBD: tbdCount,
    };
  }, [devPods]);

  const totalPods = devPods.length + hypercarePods.length + (sitUatTeam.length > 0 ? 1 : 0);

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
            {totalPods} {totalPods === 1 ? "Pod" : "Pods"}
          </span>
          <span
            className={cn(
              "px-2 py-0.5 text-xs font-medium rounded-full border",
              phaseColor
            )}
          >
            {phase}
          </span>
          <div className="flex flex-wrap items-center gap-1.5 ml-2">
            {resourceCounts.Lead > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                {resourceCounts.Lead} Lead
              </span>
            )}
            {resourceCounts["Onshore SA"] > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full border bg-blue-500/20 text-blue-400 border-blue-500/30">
                {resourceCounts["Onshore SA"]} Onshore SA
              </span>
            )}
            {resourceCounts["Offshore SA"] > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full border bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                {resourceCounts["Offshore SA"]} Offshore SA
              </span>
            )}
            {resourceCounts.Dev > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full border bg-amber-500/20 text-amber-400 border-amber-500/30">
                {resourceCounts.Dev} Dev
              </span>
            )}
            {resourceCounts.QA > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full border bg-rose-500/20 text-rose-400 border-rose-500/30">
                {resourceCounts.QA} QA
              </span>
            )}
            {resourceCounts.TBD > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full border bg-muted text-muted-foreground border-border">
                {resourceCounts.TBD} TBD
              </span>
            )}
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-6 pl-4 border-l-2 border-border/50">
          {/* Development PODs Sub-section */}
          <Collapsible open={devPodsOpen} onOpenChange={setDevPodsOpen}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center gap-3 mb-3 cursor-pointer group">
                <div className="flex items-center gap-2">
                  {devPodsOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                  <h3 className="text-md font-medium text-foreground group-hover:text-primary transition-colors">
                    Development PODs
                  </h3>
                </div>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full border bg-amber-500/20 text-amber-400 border-amber-500/30">
                  {devPods.length} {devPods.length === 1 ? "Pod" : "Pods"}
                </span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {devPods.map((pod) => (
                  <DevPodCard key={pod.id} pod={pod} />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* SIT/UAT Execution POD Sub-section */}
          {sitUatTeam.length > 0 && (
            <Collapsible open={sitUatOpen} onOpenChange={setSitUatOpen}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center gap-3 mb-3 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    {sitUatOpen ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                    <h3 className="text-md font-medium text-foreground group-hover:text-primary transition-colors">
                      Testing/QA Team
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full border bg-rose-500/20 text-rose-400 border-rose-500/30">
                    {sitUatTeam.length} QA
                  </span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mb-6">
                  <SitUatPodCard team={sitUatTeam} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Hypercare Sub-section */}
          {hypercarePods.length > 0 && (
            <Collapsible open={hypercareOpen} onOpenChange={setHypercareOpen}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center gap-3 mb-3 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    {hypercareOpen ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                    <h3 className="text-md font-medium text-foreground group-hover:text-primary transition-colors">
                      Hypercare
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full border bg-green-500/20 text-green-400 border-green-500/30">
                    {hypercarePods.length} {hypercarePods.length === 1 ? "Pod" : "Pods"}
                  </span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hypercarePods.map((pod) => (
                    <HypercarePodCard key={pod.id} pod={pod} />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
