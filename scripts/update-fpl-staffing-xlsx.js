// Regenerates public/FPL Staffing.xlsx from the latest staff data in lib/fpl-staffing-data.json,
// merged with FPL members from lib/team-data.ts so every name in the app is reflected in the sheet.

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const baseStaffPath = path.join(repoRoot, 'lib', 'fpl-staffing-data.json');
const teamDataPath = path.join(repoRoot, 'lib', 'team-data.ts');
const outputPath = path.join(repoRoot, 'public', 'FPL Staffing.xlsx');

const baseStaff = JSON.parse(fs.readFileSync(baseStaffPath, 'utf8'));
const teamSrc = fs.readFileSync(teamDataPath, 'utf8');

// Helper to extract every team member literal in team-data.ts.
// Matches: { name: "X", role: "Y", status: "Z", valueStreams: [...], isFPL: true }
const memberRegex = /\{\s*name:\s*"([^"]+)"\s*,\s*role:\s*"([^"]+)"\s*,\s*status:\s*"([^"]+)"(?:[^}]*?valueStreams:\s*\[([^\]]*)\])?(?:[^}]*?isFPL:\s*(true|false))?[^}]*?\}/g;

const teamMembers = [];
let match;
while ((match = memberRegex.exec(teamSrc)) !== null) {
  const [, name, role, status, valueStreamsRaw, isFPLRaw] = match;
  if (!name || name === 'TBD' || name === 'FPL') continue;
  const valueStreams = valueStreamsRaw
    ? valueStreamsRaw.split(',').map((s) => s.replace(/['"]/g, '').trim()).filter(Boolean)
    : [];
  teamMembers.push({
    name: name.trim(),
    role: role.trim(),
    status: status.trim(),
    valueStreams,
    isFPL: isFPLRaw === 'true',
  });
}

// Find which release/pod each team member belongs to by walking team-data.ts pod blocks.
// Match each pod block then find members inside.
const podRegex = /\{\s*id:\s*"([^"]+)"\s*,\s*name:\s*"([^"]+)"[^]*?release:\s*"([^"]+)"[^]*?team:\s*\[([^\]]*?)\][^]*?\}/g;
const memberToPod = new Map(); // name -> { release, podName }

let podMatch;
while ((podMatch = podRegex.exec(teamSrc)) !== null) {
  const [, , podName, release, teamBlock] = podMatch;
  const memberInsideRegex = /\{\s*name:\s*"([^"]+)"/g;
  let m;
  while ((m = memberInsideRegex.exec(teamBlock)) !== null) {
    const memberName = m[1];
    if (!memberName || memberName === 'TBD' || memberName === 'FPL') continue;
    if (!memberToPod.has(memberName)) {
      memberToPod.set(memberName, { release, podName });
    }
  }
}

// Build a name->base record map from existing JSON for email lookup
const baseByName = new Map(baseStaff.map((m) => [m.Name, m]));

// Build the unified roster: all base entries + any team members not yet present
const roster = new Map();
baseStaff.forEach((m) => {
  roster.set(m.Name, { ...m });
});

teamMembers.forEach((tm) => {
  const existing = roster.get(tm.name);
  const podInfo = memberToPod.get(tm.name) || { release: '', podName: '' };
  if (existing) {
    if (!existing.Release || existing.Release === '') existing.Release = podInfo.release || existing.Release;
    if (!existing.POD) existing.POD = podInfo.podName;
    if (tm.isFPL) existing.IsFPL = 'Yes';
  } else {
    roster.set(tm.name, {
      Name: tm.name,
      Email: '',
      Designation: '',
      Role: tm.role,
      Workstream: podInfo.release ? podInfo.release : 'Cross-Functional',
      Release: podInfo.release || 'All',
      Valuestream: tm.valueStreams.join(', '),
      POD: podInfo.podName,
      IsFPL: tm.isFPL ? 'Yes' : 'No',
    });
  }
});

// Normalize: ensure every record has the IsFPL/POD columns set
const finalRows = Array.from(roster.values()).map((r) => ({
  Name: r.Name || '',
  Email: r.Email || '',
  Designation: r.Designation || '',
  Role: r.Role || '',
  Workstream: r.Workstream || '',
  Release: r.Release || '',
  Valuestream: r.Valuestream || '',
  POD: r.POD || (memberToPod.get(r.Name)?.podName ?? ''),
  IsFPL: r.IsFPL || 'No',
}));

// Sort by IsFPL desc, then Role, then Name for readability
finalRows.sort((a, b) => {
  if (a.IsFPL !== b.IsFPL) return a.IsFPL === 'Yes' ? -1 : 1;
  if (a.Role !== b.Role) return a.Role.localeCompare(b.Role);
  return a.Name.localeCompare(b.Name);
});

// Read existing workbook to preserve other sheets (Roles & Responsibilities, etc.)
let workbook;
if (fs.existsSync(outputPath)) {
  workbook = XLSX.readFile(outputPath);
} else {
  workbook = XLSX.utils.book_new();
}

// Replace the first sheet with the updated staffing roster
const newSheet = XLSX.utils.json_to_sheet(finalRows);
const firstSheetName = workbook.SheetNames[0] || 'Staffing';
workbook.Sheets[firstSheetName] = newSheet;
if (!workbook.SheetNames.includes(firstSheetName)) {
  workbook.SheetNames.unshift(firstSheetName);
}

XLSX.writeFile(workbook, outputPath);

const fplCount = finalRows.filter((r) => r.IsFPL === 'Yes').length;
const pwcCount = finalRows.length - fplCount;
console.log(`Wrote ${finalRows.length} rows to ${outputPath}`);
console.log(`  FPL: ${fplCount}, PwC: ${pwcCount}`);
console.log(`  Roles:`, finalRows.reduce((acc, r) => { acc[r.Role] = (acc[r.Role] || 0) + 1; return acc; }, {}));
