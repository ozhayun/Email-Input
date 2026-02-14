export interface User {
    id: string;
    name: string;
    email: string;
    status: 'Active' | 'Inactive' | 'Pending';
    addedOn: string;
    role: 'Admin' | 'Editor' | 'Viewer' | 'Guest';
    avatar: string;
}

export interface EmailChipData {
    email: string;
    isValid: boolean;
}
