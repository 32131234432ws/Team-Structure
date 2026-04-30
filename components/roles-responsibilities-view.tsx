"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, FileText, Pencil, Code, TestTube, Users, Rocket, CheckCircle, RefreshCw, Zap, HeartPulse, X, Filter } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import raciData from "@/lib/roles-responsibilities-data.json";

interface RACIData {
  roles: string[];
  phases: Record<string, { phase: string; activity: string; raci: Record<string, string> }[]>;
  activities: { phase: string; activity: string; raci: Record<string, string> }[];
}

const phaseConfig: Record<string, { icon: React.ReactNode; color: string; badgeColor: string }> = {
  "Requirements": {
    icon: <FileText className="h-4 w-4" />,
    color: "from-blue-500/20 to-blue-500/5 border-blue-500/30",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  "Design": {
    icon: <Pencil className="h-4 w-4" />,
    color: "from-purple-500/20 to-purple-500/5 border-purple-500/30",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  "Development": {
    icon: <Code className="h-4 w-4" />,
    color: "from-amber-500/20 to-amber-500/5 border-amber-500/30",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  "SIT": {
    icon: <TestTube className="h-4 w-4" />,
    color: "from-rose-500/20 to-rose-500/5 border-rose-500/30",
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  },
  "UAT": {
    icon: <Users className="h-4 w-4" />,
    color: "from-orange-500/20 to-orange-500/5 border-orange-500/30",
    badgeColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
  "Cutover": {
    icon: <RefreshCw className="h-4 w-4" />,
    color: "from-teal-500/20 to-teal-500/5 border-teal-500/30",
    badgeColor: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  },
  "Go Live": {
    icon: <Rocket className="h-4 w-4" />,
    color: "from-green-500/20 to-green-500/5 border-green-500/30",
    badgeColor: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  "Post-Dev": {
    icon: <CheckCircle className="h-4 w-4" />,
    color: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
  "Sprint": {
    icon: <Zap className="h-4 w-4" />,
    color: "from-indigo-500/20 to-indigo-500/5 border-indigo-500/30",
    badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  },
  "Hypercare": {
    icon: <HeartPulse className="h-4 w-4" />,
    color: "from-red-500/20 to-red-500/5 border-red-500/30",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
  },
};

const raciColors: Record<string, string> = {
  "R": "bg-emerald-500 text-white",
  "A": "bg-blue-500 text-white",
  "C": "bg-amber-500 text-white",
  "I": "bg-slate-400 text-white",
  "R/A": "bg-purple-500 text-white",
  "-": "bg-transparent",
};

const roleAbbreviations: Record<string, string> = {
  "Onshore Solution Analyst": "Onshore SA",
  "Offshore Solution Analyst": "Offshore SA",
  "Developer": "Dev",
  "Development Lead": "Dev Lead",
  "Quality Assurance": "QA",
  "Integration POD": "Integration",
  "DevOps POD": "DevOps",
  "Program Management Office": "PMO",
};

const defaultConfig = {
  icon: <FileText className="h-5 w-5" />,
  color: "from-muted/20 to-muted/5 border-border",
  badgeColor: "bg-muted text-muted-foreground border-border",
};

export function RolesResponsibilitiesView() {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  const [selectedRaci, setSelectedRaci] = useState<Set<string>>(new Set());
  const [selectedPhases, setSelectedPhases] = useState<Set<string>>(new Set());
  const [openDropdown, setOpenDropdown] = useState<"phase" | "role" | "raci" | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const typedRaciData = raciData as RACIData;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const phases = Object.keys(typedRaciData.phases);
  const raciTypes = ["R", "A", "C", "I"];

  const togglePhase = (phase: string) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(phase)) {
      newExpanded.delete(phase);
    } else {
      newExpanded.add(phase);
    }
    setExpandedPhases(newExpanded);
  };

  const toggleFilter = (set: Set<string>, value: string, setter: (s: Set<string>) => void) => {
    const newSet = new Set(set);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setter(newSet);
  };

  const clearAllFilters = () => {
    setSelectedRoles(new Set());
    setSelectedRaci(new Set());
    setSelectedPhases(new Set());
  };

  const hasActiveFilters = selectedRoles.size > 0 || selectedRaci.size > 0 || selectedPhases.size > 0;

  // Filter phases based on selected phase filter
  const filteredPhases = selectedPhases.size > 0 
    ? phases.filter(p => selectedPhases.has(p))
    : phases;

  // Filter activities based on role and RACI filters
  const filterActivities = (activities: { phase: string; activity: string; raci: Record<string, string> }[]) => {
    return activities.filter(activity => {
      // If role filter is active, check if any selected role has a RACI value
      if (selectedRoles.size > 0) {
        const hasMatchingRole = Array.from(selectedRoles).some(role => {
          const raciValue = activity.raci[role];
          return raciValue && raciValue !== "-";
        });
        if (!hasMatchingRole) return false;
      }
      
      // If RACI filter is active, check if any role has the selected RACI value
      if (selectedRaci.size > 0) {
        const hasMatchingRaci = typedRaciData.roles.some(role => {
          const raciValue = activity.raci[role];
          return selectedRaci.has(raciValue);
        });
        if (!hasMatchingRaci) return false;
      }
      
      return true;
    });
  };

  const expandAll = () => {
    setExpandedPhases(new Set(filteredPhases));
  };

  const collapseAll = () => {
    setExpandedPhases(new Set());
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Roles & Responsibilities</h2>
          <p className="text-sm text-muted-foreground mt-1">
            RACI Matrix - Responsibility assignments across lifecycle phases
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted/50 transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted/50 transition-colors"
          >
            Collapse All
          </button>
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            {filteredPhases.length} Phases
          </Badge>
        </div>
      </div>

      {/* Filters - 3 dropdowns in one line */}
      <div ref={dropdownRef} className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filters:</span>
        </div>

        {/* Lifecycle Phase Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setOpenDropdown(openDropdown === "phase" ? null : "phase");
            }}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border transition-colors",
              selectedPhases.size > 0
                ? "bg-primary/20 text-primary border-primary/30"
                : "bg-background text-muted-foreground border-border hover:border-foreground/30"
            )}
          >
            Lifecycle Phase
            {selectedPhases.size > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {selectedPhases.size}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4" />
          </button>
          {openDropdown === "phase" && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-border rounded-md shadow-lg z-50 py-1 max-h-64 overflow-y-auto">
              {phases.map(phase => {
                const isSelected = selectedPhases.has(phase);
                return (
                  <button
                    key={phase}
                    onClick={() => toggleFilter(selectedPhases, phase, setSelectedPhases)}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-sm hover:bg-muted/50 transition-colors flex items-center justify-between",
                      isSelected && "bg-muted/30"
                    )}
                  >
                    <span>{phase}</span>
                    {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Role Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setOpenDropdown(openDropdown === "role" ? null : "role");
            }}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border transition-colors",
              selectedRoles.size > 0
                ? "bg-primary/20 text-primary border-primary/30"
                : "bg-background text-muted-foreground border-border hover:border-foreground/30"
            )}
          >
            Role
            {selectedRoles.size > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {selectedRoles.size}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4" />
          </button>
          {openDropdown === "role" && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-background border border-border rounded-md shadow-lg z-50 py-1 max-h-64 overflow-y-auto">
              {typedRaciData.roles.map(role => {
                const isSelected = selectedRoles.has(role);
                return (
                  <button
                    key={role}
                    onClick={() => toggleFilter(selectedRoles, role, setSelectedRoles)}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-sm hover:bg-muted/50 transition-colors flex items-center justify-between",
                      isSelected && "bg-muted/30"
                    )}
                  >
                    <span>{roleAbbreviations[role] || role}</span>
                    {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* RACI Type Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setOpenDropdown(openDropdown === "raci" ? null : "raci");
            }}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border transition-colors",
              selectedRaci.size > 0
                ? "bg-primary/20 text-primary border-primary/30"
                : "bg-background text-muted-foreground border-border hover:border-foreground/30"
            )}
          >
            RACI Type
            {selectedRaci.size > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {selectedRaci.size}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4" />
          </button>
          {openDropdown === "raci" && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-border rounded-md shadow-lg z-50 py-1">
              {raciTypes.map(raci => {
                const isSelected = selectedRaci.has(raci);
                const labels: Record<string, string> = { R: "Responsible", A: "Accountable", C: "Consulted", I: "Informed" };
                return (
                  <button
                    key={raci}
                    onClick={() => toggleFilter(selectedRaci, raci, setSelectedRaci)}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-sm hover:bg-muted/50 transition-colors flex items-center gap-2",
                      isSelected && "bg-muted/30"
                    )}
                  >
                    <Badge className={cn("text-xs w-6 h-6 flex items-center justify-center p-0 rounded-full", raciColors[raci])}>
                      {raci}
                    </Badge>
                    <span>{labels[raci]}</span>
                    {isSelected && <CheckCircle className="h-4 w-4 text-primary ml-auto" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
        <span className="text-xs font-medium text-muted-foreground">RACI Legend:</span>
        <div className="flex items-center gap-1">
          <Badge className={cn("text-xs w-6 h-6 flex items-center justify-center p-0 rounded-full", raciColors["R"])}>R</Badge>
          <span className="text-xs text-muted-foreground">Responsible</span>
        </div>
        <div className="flex items-center gap-1">
          <Badge className={cn("text-xs w-6 h-6 flex items-center justify-center p-0 rounded-full", raciColors["A"])}>A</Badge>
          <span className="text-xs text-muted-foreground">Accountable</span>
        </div>
        <div className="flex items-center gap-1">
          <Badge className={cn("text-xs w-6 h-6 flex items-center justify-center p-0 rounded-full", raciColors["C"])}>C</Badge>
          <span className="text-xs text-muted-foreground">Consulted</span>
        </div>
        <div className="flex items-center gap-1">
          <Badge className={cn("text-xs w-6 h-6 flex items-center justify-center p-0 rounded-full", raciColors["I"])}>I</Badge>
          <span className="text-xs text-muted-foreground">Informed</span>
        </div>
      </div>

      {/* Phase Tiles */}
      <div className="grid grid-cols-1 gap-1">
        {filteredPhases.map((phase) => {
          const config = phaseConfig[phase] || defaultConfig;
          const isExpanded = expandedPhases.has(phase);
          const allActivities = typedRaciData.phases[phase] || [];
          const activities = filterActivities(allActivities);

          return (
            <div
              key={phase}
              className={cn(
                "bg-gradient-to-br border rounded-md transition-all duration-200",
                config.color
              )}
            >
              <button
                onClick={() => togglePhase(phase)}
                className="flex items-center justify-between w-full text-left px-3 py-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className={cn(config.badgeColor.replace("bg-", "text-").split(" ")[0])}>
                    {config.icon}
                  </span>
                  <span className="text-sm font-medium text-foreground">{phase}</span>
                  <span className="text-xs text-muted-foreground">
                    ({activities.length}{activities.length !== allActivities.length && `/${allActivities.length}`})
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {isExpanded && (
                <div className="px-2 pb-1">
                  <div className="space-y-1">
                    {/* Activity Header Row */}
                    <div className="hidden md:grid md:grid-cols-12 gap-1 px-2 py-1 bg-background/30 rounded border border-border/30">
                      <div className="col-span-4 text-xs font-medium text-muted-foreground">Activity</div>
                      <div className="col-span-8 grid grid-cols-8 gap-0.5">
                        {typedRaciData.roles.map((role) => (
                          <div key={role} className="text-center">
                            <span className="text-[10px] font-medium text-muted-foreground truncate block" title={role}>
                              {roleAbbreviations[role] || role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Activity Rows */}
                    {activities.map((activity, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-12 gap-1 px-2 py-1.5 rounded bg-background/50 border border-border/30 hover:bg-background/70 transition-colors"
                      >
                        <div className="col-span-4 text-xs text-foreground">
                          {activity.activity}
                        </div>
                        <div className="col-span-8 grid grid-cols-8 gap-0.5">
                          {typedRaciData.roles.map((role) => {
                            const raciValue = activity.raci[role] || "-";
                            return (
                              <div key={role} className="flex justify-center items-center">
                                {raciValue !== "-" ? (
                                  <Badge 
                                    className={cn(
                                      "text-[10px] w-5 h-5 flex items-center justify-center p-0 rounded-full font-bold",
                                      raciColors[raciValue] || raciColors["-"]
                                    )}
                                    title={`${role}: ${raciValue}`}
                                  >
                                    {raciValue}
                                  </Badge>
                                ) : (
                                  <span className="text-[10px] text-muted-foreground/50">-</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {/* Mobile view - show role labels */}
                        <div className="md:hidden col-span-1 flex flex-wrap gap-2 mt-2">
                          {typedRaciData.roles.map((role) => {
                            const raciValue = activity.raci[role] || "-";
                            if (raciValue === "-") return null;
                            return (
                              <div key={role} className="flex items-center gap-1">
                                <Badge 
                                  className={cn(
                                    "text-xs w-5 h-5 flex items-center justify-center p-0 rounded-full",
                                    raciColors[raciValue]
                                  )}
                                >
                                  {raciValue}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {roleAbbreviations[role] || role}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
