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
