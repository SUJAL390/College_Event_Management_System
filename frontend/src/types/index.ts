
export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  capacity: number;
  registered: number;
  imageUrl?: string;
  tags: string[];
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  registrationDate: string;
  attended: boolean;
  qrCode: string;
}

export interface BugReport {
  id: string;
  title: string;
  description: string;
  submittedBy: string;
  submittedDate: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
}
