export interface SubmittedUser {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Guest' | 'Editor' | 'Viewer';
  status: 'Active' | 'Inactive' | 'Pending';
  addedOn: string;
  initials: string;
  gradient: string;
}

export interface InitialUserRow {
  id: string;
  name: string;
  email: string;
  status: string;
  addedOn: string;
  role: string;
  avatar: string;
}

export interface EmailChipData {
  email: string;
  isValid: boolean;
}
