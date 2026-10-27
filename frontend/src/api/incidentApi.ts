import api from "./axios";
import type { Incident, IncidentPage } from "../types/incident";

export interface IncidentQuery {
  page?: number;
  size?: number;
  status?: string;
  sortBy?: string;
  direction?: "asc" | "desc";
}

export async function getIncidents(
  query: IncidentQuery = {}
): Promise<IncidentPage> {
  const response = await api.get<IncidentPage>("/incidents", {
    params: query,
  });

  return response.data;
}

export async function getIncident(id: number): Promise<Incident> {
  const response = await api.get<Incident>(`/incidents/${id}`);
  return response.data;
}

export async function createIncident(
  data: Pick<Incident, "title" | "description" | "priority">
): Promise<Incident> {
  const response = await api.post<Incident>("/incidents", data);
  return response.data;
}

export async function updateIncident(
  id: number,
  data: Partial<Pick<Incident, "title" | "description" | "priority" | "status" | "assigneeEmail">>
): Promise<Incident> {
  const response = await api.put<Incident>(`/incidents/${id}`, data);
  return response.data;
}
export interface TriageResponse {
  category: string;
  suggestedPriority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  summary: string;
  suggestedActions: string[];
}

export async function triageIncident(data: {
  title: string;
  description: string;
}): Promise<TriageResponse> {
  const response = await api.post<TriageResponse>("/ai/triage", data);
  return response.data;
}
