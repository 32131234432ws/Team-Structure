export interface FPLStaffMember {
  Name: string;
  Email?: string;
  Designation: string;
  Role: string;
  Workstream: string;
  Release: string;
  Valuestream: string;
  EndDate?: number | null;
}

import staffingData from "./fpl-staffing-data.json";

export const fplStaffingData: FPLStaffMember[] = staffingData as FPLStaffMember[];
