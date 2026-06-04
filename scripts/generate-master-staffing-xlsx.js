const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const staffingData = require("../lib/fpl-staffing-data.json");

const workbook = XLSX.utils.book_new();

// Sort by FPL first, then by Name
const sortedData = [...staffingData].sort((a, b) => {
  if (a.isFPL !== b.isFPL) return b.isFPL - a.isFPL;
  return a.Name.localeCompare(b.Name);
});

// Sheet 1: Master Data
const masterSheet = sortedData.map((member) => ({
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

const ws = XLSX.utils.json_to_sheet(masterSheet);
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

// Freeze the header row
ws["!freeze"] = { xSplit: 0, ySplit: 1 };

XLSX.utils.book_append_sheet(workbook, ws, "Master Data");

// Sheet 2: Instructions
const instructions = [
  { Section: "INSTRUCTIONS", Details: "" },
  { Section: "", Details: "" },
  { Section: "How to use this file:", Details: "" },
  { Section: "1. Edit the 'Master Data' tab with all team member information", Details: "" },
  { Section: "2. Save the file", Details: "" },
  { Section: "3. Run: npm run sync-staffing", Details: "" },
  { Section: "", Details: "" },
  { Section: "Required Columns:", Details: "" },
  { Section: "- Name", Details: "Team member full name (unique)" },
  { Section: "- Email", Details: "Email address" },
  { Section: "- Designation", Details: "Job title/designation" },
  { Section: "- Role", Details: "Dev, QA, Lead, SA, DevOps, etc." },
  { Section: "- Workstream", Details: "IR3.2, IR4, Cross-Functional, etc." },
  { Section: "- Release", Details: "IR3.2, IR4, All, etc." },
  { Section: "- Valuestream", Details: "Billing, Energy, Correspondence, etc." },
  { Section: "- POD", Details: "POD name" },
  { Section: "- FPL Member", Details: "Yes/No" },
  { Section: "", Details: "" },
  { Section: "Role Options:", Details: "Dev, QA, Lead, Onshore SA, Offshore SA, DevOps, Scrum Master, PMO, Architect, Intern, etc." },
  { Section: "Release Options:", Details: "IR3.2, IR4, All" },
];

const instructionsWs = XLSX.utils.json_to_sheet(instructions);
instructionsWs["!cols"] = [{ wch: 30 }, { wch: 50 }];
XLSX.utils.book_append_sheet(workbook, instructionsWs, "Instructions");

// Write to file
const filePath = path.join(__dirname, "../public/FPL Staffing Master.xlsx");
XLSX.writeFile(workbook, filePath);
console.log(`✓ FPL Staffing Master.xlsx generated at ${filePath}`);
console.log(`  Total members: ${sortedData.length}`);
console.log(`  FPL members: ${sortedData.filter((m) => m.isFPL).length}`);
console.log(`\n  This is the SOURCE file - Update this file and run 'npm run sync-staffing' to update the backend`);
