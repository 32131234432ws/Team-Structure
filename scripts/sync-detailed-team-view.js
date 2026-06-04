const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Read the Detailed Team View Excel file
const excelPath = path.join(__dirname, "../public/Detailed Team View.xlsx");
const workbook = XLSX.readFile(excelPath);
const sheet = workbook.Sheets["Team Members"];
const excelData = XLSX.utils.sheet_to_json(sheet);

console.log(`Reading ${excelData.length} members from Excel...`);

// Transform Excel data to match our JSON structure
const syncedData = excelData.map((member) => ({
  Name: member.Name || "",
  Email: member.Email || "",
  Designation: member.Designation || "",
  Role: member.Role || "",
  Workstream: member.Workstream || "",
  Release: member.Release || "",
  Valuestream: member.Valuestream || "",
  POD: member.POD || "",
  isFPL: member["FPL Member"] === "Yes" || member.isFPL === true,
  "Planned End Date": member["Planned End Date"] || "",
}));

// Write to fpl-staffing-data.json
const outputPath = path.join(__dirname, "../lib/fpl-staffing-data.json");
fs.writeFileSync(outputPath, JSON.stringify(syncedData, null, 2));

console.log(`✓ Synced ${syncedData.length} members to fpl-staffing-data.json`);
console.log(`  FPL members: ${syncedData.filter((m) => m.isFPL).length}`);
console.log(`  PwC members: ${syncedData.filter((m) => !m.isFPL).length}`);

// Also update detailed-team-data.ts export
const detailedDataPath = path.join(__dirname, "../lib/detailed-team-data.ts");
let detailedContent = fs.readFileSync(detailedDataPath, "utf-8");

// Replace the detailedTeamMembers array
const dataExport = `export const detailedTeamMembers: DetailedTeamMember[] = ${JSON.stringify(
  syncedData,
  null,
  2
)};`;

// Find and replace the array
detailedContent = detailedContent.replace(
  /export const detailedTeamMembers:.*?\];/s,
  dataExport
);

fs.writeFileSync(detailedDataPath, detailedContent);
console.log(`✓ Updated detailed-team-data.ts`);

console.log("\n✅ Sync complete! The Detailed Team View in Vercel is now updated.");
