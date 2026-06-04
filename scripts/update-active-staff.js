const fs = require('fs');
const path = require('path');
const teamDataContent = fs.readFileSync(path.join(__dirname, '../lib/team-data.ts'), 'utf-8');
const staffingData = require(path.join(__dirname, '../lib/fpl-staffing-data.json'));

// Extract all active members from PODs
const nameRolePattern = /{\s*name:\s*"([^"]+)",\s*role:\s*"([^"]+)",\s*status:\s*"([^"]+)"/g;

const podMembers = new Map();
let match;
while ((match = nameRolePattern.exec(teamDataContent)) !== null) {
  const [, name, role, status] = match;
  if (status === 'Active' && name !== 'TBD' && name !== 'FPL') {
    if (!podMembers.has(name)) {
      podMembers.set(name, role);
    }
  }
}

// Get existing staffing names
const staffingNames = new Set(staffingData.map(m => m.Name));

// Find missing members
const missingMembers = [];
podMembers.forEach((role, name) => {
  if (!staffingNames.has(name)) {
    missingMembers.push({ name, role });
  }
});

console.log('Total active members in PODs:', podMembers.size);
console.log('Total in staffing data:', staffingData.length);
console.log('Missing from staffing data:', missingMembers.length);

// Add missing members
missingMembers.forEach(member => {
  staffingData.push({
    "Name": member.name,
    "Email": "",
    "Designation": "Associate",
    "Role": member.role,
    "Workstream": "IR4",
    "Release": "IR4",
    "Valuestream": "",
    "POD": "",
    "isFPL": false,
    "Planned End Date": ""
  });
});

// Write updated data
fs.writeFileSync(path.join(__dirname, '../lib/fpl-staffing-data.json'), JSON.stringify(staffingData, null, 2));
console.log('\n✓ Updated fpl-staffing-data.json');
console.log('New total:', staffingData.length);
console.log('\nMissing members added:');
missingMembers.slice(0, 10).forEach(m => console.log('  -', m.name, `(${m.role})`));
if (missingMembers.length > 10) console.log('  ... and', missingMembers.length - 10, 'more');
