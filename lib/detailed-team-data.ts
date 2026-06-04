import staffingData from "./fpl-staffing-data.json";
import { devPods, hypercarePods, crossFunctionalTeams, leadershipTeam, sitUatExecutionTeam, type TeamMember, type LeadershipMember } from "./team-data";

export interface DetailedTeamMember {
  Name: string;
  Email: string;
  Designation: string;
  Role: string;
  Workstream: string;
  Release: string;
  Valuestream: string;
  POD?: string;
  isFPL: boolean;
}

const baseStaffingData = staffingData as any[];

// Track all unique members by name (case-insensitive)
const membersMap = new Map<string, DetailedTeamMember>();

// Helper to normalize names for comparison
const normalizeName = (name: string) => name.toLowerCase().trim();

// Add base staffing data first
baseStaffingData.forEach((m) => {
  const key = normalizeName(m.Name);
  membersMap.set(key, {
    Name: m.Name,
    Email: m.Email || "",
    Designation: m.Designation || "Associate",
    Role: m.Role || "Dev",
    Workstream: m.Workstream || "Cross-Functional",
    Release: m.Release || "All",
    Valuestream: m.Valuestream || "",
    isFPL: m.isFPL || false,
  });
});

// Helper function to add/update team member
function addOrUpdateMember(
  name: string,
  role: string,
  release: string,
  valuestream: string,
  workstream: string,
  pod?: string,
  isFPL: boolean = false,
  designation: string = "Associate",
  email: string = ""
) {
  const key = normalizeName(name);
  
  const existing = membersMap.get(key);
  if (existing) {
    // Update with more specific info, but preserve email if not provided
    if (existing.isFPL) {
      // Already marked as FPL, keep it
      return;
    }
    if (isFPL) {
      existing.isFPL = true;
    }
    // Update other fields if more specific
    if (pod && !existing.POD) existing.POD = pod;
    if (role && role !== "Dev") existing.Role = role;
    if (valuestream && !existing.Valuestream) existing.Valuestream = valuestream;
    if (email && !existing.Email) existing.Email = email;
  } else {
    membersMap.set(key, {
      Name: name,
      Email: email,
      Designation: designation,
      Role: role,
      Workstream: workstream,
      Release: release,
      Valuestream: valuestream,
      POD: pod,
      isFPL,
    });
  }
}

// Process leadership team
leadershipTeam.forEach((m: LeadershipMember) => {
  let role = "Lead";
  let valuestream = "Leadership";
  if (m.role === "Architect") {
    role = m.subRole || "Architecture";
    valuestream = "Architecture";
  } else if (m.role === "PMO") {
    role = "PMO";
    valuestream = "Program Management";
  }
  addOrUpdateMember(
    m.name,
    role,
    "All",
    valuestream,
    "Leadership",
    undefined,
    m.isFPL || false,
    "Director"
  );
});

// Process dev pods and hypercare pods
[...devPods, ...hypercarePods].forEach((pod) => {
  pod.team.forEach((m: TeamMember) => {
    if (m.status !== "Active" || m.name === "TBD" || m.name === "FPL") return;
    
    const role = m.role || "Dev";
    const valuestream = m.valueStreams?.join(", ") || pod.name || "";
    
    addOrUpdateMember(
      m.name,
      role,
      pod.release || "All",
      valuestream,
      pod.name || "Dev",
      pod.name,
      m.isFPL || false,
      "Associate"
    );
  });
});

// Process cross-functional teams
crossFunctionalTeams.forEach((team) => {
  team.team.forEach((m: TeamMember) => {
    if (m.status !== "Active" || m.name === "TBD" || m.name === "FPL") return;
    
    const role = m.role || "Team";
    addOrUpdateMember(
      m.name,
      role,
      "All",
      team.name || "",
      team.name || "Cross-Functional",
      undefined,
      m.isFPL || false,
      "Associate"
    );
  });
});

// Process SIT/UAT execution team
sitUatExecutionTeam.forEach((m) => {
  if (m.status !== "Active") return;
  
  const isFPL = (m as any).isFPL || false;
  const valueStreams = (m as any).valueStreams;
  const valuestream = valueStreams?.join(", ") || "Testing/QA";
  
  addOrUpdateMember(
    m.name,
    m.role || "QA",
    "All",
    valuestream,
    "Testing/QA",
    "Testing/QA Team",
    isFPL,
    "Associate"
  );
});

// Convert map to sorted array
export const detailedTeamMembers: DetailedTeamMember[] = Array.from(membersMap.values())
  .sort((a, b) => {
    // Sort FPL first, then by role, then by name
    if (a.isFPL !== b.isFPL) {
      return a.isFPL ? -1 : 1;
    }
    if (a.Role !== b.Role) {
      return a.Role.localeCompare(b.Role);
    }
    return a.Name.localeCompare(b.Name);
  });

// Export summary statistics
export function getDetailedTeamStats() {
  const byRole = new Map<string, number>();
  const byFPL = { fpl: 0, pwc: 0 };
  
  detailedTeamMembers.forEach((m) => {
    byRole.set(m.Role, (byRole.get(m.Role) || 0) + 1);
    if (m.isFPL) byFPL.fpl++;
    else byFPL.pwc++;
  });
  
  return {
    total: detailedTeamMembers.length,
    byRole: Object.fromEntries(byRole),
    byFPL,
  };
}
