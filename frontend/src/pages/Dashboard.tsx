import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getIncidents } from "../api/incidentApi";
import type { Incident, IncidentStatus } from "../types/incident";
import "../styles/dashboard.css";
import { Link } from "react-router-dom";

const STATUSES: IncidentStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

type SortOption =
  | "priority-desc"
  | "priority-asc"
  | "createdAt-desc"
  | "createdAt-asc";

const PRIORITY_RANK: Record<Incident["priority"], number> = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export default function Dashboard() {
  const { logout } = useAuth();

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("createdAt-desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadIncidents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getIncidents({
        page,
        size: 10,
        sortBy: "createdAt",
        direction: "desc",
        ...(status ? { status } : {}),
      });

      setIncidents(result.content);
      setTotal(result.totalElements);
      setTotalPages(result.totalPages);
    } catch {
      setError("Unable to load incidents. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    void loadIncidents();
  }, [loadIncidents]);

  const sortedIncidents = [...incidents].sort((a, b) => {
    switch (sortOption) {
      case "priority-desc":
        return PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];

      case "priority-asc":
        return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];

      case "createdAt-asc":
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );

      case "createdAt-desc":
      default:
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
    }
  });

  const openCount = incidents.filter(
    (incident) => incident.status === "OPEN"
  ).length;

  const inProgressCount = incidents.filter(
    (incident) => incident.status === "IN_PROGRESS"
  ).length;

  const resolvedCount = incidents.filter(
    (incident) => incident.status === "RESOLVED"
  ).length;

  function handleStatusChange(value: string) {
    setPage(0);
    setStatus(value);
  }

  function handleSortChange(value: SortOption) {
    setPage(0);
    setSortOption(value);
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>IncidentFlow</h2>

        <nav>
          <Link className="active" to="/dashboard">
            Dashboard
          </Link>
          <a href="#incidents">Incidents</a>
          <Link to="/create-incident">Create Incident</Link>
        </nav>

        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Incident Dashboard</h1>
            <p>Monitor and manage your incidents.</p>
          </div>

          <button onClick={() => void loadIncidents()}>
            Refresh
          </button>
        </header>

        {error && (
          <div className="error-banner" role="alert">
            {error}
            <button onClick={() => void loadIncidents()}>Retry</button>
          </div>
        )}

        <section className="stats-grid">
          <article className="stat-card">
            <span>Total incidents</span>
            <strong>{total}</strong>
          </article>

          <article className="stat-card">
            <span>Open on this page</span>
            <strong>{openCount}</strong>
          </article>

          <article className="stat-card">
            <span>In progress on this page</span>
            <strong>{inProgressCount}</strong>
          </article>

          <article className="stat-card">
            <span>Resolved on this page</span>
            <strong>{resolvedCount}</strong>
          </article>
        </section>

        <section className="incident-panel" id="incidents">
          <div className="panel-header">
            <div>
              <h2>Recent incidents</h2>
              <p>{total} incident(s) found</p>
            </div>

            <div className="incident-filters">
              <select
                aria-label="Filter by status"
                value={status}
                onChange={(event) => handleStatusChange(event.target.value)}
              >
                <option value="">All statuses</option>
                {STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {item.replace("_", " ")}
                  </option>
                ))}
              </select>

              <select
                aria-label="Sort incidents"
                value={sortOption}
                onChange={(event) =>
                  handleSortChange(event.target.value as SortOption)
                }
              >
                <option value="createdAt-desc">Newest first</option>
                <option value="createdAt-asc">Oldest first</option>
                <option value="priority-desc">Highest priority first</option>
                <option value="priority-asc">Lowest priority first</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="table-message">Loading incidents...</p>
          ) : sortedIncidents.length === 0 ? (
            <p className="table-message">No incidents found.</p>
          ) : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Incident</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Reporter</th>
                    <th>Created</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedIncidents.map((incident) => (
                    <tr key={incident.id}>
                      <td>#{incident.id}</td>
                      <td>
                        <Link
                          to={`/incidents/${incident.id}`}
                          className="incident-link"
                        >
                          {incident.title}
                        </Link>
                        <div className="description">
                          {incident.description}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`badge priority-${incident.priority.toLowerCase()}`}
                        >
                          {incident.priority}
                        </span>
                      </td>

                      <td>
                        <span className="badge status-badge">
                          {incident.status.replace("_", " ")}
                        </span>
                      </td>

                      <td>{incident.reporterEmail}</td>

                      <td>
                        {new Date(incident.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <footer className="pagination">
            <span>
              Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
            </span>

            <div>
              <button
                disabled={page === 0 || loading}
                onClick={() => setPage((current) => current - 1)}
              >
                Previous
              </button>

              <button
                disabled={page + 1 >= totalPages || loading}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </button>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}