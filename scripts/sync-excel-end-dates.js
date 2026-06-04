const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read the FPL Staffing Excel file
const excelPath = path.join(__dirname, '../public/FPL Staffing.xlsx');
const workbook = XLSX.readFile(excelPath);
const sheet = workbook.Sheets['All Members'] || workbook.Sheets[workbook.SheetNames[0]];
const excelData = XLSX.utils.sheet_to_json(sheet);

// Read current staffing JSON
const staffingPath = path.join(__dirname, '../lib/fpl-staffing-data.json');
const staffingData = require(staffingPath);

// Create a map of end dates from Excel
const endDateMap = {};
excelData.forEach((row) => {
  if (row.Name) {
    endDateMap[row.Name] = row['Planned End Date'] || row['End Date'] || '';
  }
});

// Update staffing data with end dates from Excel
let updated = 0;
staffingData.forEach((member) => {
  if (endDateMap[member.Name]) {
    member['Planned End Date'] = endDateMap[member.Name];
    updated++;
  }
});

// Write updated data back to JSON
fs.writeFileSync(staffingPath, JSON.stringify(staffingData, null, 2));

console.log(`✓ Synced end dates from FPL Staffing.xlsx`);
console.log(`  Total members updated with end dates: ${updated}`);
console.log(`  Total members in staffing data: ${staffingData.length}`);
