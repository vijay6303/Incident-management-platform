import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  createIncident,
  triageIncident,
  type TriageResponse,
} from "../api/incidentApi";
import type { IncidentPriority } from "../types/incident";
import "../styles/forms.css";

export default function CreateIncident() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<IncidentPriority>("MEDIUM");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [triage, setTriage] = useState<TriageResponse | null>(null);

  async function handleTriage() {
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Enter the incident title and description before using AI triage.");
      return;
    }

    setAiLoading(true);
    setTriage(null);

    try {
      const result = await triageIncident({
        title: title.trim(),
        description: description.trim(),
      });

      setTriage(result);
    } catch {
      setError("AI triage is currently unavailable. Please try again.");
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    setLoading(true);

    try {
      await createIncident({
        title: title.trim(),
        description: description.trim(),
        priority,
      });

      navigate("/dashboard");
    } catch {
      setError("Unable to create the incident. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="form-page">
      <div className="form-card">
        <Link to="/dashboard">← Back to dashboard</Link>

        <h1>Create Incident</h1>
        <p>Describe the issue you need help resolving.</p>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Incident title</label>
          <input
            id="title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setTriage(null);
            }}
            maxLength={140}
            placeholder="e.g. Unable to access application"
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              setTriage(null);
            }}
            rows={5}
            maxLength={3000}
            placeholder="Describe the issue and its impact..."
            required
          />

          <button
            type="button"
            onClick={handleTriage}
            disabled={aiLoading || loading}
          >
            {aiLoading ? "Analyzing incident..." : "✨ AI Triage"}
          </button>

          {triage && (
            <section
              className="ai-triage-result"
              aria-live="polite"
            >
              <h2>AI Triage Recommendations</h2>

              <p>
                <strong>Category:</strong> {triage.category}
              </p>

              <p>
                <strong>Suggested priority:</strong>{" "}
                {triage.suggestedPriority}
              </p>

              <p>
                <strong>Summary:</strong> {triage.summary}
              </p>

              <h3>Recommended actions</h3>
              <ul>
                {triage.suggestedActions.map((action, index) => (
                  <li key={`${index}-${action}`}>{action}</li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setPriority(triage.suggestedPriority)}
              >
                Apply Suggested Priority
              </button>

              <p className="ai-disclaimer">
                AI-generated recommendations may be inaccurate. Review them
                before taking action.
              </p>
            </section>
          )}

          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as IncidentPriority)
            }
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>

          <button type="submit" disabled={loading || aiLoading}>
            {loading ? "Creating..." : "Create Incident"}
          </button>
        </form>
      </div>
    </main>
  );
}