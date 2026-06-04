const fs = require('fs');
const path = require('path');

// Read files
const teamDataContent = fs.readFileSync(path.join(__dirname, '../lib/team-data.ts'), 'utf-8');
const staffingData = require('../lib/fpl-staffing-data.json');

// Extract all active members from PODs
const nameRolePattern = /{\s*name:\s*"([^"]+)",\s*role:\s*"([^"]+)",\s*status:\s*"([^"]+)"(?:,\s*isFPL:\s*(true|false))?/g;

const podMembers = new Map(); // name -> {role, isFPL}
let match;
while ((match = nameRolePattern.exec(teamDataContent)) !== null) {
  const [, name, role, status, isFPL] = match;
  if (status === 'Active' && name !== 'TBD' && name !== 'FPL') {
    if (!podMembers.has(name)) {
      podMembers.set(name, { role, isFPL: isFPL === 'true' });
    }
  }
}

// Create a map of existing staffing data by name
const staffingMap = new Map();
staffingData.forEach((member) => {
  staffingMap.set(member.Name, member);
});

// Add missing POD members to staffing data
const newMembers = [];
podMembers.forEach((podMember, name) => {
  if (!staffingMap.has(name)) {
    newMembers.push({
      Name: name,
      Email: '',
      Designation: 'Associate',
      Role: podMember.role,
      Workstream: 'Cross-Functional',
      Release: 'All',
      Valuestream: '',
      isFPL: podMember.isFPL || false,
    });
    console.log(`Adding missing member: ${name} (${podMember.role})`);
  }
});

// Remove members from staffing data that are not in any POD
const updatedStaffingData = staffingData.filter((member) => podMembers.has(member.Name));
const removedCount = staffingData.length - updatedStaffingData.length;

if (removedCount > 0) {
  console.log(`\nRemoving ${removedCount} members not found in PODs`);
  staffingData.forEach((member) => {
    if (!podMembers.has(member.Name)) {
      console.log(`  Removing: ${member.Name}`);
    }
  });
}

// Combine updated staffing with new members
const finalStaffingData = [...updatedStaffingData, ...newMembers].sort((a, b) =>
  a.Name.localeCompare(b.Name)
);

// Write back to file
fs.writeFileSync(
  path.join(__dirname, '../lib/fpl-staffing-data.json'),
  JSON.stringify(finalStaffingData, null, 2)
);

console.log(`\n✓ Sync complete!`);
console.log(`  Added: ${newMembers.length} new members`);
console.log(`  Removed: ${removedCount} outdated members`);
console.log(`  Total now: ${finalStaffingData.length}`);
console.log(`  Expected from PODs: ${podMembers.size}`);
