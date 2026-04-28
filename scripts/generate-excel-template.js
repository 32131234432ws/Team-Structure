import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

// Create workbook
const wb = XLSX.utils.book_new();

// Sheet 1: Dev Pods
const devPodsHeaders = [
  'Pod ID',
  'Pod Name',
  'Value Stream',
  'Description',
  'Release',
  'Badges (comma-separated)',
  'Color'
];

const devPodsData = [
  devPodsHeaders,
  ['pod-1', 'Dev POD 1/Lead Name', 'Release', 'Description of the pod', 'IR4', 'Badge1, Badge2, Badge3', 'from-cyan-500/20 to-cyan-500/5'],
  ['pod-2', 'Dev POD 2/Lead Name', 'Release', 'Description of the pod', 'IR3.2', 'Badge1, Badge2', 'from-emerald-500/20 to-emerald-500/5'],
];

const devPodsSheet = XLSX.utils.aoa_to_sheet(devPodsData);

// Set column widths
devPodsSheet['!cols'] = [
  { wch: 15 },  // Pod ID
  { wch: 30 },  // Pod Name
  { wch: 15 },  // Value Stream
  { wch: 50 },  // Description
  { wch: 10 },  // Release
  { wch: 40 },  // Badges
  { wch: 40 },  // Color
];

XLSX.utils.book_append_sheet(wb, devPodsSheet, 'Dev Pods');

// Sheet 2: Team Members
const teamMembersHeaders = [
  'Pod ID',
  'Member Name',
  'Role',
  'Status'
];

const teamMembersData = [
  teamMembersHeaders,
  ['pod-1', 'John Doe', 'Lead', 'Active'],
  ['pod-1', 'Jane Smith', 'Onshore Solution Analyst', 'Active'],
  ['pod-1', 'Bob Johnson', 'Offshore Solution Analyst', 'Active'],
  ['pod-1', 'Alice Brown', 'Dev', 'Active'],
  ['pod-1', 'TBD', 'Dev', 'Open'],
  ['pod-1', 'Charlie Wilson', 'QA', 'Active'],
  ['pod-2', 'David Lee', 'Lead', 'Active'],
  ['pod-2', 'Eve Davis', 'Dev', 'Active'],
];

const teamMembersSheet = XLSX.utils.aoa_to_sheet(teamMembersData);

// Set column widths
teamMembersSheet['!cols'] = [
  { wch: 15 },  // Pod ID
  { wch: 40 },  // Member Name
  { wch: 30 },  // Role
  { wch: 12 },  // Status
];

XLSX.utils.book_append_sheet(wb, teamMembersSheet, 'Team Members');

// Sheet 3: Cross-Functional PODs
const crossFunctionalHeaders = [
  'POD ID',
  'POD Name',
  'Description',
  'Color'
];

const crossFunctionalData = [
  crossFunctionalHeaders,
  ['cf-integration', 'Integration POD', 'Manages integrations across all value streams and releases', 'from-violet-500/20 to-violet-500/5'],
  ['cf-devops', 'DevOps POD', 'CI/CD, infrastructure, and deployment across all releases', 'from-indigo-500/20 to-indigo-500/5'],
];

const crossFunctionalSheet = XLSX.utils.aoa_to_sheet(crossFunctionalData);

// Set column widths
crossFunctionalSheet['!cols'] = [
  { wch: 20 },  // POD ID
  { wch: 30 },  // POD Name
  { wch: 60 },  // Description
  { wch: 40 },  // Color
];

XLSX.utils.book_append_sheet(wb, crossFunctionalSheet, 'Cross-Functional PODs');

// Sheet 4: Cross-Functional Team Members
const cfTeamMembersHeaders = [
  'POD ID',
  'Member Name',
  'Role',
  'Status'
];

const cfTeamMembersData = [
  cfTeamMembersHeaders,
  ['cf-integration', 'John Doe', 'Lead', 'Active'],
  ['cf-integration', 'Jane Smith', 'Team', 'Active'],
  ['cf-devops', 'Bob Johnson', 'Lead', 'Active'],
  ['cf-devops', 'Alice Brown', 'Team', 'Active'],
];

const cfTeamMembersSheet = XLSX.utils.aoa_to_sheet(cfTeamMembersData);

// Set column widths
cfTeamMembersSheet['!cols'] = [
  { wch: 20 },  // POD ID
  { wch: 40 },  // Member Name
  { wch: 15 },  // Role
  { wch: 12 },  // Status
];

XLSX.utils.book_append_sheet(wb, cfTeamMembersSheet, 'Cross-Functional Members');

// Sheet 5: Reference - Roles
const rolesHeaders = ['Role', 'Description'];
const rolesData = [
  rolesHeaders,
  ['Lead', 'Team lead responsible for the pod'],
  ['Onshore Solution Analyst', 'Solution analyst based onshore'],
  ['Offshore Solution Analyst', 'Solution analyst based offshore'],
  ['Dev', 'Developer'],
  ['QA', 'Quality Assurance'],
  ['Team', 'General team member (for cross-functional PODs)'],
];

const rolesSheet = XLSX.utils.aoa_to_sheet(rolesData);
rolesSheet['!cols'] = [
  { wch: 30 },
  { wch: 50 },
];

XLSX.utils.book_append_sheet(wb, rolesSheet, 'Reference - Roles');

// Sheet 6: Reference - Statuses
const statusesHeaders = ['Status', 'Description'];
const statusesData = [
  statusesHeaders,
  ['Active', 'Currently active team member'],
  ['Planned', 'Planned to join'],
  ['Open', 'Position is open/TBD'],
];

const statusesSheet = XLSX.utils.aoa_to_sheet(statusesData);
statusesSheet['!cols'] = [
  { wch: 15 },
  { wch: 40 },
];

XLSX.utils.book_append_sheet(wb, statusesSheet, 'Reference - Statuses');

// Sheet 7: Reference - Releases
const releasesHeaders = ['Release', 'Description'];
const releasesData = [
  releasesHeaders,
  ['IR3.1', 'Incremental Release 3.1'],
  ['IR3.2', 'Incremental Release 3.2'],
  ['IR3.3', 'Incremental Release 3.3'],
  ['IR4', 'Incremental Release 4'],
];

const releasesSheet = XLSX.utils.aoa_to_sheet(releasesData);
releasesSheet['!cols'] = [
  { wch: 15 },
  { wch: 40 },
];

XLSX.utils.book_append_sheet(wb, releasesSheet, 'Reference - Releases');

// Sheet 8: Reference - Colors
const colorsHeaders = ['Color Name', 'Tailwind Class'];
const colorsData = [
  colorsHeaders,
  ['Emerald', 'from-emerald-500/20 to-emerald-500/5'],
  ['Blue', 'from-blue-500/20 to-blue-500/5'],
  ['Amber', 'from-amber-500/20 to-amber-500/5'],
  ['Rose', 'from-rose-500/20 to-rose-500/5'],
  ['Cyan', 'from-cyan-500/20 to-cyan-500/5'],
  ['Teal', 'from-teal-500/20 to-teal-500/5'],
  ['Pink', 'from-pink-500/20 to-pink-500/5'],
  ['Violet', 'from-violet-500/20 to-violet-500/5'],
  ['Indigo', 'from-indigo-500/20 to-indigo-500/5'],
];

const colorsSheet = XLSX.utils.aoa_to_sheet(colorsData);
colorsSheet['!cols'] = [
  { wch: 15 },
  { wch: 40 },
];

XLSX.utils.book_append_sheet(wb, colorsSheet, 'Reference - Colors');

// Write to file
const outputPath = path.join(process.cwd(), 'public', 'team-structure-template.xlsx');

// Ensure public directory exists
if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
  fs.mkdirSync(path.join(process.cwd(), 'public'), { recursive: true });
}

XLSX.writeFile(wb, outputPath);

console.log(`Excel template created at: ${outputPath}`);
console.log('\nSheets included:');
console.log('1. Dev Pods - Main pod information');
console.log('2. Team Members - Team members linked to pods');
console.log('3. Cross-Functional PODs - Cross-functional team information');
console.log('4. Cross-Functional Members - Members of cross-functional teams');
console.log('5. Reference - Roles - Valid role values');
console.log('6. Reference - Statuses - Valid status values');
console.log('7. Reference - Releases - Valid release values');
console.log('8. Reference - Colors - Available color options');
