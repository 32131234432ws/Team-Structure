import staffingData from "./fpl-staffing-data.json";
import { devPods, hypercarePods, crossFunctionalTeams, leadershipTeam, sitUatExecutionTeam, type TeamMember, type LeadershipMember } from "./team-data";

export interface FPLStaffMember {
  Name: string;
  Email?: string;
  Designation: string;
  Role: string;
  Workstream: string;
  Release: string;
  Valuestream: string;
  EndDate?: number | null;
  isFPL?: boolean;
}

const baseStaffingData: FPLStaffMember[] = staffingData as FPLStaffMember[];

// Mapping from team-data role -> Detailed view role for consistency
const roleMap: Record<string, string> = {
  Lead: "Dev Lead",
  "Scrum Master": "Scrum Master",
  "Onshore Solution Analyst": "Onshore SA",
  "Offshore Solution Analyst": "Offshore SA",
  Dev: "Dev",
  QA: "QA",
  Team: "Team",
  "QA Lead": "QA Lead",
  "Program Lead": "Program Lead",
  Architecture: "Architecture",
  PMO: "PMO",
  Intern: "Intern",
};

// Helper to derive release from pod release tag
function inferRelease(release?: string): string {
  if (!release) return "All";
  return release;
}

// Collect unique FPL members from team-data
const fplMembersFromTeamData: FPLStaffMember[] = [];
const seenNames = new Set<string>();

// Track existing names in baseStaffingData for de-duplication
const baseStaffingNames = new Set(baseStaffingData.map((m) => m.Name.toLowerCase().trim()));

function addFPLMember(
  name: string,
  role: string,
  release: string,
  valuestream: string,
  workstream: string,
  designation: string = "Associate"
) {
  const key = name.toLowerCase().trim();
  if (seenNames.has(key)) return;
  seenNames.add(key);

  // If they're already in base data, mark that entry as FPL instead of creating a duplicate
  if (baseStaffingNames.has(key)) {
    const existing = baseStaffingData.find((m) => m.Name.toLowerCase().trim() === key);
    if (existing) existing.isFPL = true;
    return;
  }

  fplMembersFromTeamData.push({
    Name: name,
    Email: "",
    Designation: designation,
    Role: role,
    Workstream: workstream,
    Release: release,
    Valuestream: valuestream,
    isFPL: true,
  });
}

// Process leadership FPL members
leadershipTeam.forEach((m: LeadershipMember) => {
  if (!m.isFPL) return;
  let role = "Lead";
  let valuestream = "Leadership";
  if (m.role === "Architect") {
    role = m.subRole || "Architecture";
    valuestream = "Architecture";
  } else if (m.role === "PMO") {
    role = "PMO";
    valuestream = "Program Management";
  } else if (m.role === "Lead") {
    role = "Engagement Lead";
    valuestream = "Leadership";
  }
  addFPLMember(m.name, role, "All", valuestream, "Leadership", "Director");
});

// Process pods (dev pods + hypercare pods)
[...devPods, ...hypercarePods].forEach((pod) => {
  pod.team.forEach((m: TeamMember) => {
    if (!m.isFPL || m.status !== "Active" || m.name === "TBD" || m.name === "FPL") return;
    const role = roleMap[m.role] || m.role;
    const valuestream = m.valueStreams?.join(", ") || pod.name;
    addFPLMember(m.name, role, pod.release, valuestream, pod.name, "Associate");
  });
});

// Process cross-functional teams
crossFunctionalTeams.forEach((team) => {
  team.team.forEach((m: TeamMember) => {
    if (!m.isFPL || m.status !== "Active" || m.name === "TBD" || m.name === "FPL") return;
    const role = roleMap[m.role] || m.role;
    addFPLMember(m.name, role, "All", team.name, team.name, "Associate");
  });
});

// Process SIT/UAT execution team
sitUatExecutionTeam.forEach((m) => {
  if (!(m as any).isFPL || m.status !== "Active") return;
  addFPLMember(m.name, "QA", "All", "SIT/UAT", "Testing", "Associate");
});

export const fplStaffingData: FPLStaffMember[] = [...baseStaffingData, ...fplMembersFromTeamData];
