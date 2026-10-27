import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { getIncident, updateIncident } from "../api/incidentApi";
import type {
  Incident,
  IncidentPriority,
  IncidentStatus,
} from "../types/incident";
import "../styles/forms.css";
const STATUSES: IncidentStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

const PRIORITIES: IncidentPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

export default function IncidentDetails() {
  const { id } = useParams<{ id: string }>();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<IncidentPriority>("MEDIUM");
  const [status, setStatus] = useState<IncidentStatus>("OPEN");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadIncident() {
      if (!id || !/^\d+$/.test(id)) {
        setError("Invalid incident ID.");
        setLoading(false);
        return;
      }

      try {
        const result = await getIncident(Number(id));

        if (!active) return;

        setIncident(result);
        setTitle(result.title);
        setDescription(result.description);
        setPriority(result.priority);
        setStatus(result.status);
      } catch {
        if (active) setError("Unable to load this incident.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadIncident();

    return () => {
      active = false;
    };
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!incident) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updated = await updateIncident(incident.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        assigneeEmail: incident.assigneeEmail,
      });

      setIncident(updated);
      setTitle(updated.title);
      setDescription(updated.description);
      setPriority(updated.priority);
      setStatus(updated.status);
      setSuccess("Incident updated successfully.");
    } catch {
      setError(
        "Unable to update this incident. Check your permissions and try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main className="form-page">Loading incident...</main>;
  }

  if (!incident) {
    return (
      <main className="form-page">
        <p className="error" role="alert">
          {error || "Incident not found."}
        </p>
        <Link to="/dashboard">Back to dashboard</Link>
      </main>
    );
  }

  return (
    <main className="form-page">
      <div className="form-card">
        <Link to="/dashboard">← Back to dashboard</Link>

        <h1>Incident #{incident.id}</h1>
        <p>Reported by {incident.reporterEmail}</p>

        {error && <p className="error" role="alert">{error}</p>}
        {success && <p className="success" role="status">{success}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            maxLength={200}
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            required
          />

          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as IncidentPriority)
            }
          >
            {PRIORITIES.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>

          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as IncidentStatus)
            }
          >
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {value.replace("_", " ")}
              </option>
            ))}
          </select>

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <p className="metadata">
          Created: {new Date(incident.createdAt).toLocaleString()}
        </p>
        <p className="metadata">
          Last updated: {new Date(incident.updatedAt).toLocaleString()}
        </p>
      </div>
    </main>
  );
}