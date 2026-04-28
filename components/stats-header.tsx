import { devPods, crossFunctionalTeams, hypercarePods, sitUatExecutionTeam, leadershipTeam } from "@/lib/team-data";
import { Badge } from "@/components/ui/badge";

export function StatsHeader() {
  // Collect all members from all data sources
  const devPodMembers = devPods.flatMap((pod) => pod.team);
  const hypercarePodMembers = hypercarePods.flatMap((pod) => pod.team);
  const crossFunctionalMembers = crossFunctionalTeams.flatMap((team) => team.team);
  const sitUatMembers = sitUatExecutionTeam;
  const leadership = leadershipTeam;

  // Create a unified set of all unique active staff names
  const getAllUniqueActiveNames = () => {
    const uniqueNames = new Set<string>();

    // Add dev pod members
    devPodMembers
      .filter((m) => m.status === "Active" && m.name !== "TBD" && m.name !== "FPL")
      .forEach((m) => uniqueNames.add(m.name));

    // Add hypercare pod members
    hypercarePodMembers
      .filter((m) => m.status === "Active" && m.name !== "TBD" && m.name !== "FPL")
      .forEach((m) => uniqueNames.add(m.name));

    // Add cross-functional team members
    crossFunctionalMembers
      .filter((m) => m.status === "Active" && m.name !== "TBD" && m.name !== "FPL")
      .forEach((m) => uniqueNames.add(m.name));

    // Add SIT/UAT execution team members
    sitUatMembers
      .filter((m) => m.status === "Active" && m.name !== "TBD" && m.name !== "FPL")
      .forEach((m) => uniqueNames.add(m.name));

    // Add leadership team members
    leadership
      .filter((m) => m.status === "Active" && m.name !== "TBD" && m.name !== "FPL")
      .forEach((m) => uniqueNames.add(m.name));

    return uniqueNames;
  };

  // Get unique active members by role across ALL data sources
  const getUniqueActiveCountByRole = (role: string | string[]) => {
    const roles = Array.isArray(role) ? role : [role];
    const uniqueNames = new Set<string>();

    // Dev pod members
    devPodMembers
      .filter((m) => roles.includes(m.role) && m.status === "Active" && m.name !== "TBD" && m.name !== "FPL")
      .forEach((m) => uniqueNames.add(m.name));

    // Hypercare pod members
    hypercarePodMembers
      .filter((m) => roles.includes(m.role) && m.status === "Active" && m.name !== "TBD" && m.name !== "FPL")
      .forEach((m) => uniqueNames.add(m.name));

    // Cross-functional team members
    crossFunctionalMembers
      .filter((m) => roles.includes(m.role) && m.status === "Active" && m.name !== "TBD" && m.name !== "FPL")
      .forEach((m) => uniqueNames.add(m.name));

    // SIT/UAT execution team members
    sitUatMembers
      .filter((m) => roles.includes(m.role) && m.status === "Active" && m.name !== "TBD")
      .forEach((m) => uniqueNames.add(m.name));

    // Leadership team members
    leadership
      .filter((m) => roles.includes(m.role) && m.status === "Active" && m.name !== "TBD")
      .forEach((m) => uniqueNames.add(m.name));

    // Check for FPL in dev pods for these roles
    const hasFPL = devPodMembers.some((m) => m.name === "FPL" && roles.includes(m.role) && m.status === "Active");
    
    return uniqueNames.size + (hasFPL ? 1 : 0);
  };

  const totalByRole = {
    Lead: getUniqueActiveCountByRole("Lead"),
    "Onshore Solution Analyst": getUniqueActiveCountByRole("Onshore Solution Analyst"),
    "Offshore Solution Analyst": getUniqueActiveCountByRole("Offshore Solution Analyst"),
    Dev: getUniqueActiveCountByRole("Dev"),
    QA: getUniqueActiveCountByRole(["QA", "QA Lead"]),
    Team: getUniqueActiveCountByRole("Team"),
    Architect: getUniqueActiveCountByRole("Architect"),
    PMO: getUniqueActiveCountByRole("PMO"),
    Intern: getUniqueActiveCountByRole("Intern"),
  };

  // Total unique people across ALL data sources
  const allUniqueNames = getAllUniqueActiveNames();
  const hasFPL = devPodMembers.some((m) => m.name === "FPL" && m.status === "Active");
  const totalUniquePeople = allUniqueNames.size + (hasFPL ? 1 : 0);



  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm text-muted-foreground">Total Active Staff:</span>
        <Badge
          variant="outline"
          className="bg-primary/20 text-primary border-primary/30 text-base px-3 py-1"
        >
          {totalUniquePeople}
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm text-muted-foreground">By Role:</span>
        <div className="flex flex-wrap gap-2">
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
