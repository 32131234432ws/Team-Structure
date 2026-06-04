const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

// Read the Excel file
const excelPath = path.join(__dirname, "../public/Detailed Team View.xlsx");
const workbook = XLSX.readFile(excelPath);
const sheet = workbook.Sheets["Team Members"];
const excelData = XLSX.utils.sheet_to_json(sheet);

console.log(`[v0] Reading Excel: ${excelData.length} members found`);

// Transform Excel data to JSON format with Planned End Date column
const staffingData = excelData.map((row) => ({
  Name: row.Name || "",
  Email: row.Email || "",
  Designation: row.Designation || "",
  Role: row.Role || "",
  Workstream: row.Workstream || "",
  Release: row.Release || "",
  Valuestream: row.Valuestream || "",
  POD: row.POD || "",
  isFPL: row["FPL Member"] === "Yes",
  "Planned End Date": row["Planned End Date"] || "",
}));

// Write to fpl-staffing-data.json
const outputPath = path.join(__dirname, "../lib/fpl-staffing-data.json");
fs.writeFileSync(outputPath, JSON.stringify(staffingData, null, 2));

console.log(`✓ Updated fpl-staffing-data.json with ${staffingData.length} members`);
console.log(`  FPL members: ${staffingData.filter((m) => m.isFPL).length}`);
console.log(`  PwC members: ${staffingData.filter((m) => !m.isFPL).length}`);
console.log(`\n✓ Sync complete! The app will now display all members with latest details.`);
