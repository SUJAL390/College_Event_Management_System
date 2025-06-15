export type UserRole = "student" | "admin";

export interface User {
  id: number;
  email: string;
  username: string;
  is_admin: boolean;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  capacity: number;
  category: string;
  image_url: string | null;
  created_by: number;
  created_at: string;
}

export interface Registration {
  id: number;
  user_id: number;
  event_id: number;
  registration_date: string; // ISO string
  check_in_time: string | null;
  unique_code: string;
  qr_code_url: string; // relative path like "/static/qrcodes/..."
}

export interface BugReport {
  id: string;
  title: string;
  description: string;
  submittedBy: string;
  submittedDate: string;
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
}
