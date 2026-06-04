const XLSX = require("xlsx");
const path = require("path");
const staffingData = require("../lib/fpl-staffing-data.json");

const workbook = XLSX.utils.book_new();

// Single sheet with all team members
const allMembersSheet = staffingData.map((member) => ({
  Name: member.Name,
  Email: member.Email || "",
  Designation: member.Designation || "",
  Role: member.Role,
  Workstream: member.Workstream || "",
  Release: member.Release || "",
  Valuestream: member.Valuestream || "",
  POD: member.POD || "",
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
console.log(`  Total members: ${staffingData.length}`);
console.log(`  FPL members: ${staffingData.filter((m) => m.isFPL).length}`);
