const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const masterFile = path.join(__dirname, "../public/FPL Staffing Master.xlsx");

if (!fs.existsSync(masterFile)) {
  console.error("❌ FPL Staffing Master.xlsx not found in /public folder");
  process.exit(1);
}

// Read the Excel file
const workbook = XLSX.readFile(masterFile);
const sheet = workbook.Sheets["Master Data"];

if (!sheet) {
  console.error("❌ 'Master Data' sheet not found in Excel file");
  process.exit(1);
}

// Convert to JSON
const data = XLSX.utils.sheet_to_json(sheet);

// Transform and validate
const staffingData = data.map((row, idx) => {
  if (!row.Name || row.Name.trim() === "") {
    console.warn(`⚠️  Row ${idx + 2}: Empty Name, skipping`);
    return null;
  }

  return {
    Name: row.Name.trim(),
    Email: (row.Email || "").trim(),
    Designation: (row.Designation || "").trim(),
    Role: (row.Role || "").trim(),
    Workstream: (row.Workstream || "").trim(),
    Release: (row.Release || "").trim(),
    Valuestream: (row.Valuestream || "").trim(),
    POD: (row.POD || "").trim(),
    isFPL: (row["FPL Member"] || "").toLowerCase() === "yes",
  };
}).filter(Boolean);

// Write to fpl-staffing-data.json
const jsonPath = path.join(__dirname, "../lib/fpl-staffing-data.json");
fs.writeFileSync(jsonPath, JSON.stringify(staffingData, null, 2));

console.log(`✓ Synced FPL Staffing Master.xlsx to fpl-staffing-data.json`);
console.log(`  Total members: ${staffingData.length}`);
console.log(`  FPL members: ${staffingData.filter((m) => m.isFPL).length}`);
console.log(`  PwC members: ${staffingData.filter((m) => !m.isFPL).length}`);
console.log(`\n✓ Updated ${jsonPath}`);
