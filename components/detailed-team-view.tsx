"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { fplStaffingData } from "@/lib/fpl-staffing-types";
import { cn } from "@/lib/utils";
import { Search, ChevronDown, X } from "lucide-react";

const roleColors: Record<string, string> = {
  "Engagement Lead": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Dev Lead": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Integration Lead": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "DevOps Lead": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  "QA Lead": "bg-red-500/20 text-red-400 border-red-500/30",
  "Technical Architect": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Solution Architect": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Business Architect": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  PMO: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Onshore SA": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Offshore SA": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Dev: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  QA: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  DevOps: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  "Integration Dev": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Windsurf/Performance Dev": "bg-lime-500/20 text-lime-400 border-lime-500/30",
};

const releaseColors: Record<string, string> = {
  "IR3.2": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "IR3.X": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "IR3.2/IR4": "bg-teal-500/20 text-teal-400 border-teal-500/30",
  "IR3.X/IR4": "bg-teal-500/20 text-teal-400 border-teal-500/30",
  IR4: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  All: "bg-violet-500/20 text-violet-400 border-violet-500/30",
};

function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (val: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1 text-xs font-medium uppercase tracking-wider transition-colors",
          value ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {label}
        {value && <span className="text-primary">: {value}</span>}
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-background border border-border rounded-md shadow-lg min-w-[140px] max-h-[200px] overflow-y-auto">
          <button
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className={cn(
              "block w-full text-left px-3 py-1.5 text-sm transition-colors",
              value === null ? "bg-primary/10 text-primary" : "hover:bg-muted"
            )}
          >
            All
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={cn(
                "block w-full text-left px-3 py-1.5 text-sm transition-colors",
                value === opt ? "bg-primary/10 text-primary" : "hover:bg-muted"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function DetailedTeamView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterRelease, setFilterRelease] = useState<string | null>(null);
  const [filterWorkstream, setFilterWorkstream] = useState<string | null>(null);
  const [filterPod, setFilterPod] = useState<string | null>(null);

  const roles = useMemo(() => {
    const set = new Set<string>();
    fplStaffingData.forEach((m) => m.Role && set.add(m.Role));
    return Array.from(set).sort();
  }, []);

  const releases = useMemo(() => {
    const set = new Set<string>();
    fplStaffingData.forEach((m) => m.Release && set.add(m.Release));
    return Array.from(set).sort();
  }, []);

  const workstreams = useMemo(() => {
    const set = new Set<string>();
    fplStaffingData.forEach((m) => m.Workstream && set.add(m.Workstream));
    return Array.from(set).sort();
  }, []);

  const pods = useMemo(() => {
    const set = new Set<string>();
    fplStaffingData.forEach((m) => m.Valuestream && set.add(m.Valuestream));
    return Array.from(set).sort();
  }, []);

  const filteredData = useMemo(() => {
    return fplStaffingData.filter((member) => {
      const matchesSearch =
        searchTerm === "" ||
        member.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.Email && member.Email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = !filterRole || member.Role === filterRole;
      const matchesRelease = !filterRelease || member.Release === filterRelease;
      const matchesWorkstream = !filterWorkstream || member.Workstream === filterWorkstream;
      const matchesPod = !filterPod || member.Valuestream === filterPod;
      return matchesSearch && matchesRole && matchesRelease && matchesWorkstream && matchesPod;
    });
  }, [searchTerm, filterRole, filterRelease, filterWorkstream, filterPod]);

  const hasFilters = filterRole || filterRelease || filterWorkstream || filterPod || searchTerm;

  const clearAllFilters = () => {
    setFilterRole(null);
    setFilterRelease(null);
    setFilterWorkstream(null);
    setFilterPod(null);
    setSearchTerm("");
  };

  return (
    <div className="space-y-3">
      {/* Search & Active Filters Row */}
      <div className="flex items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-sm bg-background/50"
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {filteredData.length} of {fplStaffingData.length}
        </span>
        {hasFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="border border-border/50 rounded-lg overflow-hidden">
        {/* Header Row with Filters */}
        <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-muted/30 border-b border-border/50">
          <div className="col-span-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Name
          </div>
          <div className="col-span-2">
            <FilterDropdown
              label="Role"
              options={roles}
              value={filterRole}
              onChange={setFilterRole}
            />
          </div>
          <div className="col-span-2">
            <FilterDropdown
              label="Release"
              options={releases}
              value={filterRelease}
              onChange={setFilterRelease}
            />
          </div>
          <div className="col-span-2">
            <FilterDropdown
              label="Workstream"
              options={workstreams}
              value={filterWorkstream}
              onChange={setFilterWorkstream}
            />
          </div>
          <div className="col-span-3">
            <FilterDropdown
              label="POD"
              options={pods}
              value={filterPod}
              onChange={setFilterPod}
            />
          </div>
        </div>

        {/* Data Rows */}
        <div className="divide-y divide-border/30">
          {filteredData.map((member, idx) => (
            <div
              key={`${member.Email}-${idx}`}
              className="grid grid-cols-12 gap-2 px-3 py-2 hover:bg-muted/20 transition-colors items-center"
            >
              <div className="col-span-3">
                <div className="text-sm font-medium text-foreground leading-tight">{member.Name}</div>
                {member.Email && (
                  <div className="text-xs text-muted-foreground truncate">{member.Email}</div>
                )}
              </div>
              <div className="col-span-2">
                {member.Role && (
                  <Badge
                    variant="outline"
                    className={cn("text-xs py-0", roleColors[member.Role] || "bg-muted text-muted-foreground")}
                  >
                    {member.Role}
                  </Badge>
                )}
              </div>
              <div className="col-span-2">
                {member.Release && (
                  <Badge
                    variant="outline"
                    className={cn("text-xs py-0", releaseColors[member.Release] || "bg-muted text-muted-foreground")}
                  >
                    {member.Release}
                  </Badge>
                )}
              </div>
              <div className="col-span-2">
                <span className="text-sm text-muted-foreground">{member.Workstream || "-"}</span>
              </div>
              <div className="col-span-3">
                <span className="text-sm text-muted-foreground truncate block">{member.Valuestream || "-"}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No team members found.
          </div>
        )}
      </div>
    </div>
  );
}
