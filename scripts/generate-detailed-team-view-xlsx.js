const XLSX = require("xlsx");
const path = require("path");
const staffingData = require("../lib/fpl-staffing-data.json");

const detailedTeamMembers = staffingData;

const workbook = XLSX.utils.book_new();

// Sheet 1: All Team Members with Details
const allMembersSheet = detailedTeamMembers.map((member) => ({
  Name: member.Name,
  Email: member.Email,
  Designation: member.Designation,
  Role: member.Role,
  Workstream: member.Workstream,
  Release: member.Release,
  Valuestream: member.Valuestream,
  POD: member.POD,
  "FPL Member": member.isFPL ? "Yes" : "No",
}));

const membersWs = XLSX.utils.json_to_sheet(allMembersSheet);
membersWs["!cols"] = [
  { wch: 25 },
  { wch: 30 },
  { wch: 18 },
  { wch: 20 },
  { wch: 20 },
  { wch: 12 },
  { wch: 25 },
  { wch: 20 },
  { wch: 12 },
];
XLSX.utils.book_append_sheet(workbook, membersWs, "All Members");

// Sheet 2: Summary by Role
const roleStats = {};
detailedTeamMembers.forEach((member) => {
  if (!roleStats[member.Role]) {
    roleStats[member.Role] = { Role: member.Role, Total: 0, FPL: 0, PwC: 0 };
  }
  roleStats[member.Role].Total += 1;
  if (member.isFPL) {
    roleStats[member.Role].FPL += 1;
  } else {
    roleStats[member.Role].PwC += 1;
  }
});

const roleSummary = Object.values(roleStats).sort((a, b) => b.Total - a.Total);
const roleWs = XLSX.utils.json_to_sheet(roleSummary);
roleWs["!cols"] = [{ wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 10 }];
XLSX.utils.book_append_sheet(workbook, roleWs, "Role Summary");

// Sheet 3: Summary by Release
const releaseStats = {};
detailedTeamMembers.forEach((member) => {
  const release = member.Release || "Unassigned";
  if (!releaseStats[release]) {
    releaseStats[release] = {
      Release: release,
      Total: 0,
      FPL: 0,
      PwC: 0,
    };
  }
  releaseStats[release].Total += 1;
  if (member.isFPL) {
    releaseStats[release].FPL += 1;
  } else {
    releaseStats[release].PwC += 1;
  }
});

const releaseSummary = Object.values(releaseStats).sort((a, b) =>
  a.Release.localeCompare(b.Release)
);
const releaseWs = XLSX.utils.json_to_sheet(releaseSummary);
releaseWs["!cols"] = [{ wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 10 }];
XLSX.utils.book_append_sheet(workbook, releaseWs, "Release Summary");

// Sheet 4: Summary by Valuestream (POD)
const valueStreamStats = {};
detailedTeamMembers.forEach((member) => {
  const vs = member.Valuestream || "Unassigned";
  if (!valueStreamStats[vs]) {
    valueStreamStats[vs] = {
      Valuestream: vs,
      Total: 0,
      FPL: 0,
      PwC: 0,
    };
  }
  valueStreamStats[vs].Total += 1;
  if (member.isFPL) {
    valueStreamStats[vs].FPL += 1;
  } else {
    valueStreamStats[vs].PwC += 1;
  }
});

const valueStreamSummary = Object.values(valueStreamStats).sort((a, b) =>
  a.Valuestream.localeCompare(b.Valuestream)
);
const vsWs = XLSX.utils.json_to_sheet(valueStreamSummary);
vsWs["!cols"] = [{ wch: 30 }, { wch: 10 }, { wch: 10 }, { wch: 10 }];
XLSX.utils.book_append_sheet(workbook, vsWs, "Valuestream Summary");

// Sheet 5: FPL Members Only
const fplMembers = detailedTeamMembers
  .filter((m) => m.isFPL)
  .map((member) => ({
    Name: member.Name,
    Email: member.Email,
    Role: member.Role,
    Release: member.Release,
    Valuestream: member.Valuestream,
    POD: member.POD,
  }));

const fplWs = XLSX.utils.json_to_sheet(fplMembers);
fplWs["!cols"] = [{ wch: 25 }, { wch: 30 }, { wch: 20 }, { wch: 12 }, { wch: 25 }, { wch: 20 }];
XLSX.utils.book_append_sheet(workbook, fplWs, "FPL Members");

// Sheet 6: Overall Statistics
const stats = {
  total: detailedTeamMembers.length,
  fpl: detailedTeamMembers.filter((m) => m.isFPL).length,
  pwc: detailedTeamMembers.filter((m) => !m.isFPL).length,
  devCount: detailedTeamMembers.filter((m) => m.Role === "Dev").length,
  fplDevCount: detailedTeamMembers.filter((m) => m.Role === "Dev" && m.isFPL).length,
  qaCount: detailedTeamMembers.filter((m) => m.Role === "QA").length,
  fplQaCount: detailedTeamMembers.filter((m) => m.Role === "QA" && m.isFPL).length,
  leadCount: detailedTeamMembers.filter((m) => m.Role === "Lead").length,
  saCount: detailedTeamMembers.filter((m) => m.Role.includes("Solution Analyst")).length,
  releases: [...new Set(detailedTeamMembers.map((m) => m.Release).filter(Boolean))],
  valueStreams: [...new Set(detailedTeamMembers.map((m) => m.Valuestream).filter(Boolean))],
};

const statsData = [
  { Metric: "Total Team Members", Count: stats.total },
  { Metric: "FPL Members", Count: stats.fpl },
  { Metric: "PwC Members", Count: stats.pwc },
  { Metric: "", Count: "" },
  { Metric: "Total Devs", Count: stats.devCount },
  { Metric: "FPL Devs", Count: stats.fplDevCount },
  { Metric: "Total QAs", Count: stats.qaCount },
  { Metric: "FPL QAs", Count: stats.fplQaCount },
  { Metric: "Total Leads", Count: stats.leadCount },
  { Metric: "Total Solution Analysts", Count: stats.saCount },
  { Metric: "", Count: "" },
  { Metric: "Releases Covered", Count: stats.releases.length },
  { Metric: "Value Streams", Count: stats.valueStreams.length },
];

const statsWs = XLSX.utils.json_to_sheet(statsData);
statsWs["!cols"] = [{ wch: 25 }, { wch: 15 }];
XLSX.utils.book_append_sheet(workbook, statsWs, "Statistics");

// Write to file
const filePath = path.join(__dirname, "../public/Detailed Team View.xlsx");
XLSX.writeFile(workbook, filePath);
console.log(`✓ Detailed Team View.xlsx generated at ${filePath}`);
console.log(`  Total members: ${stats.total}`);
console.log(`  FPL members: ${stats.fpl}`);
console.log(`  PwC members: ${stats.pwc}`);
