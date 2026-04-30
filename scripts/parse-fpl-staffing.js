const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read the FPL Staffing Excel file
const workbook = XLSX.readFile(path.join(__dirname, '../public/FPL Staffing.xlsx'));

// Get all sheet names
console.log('Sheet names:', workbook.SheetNames);

// Parse each sheet
workbook.SheetNames.forEach(sheetName => {
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
  console.log(`\n=== Sheet: ${sheetName} ===`);
  console.log('Headers:', data[0]);
  console.log('Sample rows:');
  data.slice(1, 10).forEach((row, idx) => {
    console.log(`Row ${idx + 1}:`, row);
  });
});

// Convert first sheet to JSON for detailed view
const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
const jsonData = XLSX.utils.sheet_to_json(firstSheet);

// Output the structure
console.log('\n=== JSON Structure ===');
console.log('Total rows:', jsonData.length);
if (jsonData.length > 0) {
  console.log('Fields:', Object.keys(jsonData[0]));
  console.log('First 3 records:', JSON.stringify(jsonData.slice(0, 3), null, 2));
}

// Write JSON output for reference
fs.writeFileSync(
  path.join(__dirname, '../lib/fpl-staffing-data.json'),
  JSON.stringify(jsonData, null, 2)
);
console.log('\nJSON data written to lib/fpl-staffing-data.json');

// Parse second sheet (Roles and Responsibilities)
if (workbook.SheetNames.length > 1) {
  const rolesSheet = workbook.Sheets[workbook.SheetNames[1]];
  const rawData = XLSX.utils.sheet_to_json(rolesSheet, { header: 1 });
  
  // Parse the structured data - skip title row, process sections
  const rolesData = [];
  let currentCategory = '';
  
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length === 0) continue;
    
    const firstCell = row[0] || '';
    const secondCell = row[1] || '';
    
    // Check if this is a category header (all caps, no responsibilities)
    if (firstCell && !secondCell && firstCell === firstCell.toUpperCase() && firstCell.length > 2) {
      currentCategory = firstCell;
    } else if (firstCell === 'Role' && secondCell === 'Responsibilities') {
      // Skip header row
      continue;
    } else if (firstCell && secondCell) {
      // This is a role with responsibilities
      rolesData.push({
        category: currentCategory,
        role: firstCell,
        responsibilities: secondCell.split('\r\n').map(r => r.replace(/^[•\-]\s*/, '').trim()).filter(r => r)
      });
    }
  }
  
  console.log('\n=== Roles and Responsibilities ===');
  console.log('Total roles:', rolesData.length);
  console.log('Categories:', [...new Set(rolesData.map(r => r.category))]);
  console.log('Sample:', JSON.stringify(rolesData.slice(0, 2), null, 2));
  
  fs.writeFileSync(
    path.join(__dirname, '../lib/roles-responsibilities-data.json'),
    JSON.stringify(rolesData, null, 2)
  );
  console.log('\nRoles data written to lib/roles-responsibilities-data.json');
}
