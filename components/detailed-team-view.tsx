"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { fplStaffingData } from "@/lib/fpl-staffing-types";
import { cn } from "@/lib/utils";
import { Search, Mail, ChevronDown, X } from "lucide-react";

const designationColors: Record<string, string> = {
  Manager: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Senior Associate": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Associate: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Intern: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const releaseColors: Record<string, string> = {
  IR3: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  IR4: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  All: "bg-violet-500/20 text-violet-400 border-violet-500/30",
};

const roleColors: Record<string, string> = {
  Lead: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Solution Analyst": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Developer: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  QA: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  DevOps: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  Integration: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  PMO: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Architecture: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export function DetailedTeamView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterRelease, setFilterRelease] = useState<string | null>(null);
  const [filterWorkstream, setFilterWorkstream] = useState<string | null>(null);
  const [filterPod, setFilterPod] = useState<string | null>(null);
  const [expandedFilters, setExpandedFilters] = useState<string[]>(["role", "release"]);

  const toggleFilter = (filter: string) => {
    setExpandedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const roles = useMemo(() => {
    const set = new Set<string>();
    fplStaffingData.forEach((m) => {
      if (m.Role) set.add(m.Role);
    });
    return Array.from(set).sort();
  }, []);

  const releases = useMemo(() => {
    const set = new Set<string>();
    fplStaffingData.forEach((m) => {
      if (m.Release) set.add(m.Release);
    });
    return Array.from(set).sort();
  }, []);

  const workstreams = useMemo(() => {
    const set = new Set<string>();
    fplStaffingData.forEach((m) => {
      if (m.Workstream) set.add(m.Workstream);
    });
    return Array.from(set).sort();
  }, []);

  const pods = useMemo(() => {
    const set = new Set<string>();
    fplStaffingData.forEach((m) => {
      if (m.Valuestream) set.add(m.Valuestream);
    });
    return Array.from(set).sort();
  }, []);

  const filteredData = useMemo(() => {
    return fplStaffingData.filter((member) => {
      const matchesSearch =
        searchTerm === "" ||
        member.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.Role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.Valuestream?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = filterRole === null || member.Role === filterRole;
      const matchesRelease = filterRelease === null || member.Release === filterRelease;
      const matchesWorkstream = filterWorkstream === null || member.Workstream === filterWorkstream;
      const matchesPod = filterPod === null || member.Valuestream === filterPod;

      return matchesSearch && matchesRole && matchesRelease && matchesWorkstream && matchesPod;
    });
  }, [searchTerm, filterRole, filterRelease, filterWorkstream, filterPod]);

  const activeFilters = [
    filterRole && { type: "Role", value: filterRole, clear: () => setFilterRole(null) },
    filterRelease && { type: "Release", value: filterRelease, clear: () => setFilterRelease(null) },
    filterWorkstream && { type: "Workstream", value: filterWorkstream, clear: () => setFilterWorkstream(null) },
    filterPod && { type: "POD", value: filterPod, clear: () => setFilterPod(null) },
  ].filter(Boolean) as { type: string; value: string; clear: () => void }[];

  const clearAllFilters = () => {
    setFilterRole(null);
    setFilterRelease(null);
    setFilterWorkstream(null);
    setFilterPod(null);
    setSearchTerm("");
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar Filters */}
      <div className="w-64 shrink-0 space-y-4">
        <Card className="bg-background/50 border-border/50 sticky top-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Filters</h3>
              {activeFilters.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background/50 h-9 text-sm"
              />
            </div>

            {/* Role Filter */}
            <div className="space-y-2">
              <button
                onClick={() => toggleFilter("role")}
                className="flex items-center justify-between w-full text-sm font-medium text-foreground"
              >
                Role
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expandedFilters.includes("role") ? "rotate-180" : ""
                  )}
                />
              </button>
              {expandedFilters.includes("role") && (
                <div className="space-y-1 pl-1">
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => setFilterRole(filterRole === role ? null : role)}
                      className={cn(
                        "block w-full text-left text-sm py-1 px-2 rounded transition-colors",
                        filterRole === role
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Release Filter */}
            <div className="space-y-2">
              <button
                onClick={() => toggleFilter("release")}
                className="flex items-center justify-between w-full text-sm font-medium text-foreground"
              >
                Release
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expandedFilters.includes("release") ? "rotate-180" : ""
                  )}
                />
              </button>
              {expandedFilters.includes("release") && (
                <div className="space-y-1 pl-1">
                  {releases.map((release) => (
                    <button
                      key={release}
                      onClick={() => setFilterRelease(filterRelease === release ? null : release)}
                      className={cn(
                        "block w-full text-left text-sm py-1 px-2 rounded transition-colors",
                        filterRelease === release
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {release}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Workstream Filter */}
            <div className="space-y-2">
              <button
                onClick={() => toggleFilter("workstream")}
                className="flex items-center justify-between w-full text-sm font-medium text-foreground"
              >
                Workstream
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expandedFilters.includes("workstream") ? "rotate-180" : ""
                  )}
                />
              </button>
              {expandedFilters.includes("workstream") && (
                <div className="space-y-1 pl-1">
                  {workstreams.map((workstream) => (
                    <button
                      key={workstream}
                      onClick={() => setFilterWorkstream(filterWorkstream === workstream ? null : workstream)}
                      className={cn(
                        "block w-full text-left text-sm py-1 px-2 rounded transition-colors",
                        filterWorkstream === workstream
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {workstream}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* POD Filter */}
            <div className="space-y-2">
              <button
                onClick={() => toggleFilter("pod")}
                className="flex items-center justify-between w-full text-sm font-medium text-foreground"
              >
                POD / Value Stream
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expandedFilters.includes("pod") ? "rotate-180" : ""
                  )}
                />
              </button>
              {expandedFilters.includes("pod") && (
                <div className="space-y-1 pl-1 max-h-48 overflow-y-auto">
                  {pods.map((pod) => (
                    <button
                      key={pod}
                      onClick={() => setFilterPod(filterPod === pod ? null : pod)}
                      className={cn(
                        "block w-full text-left text-sm py-1 px-2 rounded transition-colors",
                        filterPod === pod
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {pod}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - List View */}
      <div className="flex-1 space-y-4">
        {/* Active Filters & Results Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">
              {filteredData.length} of {fplStaffingData.length} members
            </span>
            {activeFilters.map((filter) => (
              <Badge
                key={`${filter.type}-${filter.value}`}
                variant="outline"
                className="bg-primary/10 text-primary border-primary/30 gap-1"
              >
                {filter.type}: {filter.value}
                <button onClick={filter.clear} className="ml-1 hover:text-primary/70">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* List Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border/50">
          <div className="col-span-3">Name</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Release</div>
          <div className="col-span-2">Workstream</div>
          <div className="col-span-3">POD / Value Stream</div>
        </div>

        {/* List Items */}
        <div className="space-y-1">
          {filteredData.map((member, idx) => (
            <div
              key={`${member.Email}-${idx}`}
              className="grid grid-cols-12 gap-4 px-4 py-3 rounded-lg bg-background/50 border border-border/30 hover:border-border/60 hover:bg-muted/30 transition-colors items-center"
            >
              {/* Name & Email */}
              <div className="col-span-3">
                <div className="font-medium text-foreground">{member.Name}</div>
                <a
                  href={`mailto:${member.Email}`}
                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  <Mail className="h-3 w-3" />
                  {member.Email}
                </a>
              </div>

              {/* Role */}
              <div className="col-span-2">
                {member.Role && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      roleColors[member.Role] || "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {member.Role}
                  </Badge>
                )}
              </div>

              {/* Release */}
              <div className="col-span-2">
                {member.Release && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      releaseColors[member.Release] || "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {member.Release}
                  </Badge>
                )}
              </div>

              {/* Workstream */}
              <div className="col-span-2">
                <span className="text-sm text-muted-foreground">{member.Workstream || "-"}</span>
              </div>

              {/* POD / Value Stream */}
              <div className="col-span-3">
                <span className="text-sm text-muted-foreground">{member.Valuestream || "-"}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No team members found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}
