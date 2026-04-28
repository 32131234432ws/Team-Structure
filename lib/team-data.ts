export interface TeamMember {
  name: string;
  role: "Lead" | "Onshore Solution Analyst" | "Offshore Solution Analyst" | "Dev" | "QA" | "Team" | "Program Lead" | "PMO" | "Architecture" | "QA Lead" | "Intern";
  status: "Active" | "Planned" | "Open";
  valueStreams?: string[]; // For QA execution team to show which value streams they support
}

// Leadership team interface
export interface LeadershipMember {
  name: string;
  role: "Lead" | "Architect" | "DevOps Lead" | "PMO";
  subRole?: string; // For architect types: Technical Architect, Solution Architect, Business Architect
  status: "Active" | "Planned" | "Open";
}

// Leadership team data
export const leadershipTeam: LeadershipMember[] = [
  { name: "Ted Capaldi", role: "Lead", status: "Active" },
  { name: "Matthew Rupas", role: "Lead", status: "Active" },
  { name: "Sujith Pillai", role: "Lead", status: "Active" },
  { name: "Anto Germans", role: "Lead", status: "Active" },
  { name: "Hemant Jain", role: "Architect", subRole: "Technical Architect", status: "Active" },
  { name: "Tyaga Pati", role: "Architect", subRole: "Solution Architect", status: "Active" },
  { name: "Susan Matthews", role: "Architect", subRole: "Business Architect", status: "Active" },
  { name: "Ritesh Nanda", role: "DevOps Lead", status: "Active" },
  { name: "Shanta Samlal", role: "PMO", status: "Active" },
  { name: "Paarth Sonwaney", role: "PMO", status: "Active" },
  { name: "Courtney Hawkins", role: "PMO", status: "Active" },
];

// Interns data
export const interns: { name: string; team: string; status: "Active" | "Planned" }[] = [
  { name: "TBD", team: "Development", status: "Planned" },
];

export interface DevPod {
  id: string;
  name: string;
  valueStream: string;
  description: string;
  team: TeamMember[];
  color: string;
  release: "IR3.2" | "IR3.3" | "IR4";
  badges?: string[];
}

export const devPods: DevPod[] = [
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
      { name: "Amarjeet Singh", role: "Dev", status: "Active" },
      { name: "Ankit Mishra", role: "Dev", status: "Active" },
      { name: "Pranay Reddy", role: "Dev", status: "Active" },
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

export const roleColors: Record<TeamMember["role"], string> = {
  Lead: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Onshore Solution Analyst": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Offshore Solution Analyst": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Dev: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  QA: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  Team: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Program Lead": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  PMO: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Architecture: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "QA Lead": "bg-red-500/20 text-red-400 border-red-500/30",
  Intern: "bg-lime-500/20 text-lime-400 border-lime-500/30",
};

export const leadershipRoleColors: Record<LeadershipMember["role"], string> = {
  Lead: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Architect: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "DevOps Lead": "bg-sky-500/20 text-sky-400 border-sky-500/30",
  PMO: "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

export const statusColors: Record<TeamMember["status"], string> = {
  Active: "bg-emerald-500",
  Planned: "bg-amber-500",
  Open: "bg-muted-foreground",
};

// Cross-functional teams that work across all releases
export interface CrossFunctionalTeam {
  id: string;
  name: string;
  description: string;
  color: string;
  team: TeamMember[];
}

// SIT/UAT Execution Team - standalone QA pod
export interface SitUatMember {
  name: string;
  role: "QA Lead" | "QA";
  status: "Active" | "Planned" | "Open";
  valueStreams: string[];
}

export const sitUatExecutionTeam: SitUatMember[] = [
  { name: "Shanta", role: "QA Lead", status: "Active", valueStreams: ["All Value Streams"] },
  { name: "Maneesha", role: "QA", status: "Active", valueStreams: ["Move In", "Move Out", "Transfer"] },
  { name: "Bhyravabhotla Naga Lakshmi Sirisha", role: "QA", status: "Active", valueStreams: ["Move In", "Move Out"] },
  { name: "Dnyanesh Prakash Painjan", role: "QA", status: "Active", valueStreams: ["Move In", "Transfer"] },
  { name: "Girlee Alvarado", role: "QA", status: "Active", valueStreams: ["Move Out", "Transfer"] },
  { name: "Venugopal Sinde", role: "QA", status: "Active", valueStreams: ["Move In", "Move Out"] },
  { name: "Raveendra Reddy", role: "QA", status: "Active", valueStreams: ["Transfer"] },
  { name: "Naga Srilekha Thummalacheruvu", role: "QA", status: "Active", valueStreams: ["Move In"] },
  { name: "ISH Jacinto", role: "QA", status: "Active", valueStreams: ["Move Out"] },
  { name: "Keerthana Manjunath", role: "QA", status: "Active", valueStreams: ["Transfer"] },
  { name: "Sonal Yadav", role: "QA", status: "Active", valueStreams: ["Move In", "Move Out"] },
  { name: "Argene Francisco", role: "QA", status: "Active", valueStreams: ["Move In", "Transfer"] },
  { name: "Sanjana", role: "QA", status: "Active", valueStreams: ["Interactions", "Search"] },
  { name: "Pratik Mahajan", role: "QA", status: "Active", valueStreams: ["Interactions", "Search"] },
  { name: "Nilesh", role: "QA", status: "Active", valueStreams: ["Account Maintenance"] },
  { name: "Pritam", role: "QA", status: "Active", valueStreams: ["Account Maintenance"] },
  { name: "Smita", role: "QA", status: "Active", valueStreams: ["Payment & Payment Options", "Billing Programs"] },
  { name: "Vidyashree", role: "QA", status: "Active", valueStreams: ["Payment & Payment Options"] },
  { name: "Prasanna", role: "QA", status: "Active", valueStreams: ["Billing Programs"] },
  { name: "Nikita", role: "QA", status: "Active", valueStreams: ["Payment & Payment Options"] },
  { name: "Akhil", role: "QA", status: "Active", valueStreams: ["Billing Programs"] },
  { name: "Grace Nazareno", role: "QA", status: "Active", valueStreams: ["Payment & Payment Options", "Billing Programs"] },
];

// Hypercare pods for IR3.2
export interface HypercarePod {
  id: string;
  name: string;
  valueStream: string;
  description: string;
  team: TeamMember[];
  color: string;
  release: "IR3.2-Hypercare" | "IR4-Hypercare";
  badges?: string[];
}

export const hypercarePods: HypercarePod[] = [
  {
    id: "hc-ir32-1",
    name: "IR3.2 Hypercare Support",
    valueStream: "Support",
    description: "Post-deployment support and issue resolution for IR3.2 features",
    color: "from-green-500/20 to-green-500/5",
    release: "IR3.2-Hypercare",
    badges: ["L2/L3 Support", "Bug Fixes", "Production Monitoring"],
    team: [
      { name: "Sneha Girigoudar", role: "Lead", status: "Active" },
      { name: "TBD", role: "Dev", status: "Open" },
      { name: "TBD", role: "QA", status: "Open" },
    ],
  },
];

export const crossFunctionalTeams: CrossFunctionalTeam[] = [
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
