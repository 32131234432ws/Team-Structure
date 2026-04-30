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

// Parse second sheet (Roles and Responsibilities) - RACI Matrix format
if (workbook.SheetNames.length > 1) {
  const rolesSheet = workbook.Sheets[workbook.SheetNames[1]];
  const rawData = XLSX.utils.sheet_to_json(rolesSheet, { header: 1 });
  
  // Get headers (role names) from first row
  const headers = rawData[0];
  const roleNames = headers.slice(2); // Skip "Lifecycle Phase" and "Activity"
  
  // Parse the RACI matrix data
  const raciData = {
    roles: roleNames,
    phases: {},
    activities: []
  };
  
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length === 0) continue;
    
    const phase = row[0] || '';
    const activity = row[1] || '';
    
    if (!phase || !activity) continue;
    
    // Track phases
    if (!raciData.phases[phase]) {
      raciData.phases[phase] = [];
    }
    
    // Build activity entry with RACI values for each role
    const activityEntry = {
      phase,
      activity,
      raci: {}
    };
    
    roleNames.forEach((role, idx) => {
      const value = row[idx + 2] || '-';
      activityEntry.raci[role] = value;
    });
    
    raciData.phases[phase].push(activityEntry);
    raciData.activities.push(activityEntry);
  }
  
  console.log('\n=== Roles and Responsibilities (RACI Matrix) ===');
  console.log('Roles:', raciData.roles);
  console.log('Phases:', Object.keys(raciData.phases));
  console.log('Total activities:', raciData.activities.length);
  console.log('Sample activity:', JSON.stringify(raciData.activities[0], null, 2));
  
  fs.writeFileSync(
    path.join(__dirname, '../lib/roles-responsibilities-data.json'),
    JSON.stringify(raciData, null, 2)
  );
  console.log('\nRoles data written to lib/roles-responsibilities-data.json');
}
