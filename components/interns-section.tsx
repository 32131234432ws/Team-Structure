"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { interns } from "@/lib/team-data";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface InternsSectionProps {
  defaultOpen?: boolean;
}

export function InternsSection({ defaultOpen = false }: InternsSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-8">
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-lime-500/10 to-green-500/10 rounded-xl border border-lime-500/20 hover:border-lime-500/40 transition-colors">
          <div className="flex items-center gap-3">
            {isOpen ? (
              <ChevronDown className="h-5 w-5 text-lime-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-lime-400" />
            )}
            <GraduationCap className="h-5 w-5 text-lime-400" />
            <h2 className="text-lg font-semibold text-foreground">
              Interns
            </h2>
            <Badge
              variant="outline"
              className="bg-lime-500/20 text-lime-400 border-lime-500/30"
            >
              {interns.length} Intern{interns.length !== 1 ? "s" : ""}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            Internship Program Participants
          </span>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-4">
        <Card className="bg-gradient-to-br from-lime-500/10 to-green-500/10 border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-lime-400" />
              <h3 className="text-lg font-semibold text-foreground">
                Internship Program
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Current and planned internship assignments
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            {interns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {interns.map((intern, idx) => (
                  <div
                    key={`${intern.name}-${idx}`}
                    className="flex items-center justify-between py-3 px-4 rounded-lg bg-background/50 border border-border/50"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {intern.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {intern.team}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full",
                          intern.status === "Active"
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        )}
                      />
                      <span className="text-xs text-muted-foreground">
                        {intern.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No interns currently assigned
              </p>
            )}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
