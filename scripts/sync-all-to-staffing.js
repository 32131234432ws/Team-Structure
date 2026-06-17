const fs = require('fs');
const path = require('path');

const teamDataContent = fs.readFileSync(path.join(__dirname, '../lib/team-data.ts'), 'utf-8');
const staffingData = require(path.join(__dirname, '../lib/fpl-staffing-data.json'));

// Extract all active members from PODs
const nameRolePattern = /{\s*name:\s*"([^"]+)",\s*role:\s*"([^"]+)",\s*status:\s*"([^"]+)"/g;

const podMembers = [];
let match;
while ((match = nameRolePattern.exec(teamDataContent)) !== null) {
  const [, name, role, status] = match;
  if (status === 'Active' && name !== 'TBD' && name !== 'FPL') {
    podMembers.push({ name, role });
  }
}

// Get existing staffing data names
const existingNames = new Set(staffingData.map(m => m.Name));

// Find missing members
const missingMembers = [];
podMembers.forEach(member => {
  if (!existingNames.has(member.name)) {
    missingMembers.push(member);
  }
});

console.log(`Found ${missingMembers.length} missing members to add`);

// Add missing members to staffing data
missingMembers.forEach(member => {
  // Determine default valuestream based on role
  let valuestream = '';
  if (member.role === 'Dev') valuestream = 'Development';
  else if (member.role === 'QA') valuestream = 'Quality Assurance';
  else if (member.role === 'Lead') valuestream = 'Leadership';
  else if (member.role.includes('Architect')) valuestream = 'Architecture';
  else if (member.role.includes('Solution')) valuestream = 'Solution Architecture';
  else if (member.role === 'PMO') valuestream = 'Program Leadership';
  else if (member.role === 'Intern') valuestream = 'Internship';
  else if (member.role === 'DevOps') valuestream = 'DevOps';
  
  const newMember = {
    "Name": member.name,
    "Email": "",
    "Designation": "Associate",
    "Role": member.role,
    "Workstream": "IR4",
    "Release": "IR4",
    "Valuestream": valuestream,
    "POD": "",
    "isFPL": false,
    "Planned End Date": ""
  };
  
  staffingData.push(newMember);
  console.log(`Added: ${member.name} (${member.role})`);
});

// Write updated data
fs.writeFileSync(path.join(__dirname, '../lib/fpl-staffing-data.json'), JSON.stringify(staffingData, null, 2));

console.log(`\nTotal members now: ${staffingData.length}`);
console.log('Done!');
