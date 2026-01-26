export interface FilterOptions {
  skills: Array<{skill_id: number, title: string}>;
  // locations: string[];
  // userTypes: ('COACH' | 'MEMBER')[];
}

export interface ActiveFilters {
  skills: number[];
  // location: string;
  // userType: 'COACH' | 'MEMBER' | 'ALL';
}
