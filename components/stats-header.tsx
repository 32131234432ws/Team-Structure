import { devPods } from "@/lib/team-data";
import { Badge } from "@/components/ui/badge";

export function StatsHeader() {
  // Get all team members across all pods
  const allMembers = devPods.flatMap((pod) => pod.team);

  // Normalize names to handle variations - people appearing in multiple pods
  const normalizeName = (name: string) => {
    const nameMap: Record<string, string> = {
      "Sneha Girigoudar": "Sneha",
      "Michael O'shea": "Michael",
      "Suraj Ghodmare": "Suraj",
      "Aditya Talwar": "Aditya",
      "Gianna Caruso": "Gianna",
      "Shreya LNU": "Shreya",
      "Rinky Chawla": "Rinky",
      "Deneys Van Der Merwe": "Deneys",
      "Cicily Deng": "Cicily",
      "Jitain Mohun": "Jitain",
      "Mayur Kinhekar": "Mayur",
      "Mounika Depuri": "Mounika",
    };
    return nameMap[name] || name;
  };

  // Get unique active members only (excluding TBD) by role
  const getUniqueActiveCountByRole = (role: string) => {
    const members = allMembers.filter(
      (m) => m.role === role && m.status === "Active"
    );
    const uniqueNames = new Set(
      members
        .map((m) => normalizeName(m.name))
        .filter((name) => name !== "TBD" && name !== "FPL")
    );
    const fplCount = members.some((m) => m.name === "FPL") ? 1 : 0;
    return uniqueNames.size + fplCount;
  };

  const totalByRole = {
    Lead: getUniqueActiveCountByRole("Lead"),
    "Onshore Solution Analyst": getUniqueActiveCountByRole("Onshore Solution Analyst"),
    "Offshore Solution Analyst": getUniqueActiveCountByRole("Offshore Solution Analyst"),
    Dev: getUniqueActiveCountByRole("Dev"),
    QA: getUniqueActiveCountByRole("QA"),
  };

  // Total unique people across ALL roles (a person can have multiple roles)
  const totalUniquePeople = new Set(
    allMembers
      .filter((m) => m.status === "Active" && m.name !== "TBD" && m.name !== "FPL")
      .map((m) => normalizeName(m.name))
  ).size + (allMembers.some((m) => m.name === "FPL" && m.status === "Active") ? 1 : 0);

  // Count total TBD (open positions)
  const totalTBD = allMembers.filter((m) => m.name === "TBD").length;

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
            className="bg-muted text-muted-foreground border-border"
          >
            {totalTBD} TBD/Open
          </Badge>
        </div>
      </div>
    </div>
  );
}
