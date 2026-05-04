"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, TestTube2, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sitUatExecutionTeam, SitUatMember } from "@/lib/team-data";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SitUatSectionProps {
  defaultOpen?: boolean;
}

export function SitUatSection({ defaultOpen = true }: SitUatSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [expandedValueStreams, setExpandedValueStreams] = useState<Record<string, boolean>>({});

  // Group QA members by value stream
  const valueStreamGroups: Record<string, SitUatMember[]> = {};
  sitUatExecutionTeam.forEach((member) => {
    member.valueStreams.forEach((vs) => {
      if (!valueStreamGroups[vs]) {
        valueStreamGroups[vs] = [];
      }
      if (!valueStreamGroups[vs].find((m) => m.name === member.name)) {
        valueStreamGroups[vs].push(member);
      }
    });
  });

  const valueStreamOrder = [
    "All Value Streams",
    "Move In",
    "Move Out",
    "Transfer",
    "Interactions",
    "Search",
    "Account Maintenance",
    "Payment & Payment Options",
    "Billing Programs",
  ];

  const toggleValueStream = (vs: string) => {
    setExpandedValueStreams((prev) => ({ ...prev, [vs]: !prev[vs] }));
  };

  const qaLead = sitUatExecutionTeam.find((m) => m.role === "QA Lead");
  const qaMembers = sitUatExecutionTeam.filter((m) => m.role === "QA");

  return (
    <div className="mb-8">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-rose-500/10 to-orange-500/10 rounded-xl border border-rose-500/20 hover:border-rose-500/40 transition-colors mb-4">
            <div className="flex items-center gap-3">
              {isOpen ? (
                <ChevronDown className="h-5 w-5 text-rose-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-rose-400" />
              )}
              <TestTube2 className="h-5 w-5 text-rose-400" />
              <h2 className="text-lg font-semibold text-foreground">
                Testing/QA Team
              </h2>
              <Badge
                variant="outline"
                className="bg-rose-500/20 text-rose-400 border-rose-500/30"
              >
                {sitUatExecutionTeam.length} QA Resources
              </Badge>
              <Badge
                variant="outline"
                className="bg-orange-500/20 text-orange-400 border-orange-500/30"
              >
                {Object.keys(valueStreamGroups).length - 1} Value Streams
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              IR3.2 SIT/UAT Quality Assurance
            </span>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* QA Lead Card */}
            <Card className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-red-400" />
                  <h3 className="text-lg font-semibold text-foreground">
                    QA Lead
                  </h3>
                </div>
              </CardHeader>
              <CardContent>
                {qaLead && (
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-background/50 border border-border/50">
                    <span className="text-sm text-foreground font-medium">
                      {qaLead.name}
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-red-500/20 text-red-400 border-red-500/30 text-xs"
                    >
                      {qaLead.role}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Value Stream Coverage Card */}
            <Card className="lg:col-span-2 bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <TestTube2 className="h-5 w-5 text-orange-400" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Value Stream Coverage
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  QA resources mapped to supported value streams
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {valueStreamOrder.map((vs) => {
                    const members = valueStreamGroups[vs];
                    if (!members || members.length === 0 || vs === "All Value Streams") return null;

                    const isExpanded = expandedValueStreams[vs] !== false;

                    return (
                      <div
                        key={vs}
                        className="rounded-lg bg-background/50 border border-border/50 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleValueStream(vs)}
                          className="flex items-center justify-between w-full p-3 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="text-sm font-medium text-foreground">
                              {vs}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs"
                          >
                            {members.length} QA
                          </Badge>
                        </button>
                        {isExpanded && (
                          <div className="px-3 pb-3 space-y-1">
                            {members.map((member, idx) => (
                              <div
                                key={`${member.name}-${idx}`}
                                className="flex items-center gap-2 py-1 px-2 text-xs text-muted-foreground"
                              >
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                {member.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Full Team List */}
          <Card className="mt-6 bg-gradient-to-br from-rose-500/5 to-orange-500/5 border-border/50">
            <CardHeader className="pb-2">
              <h3 className="text-md font-semibold text-foreground">
                Full QA Execution Team
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {qaMembers.map((member, idx) => (
                  <div
                    key={`${member.name}-${idx}`}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-background/50 border border-border/50"
                  >
                    <span className="text-sm text-foreground">{member.name}</span>
                    <div className="flex flex-wrap gap-1 justify-end max-w-[150px]">
                      {member.valueStreams.slice(0, 2).map((vs) => (
                        <Badge
                          key={vs}
                          variant="outline"
                          className="bg-muted/50 text-muted-foreground border-border text-[10px] px-1"
                        >
                          {vs.length > 12 ? vs.substring(0, 10) + "..." : vs}
                        </Badge>
                      ))}
                      {member.valueStreams.length > 2 && (
                        <Badge
                          variant="outline"
                          className="bg-muted/50 text-muted-foreground border-border text-[10px] px-1"
                        >
                          +{member.valueStreams.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
