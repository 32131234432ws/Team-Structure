import { crossFunctionalTeams } from "@/lib/team-data";
import { Badge } from "@/components/ui/badge";
import fplStaffingData from "@/lib/fpl-staffing-data.json";

export function StatsHeader() {
  // Use FPL Staffing data as the source of truth for counts
  const staffData = fplStaffingData as Array<{
    Name: string;
    Role: string;
    Workstream: string;
    Release: string;
  }>;

  // Count unique active staff from FPL Staffing (excluding TBD)
  const uniqueStaff = new Set(staffData.filter(m => m.Name && m.Name !== "TBD").map(m => m.Name));
  
  // Also count interns from team-data (they're not in FPL staffing)
  const crossFunctionalMembers = crossFunctionalTeams.flatMap((team) => team.team);
  const interns = crossFunctionalMembers.filter(m => m.role === "Intern" && m.status === "Active");
  interns.forEach(intern => uniqueStaff.add(intern.name));
  
  const totalUniquePeople = uniqueStaff.size;

  // Count by role from FPL Staffing data
  const countByRole = (roles: string[]) => {
    const names = new Set(
      staffData
        .filter(m => m.Name && m.Name !== "TBD" && roles.some(r => m.Role?.includes(r)))
        .map(m => m.Name)
    );
    return names.size;
  };

  const totalByRole = {
    Lead: countByRole(["Engagement Lead", "Dev Lead", "Integration Lead", "DevOps Lead"]),
    "Onshore Solution Analyst": countByRole(["Onshore SA"]),
    "Offshore Solution Analyst": countByRole(["Offshore SA"]),
    Dev: countByRole(["Dev"]) - countByRole(["Dev Lead", "DevOps"]), // Exclude leads and devops
    QA: countByRole(["QA"]),
    Team: countByRole(["Integration Dev", "DevOps", "Windsurf/Performance Dev"]),
    Architect: countByRole(["Architect"]),
    PMO: countByRole(["PMO"]),
    Intern: interns.length,
  };



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
          <Badge
            variant="outline"
            className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
          >
            {totalByRole.Lead} Leads
          </Badge>
          <Badge
            variant="outline"
            className="bg-blue-500/20 text-blue-400 border-blue-500/30"
          >
            {totalByRole["Onshore Solution Analyst"]} Onshore SA
          </Badge>
          <Badge
            variant="outline"
            className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
          >
            {totalByRole["Offshore Solution Analyst"]} Offshore SA
          </Badge>
          <Badge
            variant="outline"
            className="bg-amber-500/20 text-amber-400 border-amber-500/30"
          >
            {totalByRole.Dev} Devs
          </Badge>
          <Badge
            variant="outline"
            className="bg-rose-500/20 text-rose-400 border-rose-500/30"
          >
            {totalByRole.QA} QAs
          </Badge>
          <Badge
            variant="outline"
            className="bg-violet-500/20 text-violet-400 border-violet-500/30"
          >
            {totalByRole.Team} Cross Functional
          </Badge>
          <Badge
            variant="outline"
            className="bg-orange-500/20 text-orange-400 border-orange-500/30"
          >
            {totalByRole.Architect} Architects
          </Badge>
          <Badge
            variant="outline"
            className="bg-pink-500/20 text-pink-400 border-pink-500/30"
          >
            {totalByRole.PMO} PMO
          </Badge>
          <Badge
            variant="outline"
            className="bg-lime-500/20 text-lime-400 border-lime-500/30"
          >
            {totalByRole.Intern} Interns
          </Badge>
        </div>
      </div>
    </div>
  );
}
