"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { fplStaffingData, FPLStaffMember } from "@/lib/fpl-staffing-types";
import { cn } from "@/lib/utils";
import { Search, Mail, Building, Users, Briefcase, Calendar } from "lucide-react";

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

export function DetailedTeamView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDesignation, setFilterDesignation] = useState<string | null>(null);
  const [filterRelease, setFilterRelease] = useState<string | null>(null);
  const [filterWorkstream, setFilterWorkstream] = useState<string | null>(null);

  const designations = useMemo(() => {
    const set = new Set<string>();
    fplStaffingData.forEach((m) => {
      if (m.Designation) set.add(m.Designation);
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

  const filteredData = useMemo(() => {
    return fplStaffingData.filter((member) => {
      const matchesSearch =
        searchTerm === "" ||
        member.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.Role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.Valuestream?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDesignation =
        filterDesignation === null || member.Designation === filterDesignation;

      const matchesRelease =
        filterRelease === null || member.Release === filterRelease;

      const matchesWorkstream =
        filterWorkstream === null || member.Workstream === filterWorkstream;

      return matchesSearch && matchesDesignation && matchesRelease && matchesWorkstream;
    });
  }, [searchTerm, filterDesignation, filterRelease, filterWorkstream]);

  const stats = useMemo(() => {
    const byDesignation: Record<string, number> = {};
    const byRelease: Record<string, number> = {};
    const byWorkstream: Record<string, number> = {};

    fplStaffingData.forEach((m) => {
      if (m.Designation) {
        byDesignation[m.Designation] = (byDesignation[m.Designation] || 0) + 1;
      }
      if (m.Release) {
        byRelease[m.Release] = (byRelease[m.Release] || 0) + 1;
      }
      if (m.Workstream) {
        byWorkstream[m.Workstream] = (byWorkstream[m.Workstream] || 0) + 1;
      }
    });

    return { byDesignation, byRelease, byWorkstream };
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-border/50">
        <CardHeader className="pb-2">
          <h2 className="text-lg font-semibold text-foreground">Team Overview</h2>
          <p className="text-sm text-muted-foreground">
            Detailed staffing information from FPL Staffing data
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">By Designation</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.byDesignation).map(([designation, count]) => (
                  <Badge
                    key={designation}
                    variant="outline"
                    className={cn(
                      "cursor-pointer transition-opacity",
                      designationColors[designation] || "bg-muted text-muted-foreground border-border",
                      filterDesignation === designation ? "opacity-100 ring-2 ring-primary" : "opacity-80 hover:opacity-100"
                    )}
                    onClick={() =>
                      setFilterDesignation(filterDesignation === designation ? null : designation)
                    }
                  >
                    {designation}: {count}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">By Release</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.byRelease).map(([release, count]) => (
                  <Badge
                    key={release}
                    variant="outline"
                    className={cn(
                      "cursor-pointer transition-opacity",
                      releaseColors[release] || "bg-muted text-muted-foreground border-border",
                      filterRelease === release ? "opacity-100 ring-2 ring-primary" : "opacity-80 hover:opacity-100"
                    )}
                    onClick={() =>
                      setFilterRelease(filterRelease === release ? null : release)
                    }
                  >
                    {release}: {count}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">By Workstream</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.byWorkstream).map(([workstream, count]) => (
                  <Badge
                    key={workstream}
                    variant="outline"
                    className={cn(
                      "cursor-pointer transition-opacity bg-muted/50 text-muted-foreground border-border",
                      filterWorkstream === workstream ? "opacity-100 ring-2 ring-primary" : "opacity-80 hover:opacity-100"
                    )}
                    onClick={() =>
                      setFilterWorkstream(filterWorkstream === workstream ? null : workstream)
                    }
                  >
                    {workstream}: {count}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, role, or value stream..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/50"
          />
        </div>
        {(filterDesignation || filterRelease || filterWorkstream) && (
          <button
            onClick={() => {
              setFilterDesignation(null);
              setFilterRelease(null);
              setFilterWorkstream(null);
            }}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted/50 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredData.length} of {fplStaffingData.length} team members
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((member, idx) => (
          <Card
            key={`${member.Email}-${idx}`}
            className="bg-gradient-to-br from-background to-muted/20 border-border/50 hover:border-border transition-colors"
          >
            <CardContent className="pt-4">
              <div className="space-y-3">
                {/* Name and Designation */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-foreground">{member.Name}</h3>
                    <Badge
                      variant="outline"
                      className={cn(
                        "mt-1 text-xs",
                        designationColors[member.Designation] ||
                          "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      {member.Designation}
                    </Badge>
                  </div>
                  {member.Release && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        releaseColors[member.Release] ||
                          "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      {member.Release}
                    </Badge>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <a
                      href={`mailto:${member.Email}`}
                      className="hover:text-foreground transition-colors truncate"
                    >
                      {member.Email}
                    </a>
                  </div>

                  {member.Role && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="h-3.5 w-3.5" />
                      <span>{member.Role}</span>
                    </div>
                  )}

                  {member.Workstream && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building className="h-3.5 w-3.5" />
                      <span>{member.Workstream}</span>
                    </div>
                  )}

                  {member.Valuestream && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span>{member.Valuestream}</span>
                    </div>
                  )}

                  {member["End Date"] && (
                    <div className="flex items-center gap-2 text-amber-400">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Contract ending</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
