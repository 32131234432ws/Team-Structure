import XLSX from 'xlsx';

// Current Dev Pods Data
const devPods = [
  {
    id: "pod-1a",
    name: "Dev POD 2/Sneha G",
    valueStream: "Release",
    description: "Unified view of account, customer, and premise data for comprehensive insights",
    color: "from-emerald-500/20 to-emerald-500/5",
    release: "IR3.1",
    badges: ["Account 360", "Customer 360", "Premise 360"],
    team: [
      { name: "Sneha Girigoudar", role: "Lead", status: "Active" },
      { name: "Michael O'shea", role: "Onshore Solution Analyst", status: "Active" },
      { name: "Manu Tyagi", role: "Dev", status: "Active" },
    ],
  },
  {
    id: "pod-1b",
    name: "Dev POD 2/Sneha G",
    valueStream: "Release",
    description: "Unified view of account, customer, and premise data for comprehensive insights",
    color: "from-emerald-500/20 to-emerald-500/5",
    release: "IR3.2",
    badges: ["Interactions", "Search"],
    team: [
      { name: "Sneha Girigoudar", role: "Lead", status: "Active" },
      { name: "Michael O'shea", role: "Onshore Solution Analyst", status: "Active" },
      { name: "Madhumita Kodidela", role: "Dev", status: "Active" },
      { name: "Sanjana", role: "QA", status: "Active" },
      { name: "Pratik Mahajan", role: "QA", status: "Active" },
    ],
  },
  {
    id: "pod-2",
    name: "Dev POD 4/Suraj",
    valueStream: "Release",
    description: "Handling MIMO system releases and platform deployments",
    color: "from-blue-500/20 to-blue-500/5",
    release: "IR3.2",
    badges: ["Move In", "Move Out", "Transfer"],
    team: [
      { name: "Suraj Ghodmare", role: "Lead", status: "Active" },
      { name: "Gianna Caruso", role: "Onshore Solution Analyst", status: "Active" },
      { name: "Piyush Singh", role: "Dev", status: "Active" },
      { name: "Shikhar Sanjeev", role: "Dev", status: "Active" },
      { name: "Maneesha", role: "QA", status: "Active" },
      { name: "Bhyravabhotla Naga Lakshmi Sirisha", role: "QA", status: "Active" },
      { name: "Dnyanesh Prakash Painjan", role: "QA", status: "Active" },
      { name: "Girlee Alvarado", role: "QA", status: "Active" },
      { name: "Venugopal Sinde", role: "QA", status: "Active" },
      { name: "Raveendra Reddy", role: "QA", status: "Active" },
      { name: "Naga Srilekha Thummalacheruvu", role: "QA", status: "Active" },
      { name: "ISH Jacinto", role: "QA", status: "Active" },
      { name: "Keerthana Manjunath", role: "QA", status: "Active" },
      { name: "Sonal Yadav", role: "QA", status: "Active" },
      { name: "Argene Francisco", role: "QA", status: "Active" },
    ],
  },
  {
    id: "pod-3",
    name: "Dev POD 6/Aditya",
    valueStream: "Release",
    description: "Managing account updates, modifications, and lifecycle operations",
    color: "from-amber-500/20 to-amber-500/5",
    release: "IR3.2",
    badges: ["Account Maintenance"],
    team: [
      { name: "Aditya Talwar", role: "Lead", status: "Active" },
      { name: "Gianna Caruso", role: "Onshore Solution Analyst", status: "Active" },
      { name: "Nishi Jain", role: "Dev", status: "Active" },
      { name: "Nilesh", role: "QA", status: "Active" },
      { name: "Pritam", role: "QA", status: "Active" },
    ],
  },
  {
    id: "pod-4",
    name: "Dev POD 1/Shreya",
    valueStream: "Release",
    description: "Billing program configurations, rate plans, and payment processing features",
    color: "from-rose-500/20 to-rose-500/5",
    release: "IR3.2",
    badges: ["Payment & Payment Options", "Billing Programs"],
    team: [
      { name: "Shreya LNU", role: "Lead", status: "Active" },
      { name: "TBD", role: "Onshore Solution Analyst", status: "Open" },
      { name: "Mounika Depuri", role: "Dev", status: "Active" },
      { name: "Sandesh Saravanan", role: "Dev", status: "Active" },
      { name: "Smita", role: "QA", status: "Active" },
      { name: "Vidyashree", role: "QA", status: "Active" },
      { name: "Prasanna", role: "QA", status: "Active" },
      { name: "Nikita", role: "QA", status: "Active" },
      { name: "Akhil", role: "QA", status: "Active" },
      { name: "Grace Nazareno", role: "QA", status: "Active" },
    ],
  },
  {
    id: "pod-ir32-case",
    name: "Case Management POD",
    valueStream: "Release",
    description: "Case handling and resolution workflows",
    color: "from-pink-500/20 to-pink-500/5",
    release: "IR3.2",
    badges: [],
    team: [
      { name: "Rinky Chawla", role: "Lead", status: "Active" },
      { name: "Deneys Van Der Merwe", role: "Onshore Solution Analyst", status: "Active" },
      { name: "Cicily Deng", role: "Onshore Solution Analyst", status: "Active" },
      { name: "Pratik Kurdukar", role: "Dev", status: "Active" },
    ],
  },
  {
    id: "pod-ir33-1",
    name: "Dev POD 5/Pornima",
    valueStream: "Release",
    description: "Outage detection, reporting, and restoration management",
    color: "from-rose-500/20 to-rose-500/5",
    release: "IR3.3",
    badges: ["Trouble Tab", "Power Loss", "Power Quality", "Admin Console"],
    team: [
      { name: "Pornima Rajguru", role: "Lead", status: "Active" },
      { name: "Jitain Mohun", role: "Onshore Solution Analyst", status: "Active" },
      { name: "Mayur Kinhekar", role: "Offshore Solution Analyst", status: "Active" },
      { name: "Jayoti Chatterji", role: "Dev", status: "Active" },
      { name: "Aakanksha", role: "QA", status: "Active" },
      { name: "Diksha", role: "QA", status: "Active" },
    ],
  },
  {
    id: "pod-5",
    name: "Dev POD 1/Shreya",
    valueStream: "Release",
    description: "Usage tracking, metering, and billing calculations for customer accounts",
    color: "from-cyan-500/20 to-cyan-500/5",
    release: "IR4",
    badges: ["Billing & Usage", "Payment Programs"],
    team: [
      { name: "Shreya LNU", role: "Lead", status: "Active" },
      { name: "Namrata Bansode", role: "Offshore Solution Analyst", status: "Active" },
      { name: "Mounika Depuri", role: "Dev", status: "Active" },
      { name: "Shivam Shete", role: "Dev", status: "Active" },
      { name: "Rubasri S", role: "Dev", status: "Active" },
      { name: "TBD", role: "Dev", status: "Open" },
      { name: "TBD", role: "Dev", status: "Open" },
    ],
  },
  {
    id: "pod-6",
    name: "Dev POD 2/Sneha G",
    valueStream: "Release",
    description: "Managing account updates, modifications, and lifecycle operations",
    color: "from-teal-500/20 to-teal-500/5",
    release: "IR4",
    badges: ["Correspondence", "360s", "PEXT", "Customer Authentication", "Account Maintenance"],
    team: [
      { name: "Sneha Girigoudar", role: "Lead", status: "Active" },
      { name: "Rohan Bandla", role: "Onshore Solution Analyst", status: "Active" },
      { name: "TBD", role: "Offshore Solution Analyst", status: "Open" },
      { name: "Ankit Mishra", role: "Dev", status: "Active" },
      { name: "Pranay Reddy", role: "Dev", status: "Active" },
      { name: "TBD", role: "Dev", status: "Open" },
    ],
  },
  {
    id: "pod-7",
    name: "Dev POD 3/Anurag",
    valueStream: "Release",
    description: "Energy consumption monitoring, analytics, and optimization features",
    color: "from-amber-500/20 to-amber-500/5",
    release: "IR4",
    badges: ["Energy Management"],
    team: [
      { name: "Anurag Jakkal", role: "Lead", status: "Active" },
      { name: "Sahithi Manne", role: "Onshore Solution Analyst", status: "Active" },
      { name: "Parul Prasad", role: "Offshore Solution Analyst", status: "Active" },
      { name: "Aaditi Madhavan", role: "Dev", status: "Active" },
      { name: "Naman Hiran", role: "Dev", status: "Active" },
      { name: "Mylavarapu V N R Saketh", role: "Dev", status: "Active" },
      { name: "Venkata Sai Harika Ambati", role: "Dev", status: "Active" },
      { name: "TBD", role: "Dev", status: "Open" },
      { name: "Ashit Prashant Golwala", role: "QA", status: "Active" },
      { name: "Sagnik Chakraborty", role: "QA", status: "Active" },
      { name: "Lokesh Sai", role: "QA", status: "Active" },
    ],
  },
  {
    id: "pod-8",
    name: "Dev POD 4/Jason",
    valueStream: "Release",
    description: "Move-in and move-out service management and processing",
    color: "from-blue-500/20 to-blue-500/5",
    release: "IR4",
    badges: ["Multi Move In", "Transfer", "Amend"],
    team: [
      { name: "Jason Pereira", role: "Lead", status: "Active" },
      { name: "Gianna Caruso", role: "Onshore Solution Analyst", status: "Active" },
      { name: "Akhil Palakeel", role: "Offshore Solution Analyst", status: "Active" },
      { name: "Sridaran N M", role: "Dev", status: "Active" },
      { name: "Prasad P", role: "Dev", status: "Active" },
      { name: "Pradeep Lambu", role: "Dev", status: "Active" },
      { name: "Nivetha Sudharsanam", role: "Dev", status: "Active" },
    ],
  },
  {
    id: "pod-9",
    name: "Dev POD 5/Sweta",
    valueStream: "Release",
    description: "Outage detection, reporting, and restoration management",
    color: "from-rose-500/20 to-rose-500/5",
    release: "IR4",
    badges: ["Untap/Retap", "Vegetation Reporting", "Ticket Research", "TLOC", "Emergency PF", "Field Conditions", "Streetlight", "IR3 Spillovers"],
    team: [
      { name: "Sweta Sharma", role: "Lead", status: "Active" },
      { name: "Jitain Mohun", role: "Onshore Solution Analyst", status: "Active" },
      { name: "Mayur Kinhekar", role: "Offshore Solution Analyst", status: "Active" },
      { name: "Shravya Nanjundaswamy", role: "Dev", status: "Active" },
      { name: "Rida Maryam Mohammad", role: "Dev", status: "Active" },
      { name: "Surya Teja Poka", role: "Dev", status: "Active" },
      { name: "Kavita Jha", role: "Dev", status: "Active" },
      { name: "Sanniboina Murali Krishna", role: "Dev", status: "Active" },
    ],
  },
  {
    id: "pod-10",
    name: "FPL Dev POD",
    valueStream: "Release",
    description: "Customer programs, incentives, and enrollment management",
    color: "from-emerald-500/20 to-emerald-500/5",
    release: "IR4",
    badges: ["Billing Programs", "Preferences", "FPLES Programs", "Development Programs", "DSM Programs", "Name Change"],
    team: [
      { name: "Shreya LNU", role: "Lead", status: "Active" },
      { name: "Aditya Talwar", role: "Lead", status: "Active" },
      { name: "FPL", role: "Onshore Solution Analyst", status: "Active" },
      { name: "FPL", role: "Dev", status: "Active" },
    ],
  },
  {
    id: "pod-11",
    name: "Dev POD 6/Aditya",
    valueStream: "Release",
    description: "Customer identity management and fraud detection",
    color: "from-violet-500/20 to-violet-500/5",
    release: "IR4",
    badges: ["Customer ID & Fraud"],
    team: [
      { name: "Aditya Talwar", role: "Lead", status: "Active" },
      { name: "TBD", role: "Dev", status: "Open" },
    ],
  },
  {
    id: "pod-13",
    name: "Case Management POD",
    valueStream: "Release",
    description: "Case handling and resolution workflows",
    color: "from-pink-500/20 to-pink-500/5",
    release: "IR4",
    badges: ["Case Management"],
    team: [
      { name: "Rinky Chawla", role: "Lead", status: "Active" },
      { name: "Deneys Van Der Merwe", role: "Onshore Solution Analyst", status: "Active" },
      { name: "Cicily Deng", role: "Onshore Solution Analyst", status: "Active" },
      { name: "Ankit Verma", role: "Dev", status: "Active" },
      { name: "Sree Sowndarya Barani K", role: "Dev", status: "Active" },
      { name: "John Jyothula", role: "Dev", status: "Active" },
    ],
  },
];

// Cross-functional teams
const crossFunctionalTeams = [
  {
    id: "cf-integration",
    name: "Integration POD",
    description: "Manages integrations across all value streams and releases",
    color: "from-violet-500/20 to-violet-500/5",
    team: [
      { name: "Arun Kumar Krishnareddy Obannareddy", role: "Lead", status: "Active" },
      { name: "Pranav Singh", role: "Team", status: "Active" },
      { name: "Vasudha Tandon", role: "Team", status: "Active" },
    ],
  },
  {
    id: "cf-devops",
    name: "DevOps POD",
    description: "CI/CD, infrastructure, and deployment across all releases",
    color: "from-indigo-500/20 to-indigo-500/5",
    team: [
      { name: "Shabnam Nasreen", role: "Lead", status: "Active" },
      { name: "Santosh Kumar Jangam", role: "Team", status: "Active" },
      { name: "Rhitik Khanna", role: "Team", status: "Active" },
      { name: "Shatakshi Srivastava", role: "Team", status: "Active" },
    ],
  },
  {
    id: "cf-windsurf",
    name: "Windsurf/Performance POD",
    description: "Performance optimization and Windsurf tooling across all releases",
    color: "from-pink-500/20 to-pink-500/5",
    team: [
      { name: "Harish Govindareddy", role: "Team", status: "Active" },
      { name: "Sanket Mundargi", role: "Team", status: "Active" },
    ],
  },
];

// Create workbook
const workbook = XLSX.utils.book_new();

// Sheet 1: Dev Pods
const devPodsData = devPods.map(pod => ({
  "Pod ID": pod.id,
  "Pod Name": pod.name,
  "Value Stream": pod.valueStream,
  "Description": pod.description,
  "Release": pod.release,
  "Badges": (pod.badges || []).join(", "),
  "Color": pod.color
}));
const devPodsSheet = XLSX.utils.json_to_sheet(devPodsData);
XLSX.utils.book_append_sheet(workbook, devPodsSheet, "Dev Pods");

// Sheet 2: Team Members
const teamMembersData = [];
devPods.forEach(pod => {
  pod.team.forEach(member => {
    teamMembersData.push({
      "Pod ID": pod.id,
      "Pod Name": pod.name,
      "Release": pod.release,
      "Member Name": member.name,
      "Role": member.role,
      "Status": member.status
    });
  });
});
const teamMembersSheet = XLSX.utils.json_to_sheet(teamMembersData);
XLSX.utils.book_append_sheet(workbook, teamMembersSheet, "Team Members");

// Sheet 3: Cross-Functional PODs
const cfPodsData = crossFunctionalTeams.map(pod => ({
  "POD ID": pod.id,
  "POD Name": pod.name,
  "Description": pod.description,
  "Color": pod.color
}));
const cfPodsSheet = XLSX.utils.json_to_sheet(cfPodsData);
XLSX.utils.book_append_sheet(workbook, cfPodsSheet, "Cross-Functional PODs");

// Sheet 4: Cross-Functional Members
const cfMembersData = [];
crossFunctionalTeams.forEach(pod => {
  pod.team.forEach(member => {
    cfMembersData.push({
      "POD ID": pod.id,
      "POD Name": pod.name,
      "Member Name": member.name,
      "Role": member.role,
      "Status": member.status
    });
  });
});
const cfMembersSheet = XLSX.utils.json_to_sheet(cfMembersData);
XLSX.utils.book_append_sheet(workbook, cfMembersSheet, "Cross-Functional Members");

// Sheet 5: Summary by Release
const releases = ["IR3.1", "IR3.2", "IR3.3", "IR4"];
const summaryData = releases.map(release => {
  const releasePods = devPods.filter(p => p.release === release);
  const allMembers = releasePods.flatMap(p => p.team);
  return {
    "Release": release,
    "Total PODs": releasePods.length,
    "Leads": allMembers.filter(m => m.role === "Lead" && m.status === "Active").length,
    "Onshore SAs": allMembers.filter(m => m.role === "Onshore Solution Analyst" && m.status === "Active").length,
    "Offshore SAs": allMembers.filter(m => m.role === "Offshore Solution Analyst" && m.status === "Active").length,
    "Devs": allMembers.filter(m => m.role === "Dev" && m.status === "Active").length,
    "QAs": allMembers.filter(m => m.role === "QA" && m.status === "Active").length,
    "TBD/Open": allMembers.filter(m => m.name === "TBD").length
  };
});
const summarySheet = XLSX.utils.json_to_sheet(summaryData);
XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary by Release");

// Write the file
XLSX.writeFile(workbook, "public/team-structure-data-export.xlsx");

console.log("Excel file exported successfully to public/team-structure-data-export.xlsx");
