const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read the FPL Staffing.xlsx file
const filePath = path.join(__dirname, '../public/FPL Staffing.xlsx');
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets['FPL Staffing'] || workbook.Sheets[Object.keys(workbook.Sheets)[0]];
const excelData = XLSX.utils.sheet_to_json(sheet);

console.log(`\n✓ Read ${excelData.length} members from FPL Staffing.xlsx`);
console.log(`  Columns: ${Object.keys(excelData[0] || {}).join(', ')}`);

// Load existing staffing data
const staffingPath = path.join(__dirname, '../lib/fpl-staffing-data.json');
let existingData = [];
try {
  existingData = JSON.parse(fs.readFileSync(staffingPath, 'utf-8'));
  console.log(`\n  Current backend: ${existingData.length} members`);
} catch (e) {
  console.log('  No existing data, starting fresh');
}

// Merge: Excel data takes precedence, keep existing for any not in Excel
const memberMap = new Map();

// First add all existing members
existingData.forEach(m => {
  memberMap.set(m.Name, m);
});

// Then update/add all Excel members (Excel is source of truth)
excelData.forEach(m => {
  memberMap.set(m.Name, {
    Name: m.Name || '',
    Email: m.Email || '',
    Designation: m.Designation || '',
    Role: m.Role || '',
    Workstream: m.Workstream || '',
    Release: m.Release || '',
    Valuestream: m.Valuestream || '',
    POD: m.POD || '',
    isFPL: m['FPL Member'] === 'Yes' || m.isFPL === true || false,
    "Planned End Date": m['Planned End Date'] || ''
  });
});

// Convert back to array
const mergedData = Array.from(memberMap.values());

// Write updated data
fs.writeFileSync(staffingPath, JSON.stringify(mergedData, null, 2));

console.log(`\n✓ Updated backend with ${mergedData.length} members`);
console.log(`  Added/Updated: ${excelData.length} from Excel`);
console.log(`  Total in backend: ${mergedData.length}`);

// Show summary
const fplCount = mergedData.filter(m => m.isFPL).length;
const roles = {};
mergedData.forEach(m => {
  roles[m.Role] = (roles[m.Role] || 0) + 1;
});

console.log(`\n  FPL Members: ${fplCount}`);
console.log(`  PwC Members: ${mergedData.length - fplCount}`);
console.log(`  Roles: ${Object.entries(roles).map(([r, c]) => `${r}(${c})`).join(', ')}`);
