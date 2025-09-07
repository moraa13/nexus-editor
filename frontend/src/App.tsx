import { useEffect, useState } from "react";
import { api } from "./lib/api";
import type { Project, UserProfile } from "./types";

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prj, prof] = await Promise.all([
        api.get<Project[]>("/projects/"),
        api.get<UserProfile[]>("/profiles/"),
      ]);
      setProjects(prj.data);
      setProfiles(prof.data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const addProject = async () => {
    if (!title.trim()) return;
    try {
      const { data } = await api.post<Project>("/projects/", { title, description });
      setProjects((prev) => [data, ...prev]);
      setTitle("");
      setDescription("");
    } catch (e: any) {
      alert(e?.message ?? "Failed to create project");
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${id}/`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      alert(e?.message ?? "Failed to delete project");
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={{ margin: 0 }}>Nexus — Projects & Profiles</h1>
        <small>API: {import.meta.env.VITE_API_URL}/api</small>
      </header>

      <section style={styles.card}>
        <h2 style={styles.h2}>Create Project</h2>
        <div style={styles.row}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.input}
          />
          <button onClick={addProject} style={styles.btn}>+ Add</button>
          <button onClick={load} style={styles.btnGhost}>Refresh</button>
        </div>
        {error && <p style={styles.error}>{error}</p>}
      </section>

      <div style={styles.grid}>
        <section style={styles.card}>
          <h2 style={styles.h2}>Projects</h2>
          {loading ? <p>Loading…</p> : null}
          {projects.length === 0 ? <p>No projects yet</p> : (
            <ul style={styles.list}>
              {projects.map((p) => (
                <li key={p.id} style={styles.item}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.title}</div>
                    <div style={{ opacity: 0.7 }}>{p.description}</div>
                  </div>
                  <button onClick={() => deleteProject(p.id)} style={styles.btnDanger}>Delete</button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section style={styles.card}>
          <h2 style={styles.h2}>User Profiles</h2>
          {profiles.length === 0 ? <p>No profiles</p> : (
            <ul style={styles.list}>
              {profiles.map((u) => (
                <li key={u.id} style={styles.item}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{u.display_name || "—"}</div>
                    <div style={{ opacity: 0.7 }}>{u.bio || ""}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: 16, fontFamily: "Inter, system-ui, Arial, sans-serif", color: "#eaeaea", background: "#0b0b0f", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  card: { background: "#15151c", borderRadius: 12, padding: 16, boxShadow: "0 0 0 1px #242436 inset" },
  h2: { margin: "0 0 12px 0" },
  row: { display: "flex", gap: 8, flexWrap: "wrap" },
  input: { flex: "1 1 220px", background: "#0f0f14", color: "white", border: "1px solid #2b2b36", borderRadius: 8, padding: "10px 12px" },
  btn: { background: "#3b82f6", border: "none", color: "white", borderRadius: 8, padding: "10px 14px", cursor: "pointer" },
  btnGhost: { background: "transparent", border: "1px solid #2b2b36", color: "white", borderRadius: 8, padding: "10px 14px", cursor: "pointer" },
  btnDanger: { background: "#ef4444", border: "none", color: "white", borderRadius: 8, padding: "8px 12px", cursor: "pointer" },
  list: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 },
  item: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0f0f14", padding: "10px 12px", border: "1px solid #2b2b36", borderRadius: 8 },
};

