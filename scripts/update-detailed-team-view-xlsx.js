const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

// Load team data - parse the TypeScript file
const teamDataContent = fs.readFileSync(path.join(__dirname, "../lib/team-data.ts"), "utf-8");
const staffingData = require("../lib/fpl-staffing-data.json");

const allMembers = new Map(); // name -> member

// First, add all staffing data
staffingData.forEach((member) => {
  allMembers.set(member.Name, {
    Name: member.Name,
    Email: member.Email || "",
    Designation: member.Designation || "",
    Role: member.Role || "",
    Workstream: member.Workstream || "",
    Release: member.Release || "",
    Valuestream: member.Valuestream || "",
    POD: member.POD || "",
    isFPL: member.isFPL || false,
  });
});

// Parse team-data.ts to extract all POD members
// Match patterns like: { name: "X", role: "Y", status: "Active", isFPL: true }

const nameRolePattern = /{\s*name:\s*"([^"]+)",\s*role:\s*"([^"]+)",\s*status:\s*"([^"]+)"[^}]*(?:isFPL:\s*(true|false))?[^}]*}/g;

let match;
while ((match = nameRolePattern.exec(teamDataContent)) !== null) {
  const [, name, role, status, isFPL] = match;
  
  if (status === "Active" && name && name !== "TBD" && name !== "FPL") {
    if (!allMembers.has(name)) {
      // Add new member found in PODs but not in staffing data
      allMembers.set(name, {
        Name: name,
        Email: "",
        Designation: "",
        Role: role,
        Workstream: "",
        Release: "",
        Valuestream: "",
        POD: "",
        isFPL: isFPL === "true",
      });
    } else {
      // Update existing member to mark as FPL if found in team-data
      const existing = allMembers.get(name);
      if (isFPL === "true") {
        existing.isFPL = true;
      }
      if (!existing.Role) {
        existing.Role = role;
      }
    }
  }
}

// Create Excel workbook
const workbook = XLSX.utils.book_new();

// Sort members: FPL first, then by name
const sortedMembers = Array.from(allMembers.values()).sort((a, b) => {
  if (a.isFPL !== b.isFPL) {
    return b.isFPL ? 1 : -1; // FPL members first
  }
  return a.Name.localeCompare(b.Name);
});

// Create sheet data
const sheetData = sortedMembers.map((member) => ({
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

// Create sheet
const ws = XLSX.utils.json_to_sheet(sheetData);
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

console.log(`✓ Detailed Team View.xlsx updated at ${filePath}`);
console.log(`  Total members: ${allMembers.size}`);
console.log(`  FPL members: ${sortedMembers.filter((m) => m.isFPL).length}`);
console.log(`  PwC members: ${sortedMembers.filter((m) => !m.isFPL).length}`);
