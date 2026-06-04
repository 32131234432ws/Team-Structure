const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

// Read files
const staffingData = require("../lib/fpl-staffing-data.json");
const teamDataFile = fs.readFileSync(path.join(__dirname, "../lib/team-data.ts"), "utf-8");

// Map to store unique members by name
const allMembers = new Map();

// First, add all staffing data members
staffingData.forEach((member) => {
  allMembers.set(member.Name, {
    Name: member.Name,
    Email: member.Email || "",
    Designation: member.Designation || "",
    Role: member.Role || "",
    Workstream: member.Workstream || "",
    Release: member.Release || "",
    Valuestream: member.Valuestream || "",
    POD: member.POD || "",
    isFPL: member.isFPL || false,
  });
});

// Parse team-data.ts to extract all members from PODs and teams
// Extract devPods array
const devPodsMatch = teamDataFile.match(/export const devPods.*?= \[([\s\S]*?)\n\];/);
if (devPodsMatch) {
  const podsContent = devPodsMatch[1];
  
  // Extract each pod
  const podMatches = podsContent.match(/id: "([^"]*)"[\s\S]*?name: "([^"]*)"[\s\S]*?release: "([^"]*)"[\s\S]*?team: \[([\s\S]*?)\]/g);
  
  if (podMatches) {
    podMatches.forEach((podBlock) => {
      const podNameMatch = podBlock.match(/name: "([^"]*)"/);
      const releaseMatch = podBlock.match(/release: "([^"]*)"/);
      const valueStreamMatch = podBlock.match(/valueStream: "([^"]*)"/);
      
      const podName = podNameMatch ? podNameMatch[1] : "";
      const release = releaseMatch ? releaseMatch[1] : "";
      const valueStream = valueStreamMatch ? valueStreamMatch[1] : "";
      
      // Extract team members
      const teamMatch = podBlock.match(/team: \[([\s\S]*?)\]/);
      if (teamMatch) {
        const teamContent = teamMatch[1];
        const memberMatches = teamContent.match(/{ name: "([^"]*)", role: "([^"]*)".*?(?:isFPL: (true|false))?.*?}/g);
        
        if (memberMatches) {
          memberMatches.forEach((memberStr) => {
            const nameMatch = memberStr.match(/name: "([^"]*)"/);
            const roleMatch = memberStr.match(/role: "([^"]*)"/);
            const isFplMatch = memberStr.match(/isFPL: (true|false)/);
            
            if (nameMatch) {
              const name = nameMatch[1];
              const role = roleMatch ? roleMatch[1] : "";
              const isFPL = isFplMatch ? isFplMatch[1] === "true" : false;
              
              if (!allMembers.has(name)) {
                allMembers.set(name, {
                  Name: name,
                  Email: "",
                  Designation: "",
                  Role: role,
                  Workstream: release,
                  Release: release,
                  Valuestream: valueStream,
                  POD: podName,
                  isFPL: isFPL,
                });
              } else {
                // Update existing member with POD info if missing
                const existing = allMembers.get(name);
                if (!existing.POD && podName) existing.POD = podName;
                if (!existing.Release && release) existing.Release = release;
                if (!existing.Valuestream && valueStream) existing.Valuestream = valueStream;
                if (!existing.isFPL && isFPL) existing.isFPL = true;
              }
            }
          });
        }
      }
    });
  }
}

// Extract hypercarePods
const hypercareMatch = teamDataFile.match(/export const hypercarePods.*?= \[([\s\S]*?)\n\];/);
if (hypercareMatch) {
  const podsContent = hypercareMatch[1];
  const podMatches = podsContent.match(/id: "([^"]*)"[\s\S]*?name: "([^"]*)"[\s\S]*?release: "([^"]*)"[\s\S]*?team: \[([\s\S]*?)\]/g);
  
  if (podMatches) {
    podMatches.forEach((podBlock) => {
      const podNameMatch = podBlock.match(/name: "([^"]*)"/);
      const releaseMatch = podBlock.match(/release: "([^"]*)"/);
      
      const podName = podNameMatch ? podNameMatch[1] : "";
      const release = releaseMatch ? releaseMatch[1] : "";
      
      const teamMatch = podBlock.match(/team: \[([\s\S]*?)\]/);
      if (teamMatch) {
        const teamContent = teamMatch[1];
        const memberMatches = teamContent.match(/{ name: "([^"]*)", role: "([^"]*)".*?(?:isFPL: (true|false))?.*?}/g);
        
        if (memberMatches) {
          memberMatches.forEach((memberStr) => {
            const nameMatch = memberStr.match(/name: "([^"]*)"/);
            const roleMatch = memberStr.match(/role: "([^"]*)"/);
            const isFplMatch = memberStr.match(/isFPL: (true|false)/);
            
            if (nameMatch) {
              const name = nameMatch[1];
              const role = roleMatch ? roleMatch[1] : "";
              const isFPL = isFplMatch ? isFplMatch[1] === "true" : false;
              
              if (!allMembers.has(name)) {
                allMembers.set(name, {
                  Name: name,
                  Email: "",
                  Designation: "",
                  Role: role,
                  Workstream: "Hypercare",
                  Release: release,
                  Valuestream: "Hypercare",
                  POD: podName,
                  isFPL: isFPL,
                });
              }
            }
          });
        }
      }
    });
  }
}

// Extract crossFunctionalTeams
const crossFunctionalMatch = teamDataFile.match(/export const crossFunctionalTeams.*?= \[([\s\S]*?)\n\];/);
if (crossFunctionalMatch) {
  const teamsContent = crossFunctionalMatch[1];
  const teamMatches = teamsContent.match(/name: "([^"]*)"[\s\S]*?team: \[([\s\S]*?)\]/g);
  
  if (teamMatches) {
    teamMatches.forEach((teamBlock) => {
      const nameMatch = teamBlock.match(/name: "([^"]*)"/);
      const teamName = nameMatch ? nameMatch[1] : "";
      
      const memberMatches = teamBlock.match(/{ name: "([^"]*)", role: "([^"]*)".*?}/g);
      
      if (memberMatches) {
        memberMatches.forEach((memberStr) => {
          const mnameMatch = memberStr.match(/name: "([^"]*)"/);
          const roleMatch = memberStr.match(/role: "([^"]*)"/);
          
          if (mnameMatch) {
            const name = mnameMatch[1];
            const role = roleMatch ? roleMatch[1] : "";
            
            if (!allMembers.has(name)) {
              allMembers.set(name, {
                Name: name,
                Email: "",
                Designation: "",
                Role: role,
                Workstream: "Cross-Functional",
                Release: "All",
                Valuestream: teamName,
                POD: teamName,
                isFPL: false,
              });
            }
          }
        });
      }
    });
  }
}

// Generate Excel file
const workbook = XLSX.utils.book_new();

const allMembersSheet = Array.from(allMembers.values())
  .sort((a, b) => {
    if (a.isFPL !== b.isFPL) return b.isFPL - a.isFPL; // FPL first
    return a.Name.localeCompare(b.Name); // Then alphabetical
  })
  .map((member) => ({
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

const ws = XLSX.utils.json_to_sheet(allMembersSheet);
ws["!cols"] = [
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
XLSX.utils.book_append_sheet(workbook, ws, "Team Members");

const filePath = path.join(__dirname, "../public/Detailed Team View.xlsx");
XLSX.writeFile(workbook, filePath);
console.log(`✓ Detailed Team View.xlsx updated at ${filePath}`);
console.log(`  Total members: ${allMembers.size}`);
console.log(`  FPL members: ${Array.from(allMembers.values()).filter((m) => m.isFPL).length}`);
