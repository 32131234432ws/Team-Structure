import { devPods, hypercarePods, crossFunctionalTeams, leadershipTeam, sitUatExecutionTeam, type TeamMember } from "@/lib/team-data";
import { Badge } from "@/components/ui/badge";
import fplStaffingData from "@/lib/fpl-staffing-data.json";

type RoleBucket = TeamMember["role"] | "Architect";

type PersonInfo = {
  role: RoleBucket;
  isFPL: boolean;
};

export function StatsHeader() {
  // Build a deduplicated map of all team members from team-data.ts (source of truth)
  // Key: name, Value: { role bucket, isFPL flag }
  const peopleMap = new Map<string, PersonInfo>();

  // 1. Add all dev pod and hypercare pod members (excluding TBD/FPL placeholders)
  [...devPods, ...hypercarePods].forEach((pod) => {
    pod.team.forEach((m) => {
      if (m.name && m.name !== "TBD" && m.name !== "FPL" && m.status === "Active") {
        if (!peopleMap.has(m.name)) {
          peopleMap.set(m.name, { role: m.role, isFPL: !!m.isFPL });
        } else if (m.isFPL) {
          // Upgrade isFPL flag if found in any pod
          const existing = peopleMap.get(m.name)!;
          peopleMap.set(m.name, { ...existing, isFPL: true });
        }
      }
    });
  });

  // 2. Add cross-functional team members
  crossFunctionalTeams.forEach((team) => {
    team.team.forEach((m) => {
      if (m.name && m.name !== "TBD" && m.status === "Active") {
        if (!peopleMap.has(m.name)) {
          peopleMap.set(m.name, { role: m.role, isFPL: !!m.isFPL });
        } else if (m.isFPL) {
          const existing = peopleMap.get(m.name)!;
          peopleMap.set(m.name, { ...existing, isFPL: true });
        }
      }
    });
  });

  // 3. Add SIT/UAT execution (Testing/QA) team members
  sitUatExecutionTeam.forEach((m) => {
    if (m.name && m.name !== "TBD" && m.status === "Active") {
      if (!peopleMap.has(m.name)) {
        peopleMap.set(m.name, { role: m.role, isFPL: !!m.isFPL });
      } else if (m.isFPL) {
        const existing = peopleMap.get(m.name)!;
        peopleMap.set(m.name, { ...existing, isFPL: true });
      }
    }
  });

  // 4. Add leadership members
  leadershipTeam.forEach((m) => {
    if (m.name && m.status === "Active") {
      const role: RoleBucket = m.role === "Architect" ? "Architect" : (m.role as RoleBucket);
      if (!peopleMap.has(m.name)) {
        peopleMap.set(m.name, { role, isFPL: !!m.isFPL });
      } else if (m.isFPL) {
        const existing = peopleMap.get(m.name)!;
        peopleMap.set(m.name, { ...existing, isFPL: true });
      }
    }
  });

  // 5. Backfill from FPL Staffing JSON for anyone we missed (architects, additional staff)
  const fplData = fplStaffingData as Array<{
    Name: string;
    Role: string;
  }>;

  const fplRoleToBucket = (role: string): RoleBucket | null => {
    if (["Engagement Lead", "Dev Lead", "Integration Lead", "DevOps Lead", "QA Lead"].includes(role)) return "Lead";
    if (role === "Onshore SA") return "Onshore Solution Analyst";
    if (role === "Offshore SA") return "Offshore Solution Analyst";
    if (role === "Dev") return "Dev";
    if (role === "QA") return "QA";
    if (["Integration Dev", "DevOps", "Windsurf/Performance Dev"].includes(role)) return "Team";
    if (["Technical Architect", "Solution Architect", "Business Architect"].includes(role)) return "Architect";
    if (role === "PMO") return "PMO";
    if (role === "Intern") return "Intern";
    return null;
  };

  // Only count active POD members (no backfill from JSON)
  // All POD members are now synced to JSON, so we only need POD data
  // fplData.forEach((m) => {
  //   if (m.Name && m.Name !== "TBD" && !peopleMap.has(m.Name)) {
  //     const bucket = fplRoleToBucket(m.Role);
  //     if (bucket) {
  //       peopleMap.set(m.Name, { role: bucket, isFPL: false });
  //     }
  //   }
  // });

  const totalUniquePeople = peopleMap.size;

  // Tally by bucket, split by FPL vs non-FPL
  type CountKey = "Lead" | "Scrum Master" | "Onshore Solution Analyst" | "Offshore Solution Analyst" | "Dev" | "QA" | "Team" | "Architect" | "PMO" | "Intern";

  const counts: Record<CountKey, number> = {
    Lead: 0,
    "Scrum Master": 0,
    "Onshore Solution Analyst": 0,
    "Offshore Solution Analyst": 0,
    Dev: 0,
    QA: 0,
    Team: 0,
    Architect: 0,
    PMO: 0,
    Intern: 0,
  };

  const fplCounts: Record<CountKey, number> = {
    Lead: 0,
    "Scrum Master": 0,
    "Onshore Solution Analyst": 0,
    "Offshore Solution Analyst": 0,
    Dev: 0,
    QA: 0,
    Team: 0,
    Architect: 0,
    PMO: 0,
    Intern: 0,
  };

  peopleMap.forEach(({ role, isFPL }) => {
    let key: CountKey | null = null;
    if (role === "Lead" || role === "Program Lead" || role === "QA Lead") key = "Lead";
    else if (role === "Scrum Master") key = "Scrum Master";
    else if (role === "Onshore Solution Analyst") key = "Onshore Solution Analyst";
    else if (role === "Offshore Solution Analyst") key = "Offshore Solution Analyst";
    else if (role === "Dev") key = "Dev";
    else if (role === "QA") key = "QA";
    else if (role === "Team") key = "Team";
    else if (role === "Architect" || role === "Architecture") key = "Architect";
    else if (role === "PMO") key = "PMO";
    else if (role === "Intern") key = "Intern";

    if (key) {
      if (isFPL) {
        fplCounts[key]++;
      } else {
        counts[key]++;
      }
    }
  });

  const fplBadgeClass = "bg-blue-500/15 text-blue-300 border-blue-500/40";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">Total Active Staff:</span>
        <Badge
          variant="outline"
          className="bg-primary/20 text-primary border-primary/30 text-base px-3 py-1"
        >
          {totalUniquePeople}
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground whitespace-nowrap">By Role:</span>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            {counts.Lead} Leads
          </Badge>
          {fplCounts.Lead > 0 && (
            <Badge variant="outline" className={fplBadgeClass}>
              {fplCounts.Lead} FPL - Leads
            </Badge>
          )}
          {counts["Scrum Master"] > 0 && (
            <Badge variant="outline" className="bg-teal-500/20 text-teal-400 border-teal-500/30">
              {counts["Scrum Master"]} Scrum Masters
            </Badge>
          )}
          {fplCounts["Scrum Master"] > 0 && (
            <Badge variant="outline" className={fplBadgeClass}>
              {fplCounts["Scrum Master"]} FPL - Scrum Masters
            </Badge>
          )}
          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            {counts["Onshore Solution Analyst"]} Onshore SA
          </Badge>
          {fplCounts["Onshore Solution Analyst"] > 0 && (
            <Badge variant="outline" className={fplBadgeClass}>
              {fplCounts["Onshore Solution Analyst"]} FPL - Onshore SA
            </Badge>
          )}
          <Badge variant="outline" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
            {counts["Offshore Solution Analyst"]} Offshore SA
          </Badge>
          {fplCounts["Offshore Solution Analyst"] > 0 && (
            <Badge variant="outline" className={fplBadgeClass}>
              {fplCounts["Offshore Solution Analyst"]} FPL - Offshore SA
            </Badge>
          )}
          <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            {counts.Dev} Devs
          </Badge>
          {fplCounts.Dev > 0 && (
            <Badge variant="outline" className={fplBadgeClass}>
              {fplCounts.Dev} FPL - Devs
            </Badge>
          )}
          <Badge variant="outline" className="bg-rose-500/20 text-rose-400 border-rose-500/30">
            {counts.QA} QAs
          </Badge>
          {fplCounts.QA > 0 && (
            <Badge variant="outline" className={fplBadgeClass}>
              {fplCounts.QA} FPL - QAs
            </Badge>
          )}
          <Badge variant="outline" className="bg-violet-500/20 text-violet-400 border-violet-500/30">
            {counts.Team} Cross Functional
          </Badge>
          {fplCounts.Team > 0 && (
            <Badge variant="outline" className={fplBadgeClass}>
              {fplCounts.Team} FPL - Cross Functional
            </Badge>
          )}
          <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
            {counts.Architect} Architects
          </Badge>
          {fplCounts.Architect > 0 && (
            <Badge variant="outline" className={fplBadgeClass}>
              {fplCounts.Architect} FPL - Architects
            </Badge>
          )}
          <Badge variant="outline" className="bg-pink-500/20 text-pink-400 border-pink-500/30">
            {counts.PMO} PMO
          </Badge>
          {fplCounts.PMO > 0 && (
            <Badge variant="outline" className={fplBadgeClass}>
              {fplCounts.PMO} FPL - PMO
            </Badge>
          )}
          <Badge variant="outline" className="bg-lime-500/20 text-lime-400 border-lime-500/30">
            {counts.Intern} Interns
          </Badge>
          {fplCounts.Intern > 0 && (
            <Badge variant="outline" className={fplBadgeClass}>
              {fplCounts.Intern} FPL - Interns
            </Badge>
          )}
        </div>
      </div>

      {/* Separator line */}
      <div className="h-px w-full bg-white/30 mt-4" />
    </div>
  );
}
