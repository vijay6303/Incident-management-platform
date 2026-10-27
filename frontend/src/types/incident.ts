export type IncidentPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type IncidentStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export interface Incident {
  id: number;
  title: string;
  description: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  reporterEmail: string;
  assigneeEmail?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentPage {
  content: Incident[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}