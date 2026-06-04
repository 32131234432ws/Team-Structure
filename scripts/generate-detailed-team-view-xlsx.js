const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const staffingData = require("../lib/fpl-staffing-data.json");

// Parse team-data.ts to extract all POD members
const teamDataFile = fs.readFileSync(path.join(__dirname, "../lib/team-data.ts"), "utf-8");

// Extract devPods, hypercarePods, crossFunctionalTeams, leadershipTeam, sitUatExecutionTeam
const allMembers = new Map(); // name -> member object

// Extract from staffing data first
staffingData.forEach((member) => {
  allMembers.set(member.Name, {
    Name: member.Name,
    Email: member.Email || "",
    Designation: member.Designation || "",
    Role: member.Role,
    Workstream: member.Workstream || "",
    Release: member.Release || "",
    Valuestream: member.Valuestream || "",
    POD: member.POD || "",
    isFPL: member.isFPL || false,
  });
});

// Parse team-data.ts to find all pod members
const podsMatch = teamDataFile.match(/export const devPods[\s\S]*?\];/);
const hypercareMatch = teamDataFile.match(/export const hypercarePods[\s\S]*?\];/);
const crossFunctionalMatch = teamDataFile.match(/export const crossFunctionalTeams[\s\S]*?\];/);
const leadershipMatch = teamDataFile.match(/export const leadershipTeam[\s\S]*?\];/);
const sitUatMatch = teamDataFile.match(/export const sitUatExecutionTeam[\s\S]*?\];/);

// Function to extract names and details from pod data
const extractMembersFromText = (text, releaseType = "IR4", valueStream = "", isLeadership = false) => {
  if (!text) return [];
  const members = [];
  
  // Match name, role, and isFPL flag
  const namePattern = /{ name: "([^"]+)", role: "([^"]+)", status: "([^"]+)"(?:, isFPL: (true|false))?/g;
  let match;
  
  while ((match = namePattern.exec(text)) !== null) {
    const [, name, role, status, isFPL] = match;
    if (status === "Active") {
      members.push({
        name,
        role,
        isFPL: isFPL === "true",
        release: releaseType,
        valueStream,
      });
    }
  }
  
  return members;
};

// Extract members from different pod arrays
if (podsMatch) {
  extractMembersFromText(podsMatch[0], "IR4").forEach((m) => {
    if (!allMembers.has(m.name)) {
      allMembers.set(m.name, {
        Name: m.name,
        Email: "",
        Designation: "",
        Role: m.role,
        Workstream: "",
        Release: m.release,
        Valuestream: m.valueStream,
        POD: "",
        isFPL: m.isFPL,
      });
    }
  });
}

if (hypercareMatch) {
  extractMembersFromText(hypercareMatch[0], "IR3.2", "Hypercare").forEach((m) => {
    if (!allMembers.has(m.name)) {
      allMembers.set(m.name, {
        Name: m.name,
        Email: "",
        Designation: "",
        Role: m.role,
        Workstream: "Hypercare",
        Release: m.release,
        Valuestream: m.valueStream,
        POD: "",
        isFPL: m.isFPL,
      });
    }
  });
}

if (crossFunctionalMatch) {
  extractMembersFromText(crossFunctionalMatch[0], "All", "Cross-Functional").forEach((m) => {
    if (!allMembers.has(m.name)) {
      allMembers.set(m.name, {
        Name: m.name,
        Email: "",
        Designation: "",
        Role: m.role,
        Workstream: "Cross-Functional",
        Release: m.release,
        Valuestream: m.valueStream,
        POD: "",
        isFPL: m.isFPL,
      });
    }
  });
}

const workbook = XLSX.utils.book_new();

// Single sheet with all team members
const allMembersSheet = Array.from(allMembers.values()).map((member) => ({
  Name: member.Name,
  Email: member.Email,
  Designation: member.Designation,
  Role: member.Role,
  Workstream: member.Workstream,
  Release: member.Release,
  Valuestream: member.Valuestream,
  POD: member.POD,
  "FPL Member": member.isFPL ? "Yes" : "No",
}));

const ws = XLSX.utils.json_to_sheet(allMembersSheet);
ws["!cols"] = [
  { wch: 25 },
  { wch: 30 },
  { wch: 18 },
  { wch: 20 },
  { wch: 20 },
  { wch: 12 },
  { wch: 25 },
  { wch: 20 },
  { wch: 12 },
];
XLSX.utils.book_append_sheet(workbook, ws, "Team Members");

// Write to file
const filePath = path.join(__dirname, "../public/Detailed Team View.xlsx");
XLSX.writeFile(workbook, filePath);
console.log(`✓ Detailed Team View.xlsx generated at ${filePath}`);
console.log(`  Total members: ${allMembers.size}`);
console.log(`  FPL members: ${Array.from(allMembers.values()).filter((m) => m.isFPL).length}`);
