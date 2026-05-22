import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DashboardLayout } from "../components/dashboard-layout";
import { FileSearch, Copy, Check, ExternalLink, Trash2, Plus, X } from "lucide-react";

const inputStyle: React.CSSProperties = {
  background: "var(--surface-overlay)",
  border: "1px solid var(--border)",
  borderRadius: 6,
  padding: "9px 12px",
  color: "var(--text)",
  fontSize: 13,
  fontFamily: "Inter, sans-serif",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

export default function Resume() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", url: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      const r = await fetch("/api/resumes", { credentials: "include" });
      const d: any = await r.json();
      setResumes(d.resumes || []);
    } catch {
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.url) { setError("Name and URL are required"); return; }
    try { new URL(form.url); } catch { setError("Enter a valid URL"); return; }
    setSaving(true); setError("");
    try {
      const r = await fetch("/api/resumes", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: form.name, url: form.url }),
      });
      const d: any = await r.json();
      if (d.resume) {
        setResumes(rs => [d.resume, ...rs]);
        setForm({ name: "", url: "" });
        setShowForm(false);
      } else {
        setError(d.error || "Failed to add resume");
      }
    } catch {
      setError("Failed to add resume");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/resumes/${id}`, { method: "DELETE", credentials: "include" });
      setResumes(rs => rs.filter(r => r.id !== id));
    } catch {}
  };

  const copyTrackingUrl = (trackingId: string) => {
    const url = `${window.location.origin}/api/track/resume/${trackingId}`;
    navigator.clipboard.writeText(url);
    setCopied(trackingId);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 860 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Resume Tracker</h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>Track when recruiters view your resume</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: showForm ? "var(--surface-overlay)" : "var(--accent)",
              color: showForm ? "var(--text-secondary)" : "white",
              border: showForm ? "1px solid var(--border)" : "none",
              borderRadius: 6, padding: "8px 14px", fontWeight: 500, cursor: "pointer", fontSize: 13,
            }}
          >
            {showForm ? <><X size={13} /> Cancel</> : <><Plus size={13} /> Add Resume</>}
          </button>
        </div>

        {/* Add form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden", marginBottom: 16 }}
            >
              <div style={{
                background: "var(--surface-raised)", border: "1px solid var(--border)",
                borderRadius: 8, padding: 20,
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 14 }}>Add Resume Link</div>
                {error && <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 10 }}>{error}</div>}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10, marginBottom: 14 }}>
                  <input
                    placeholder="Label (e.g. SWE Resume v3)"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    style={inputStyle}
                  />
                  <input
                    placeholder="Resume URL (Google Drive, Notion, etc.)"
                    value={form.url}
                    onChange={e => setForm({ ...form, url: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button
                    onClick={handleAdd}
                    disabled={saving}
                    style={{ background: "var(--accent)", color: "white", border: "none", borderRadius: 6, padding: "8px 16px", fontWeight: 500, cursor: "pointer", fontSize: 13 }}
                  >{saving ? "Adding…" : "Add & Generate Tracking Link"}</button>
                  <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>We'll generate a tracked redirect URL</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resume list */}
        {loading ? (
          <div style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8 }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", gap: 14, alignItems: "center" }}>
                <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 6, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ width: "30%", height: 13, borderRadius: 4, marginBottom: 7 }} />
                  <div className="skeleton" style={{ width: "50%", height: 11, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div style={{
            background: "var(--surface-raised)", border: "1px solid var(--border)",
            borderRadius: 8, padding: "48px 20px", textAlign: "center",
          }}>
            <FileSearch size={32} color="var(--text-tertiary)" style={{ marginBottom: 12 }} />
            <div style={{ fontWeight: 500, fontSize: 14, color: "var(--text)", marginBottom: 6 }}>No resumes yet</div>
            <div style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 20 }}>Add a resume link to start tracking views</div>
            <button
              onClick={() => setShowForm(true)}
              style={{ background: "var(--accent)", color: "white", border: "none", borderRadius: 6, padding: "8px 16px", fontWeight: 500, cursor: "pointer", fontSize: 13 }}
            >Add Your First Resume</button>
          </div>
        ) : (
          <div style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8 }}>
            {resumes.map((r, i) => (
              <div
                key={r.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 20px",
                  borderBottom: i < resumes.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                  background: "var(--surface-overlay)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <FileSearch size={14} color="var(--text-secondary)" />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 13, color: "var(--text)", marginBottom: 3 }}>{r.filename}</div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.url}</div>
                </div>

                {/* Stats */}
                <div style={{ display: "flex", gap: 20, flexShrink: 0 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>{r.totalViews || 0}</div>
                    <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>Views</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>{r.totalDownloads || 0}</div>
                    <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>Downloads</div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => copyTrackingUrl(r.trackingId)}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      background: "var(--surface-overlay)",
                      color: copied === r.trackingId ? "#22c55e" : "var(--text-secondary)",
                      border: "1px solid var(--border)",
                      borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 500,
                    }}
                  >
                    {copied === r.trackingId ? <Check size={12} /> : <Copy size={12} />}
                    {copied === r.trackingId ? "Copied" : "Copy Link"}
                  </button>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      background: "var(--surface-overlay)", color: "var(--text-secondary)",
                      border: "1px solid var(--border)", borderRadius: 6,
                      padding: "6px 10px", fontSize: 12, textDecoration: "none",
                    }}
                  >
                    <ExternalLink size={12} />
                  </a>
                  <button
                    onClick={() => handleDelete(r.id)}
                    style={{
                      display: "flex", alignItems: "center",
                      background: "var(--surface-overlay)", color: "var(--text-tertiary)",
                      border: "1px solid var(--border)", borderRadius: 6,
                      padding: "6px 10px", cursor: "pointer",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-tertiary)")}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* How it works */}
        <div style={{
          marginTop: 20, background: "var(--surface-raised)", border: "1px solid var(--border)",
          borderRadius: 8, padding: 18,
        }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text)", marginBottom: 8 }}>How it works</div>
          <ol style={{ color: "var(--text-secondary)", fontSize: 12, lineHeight: 1.9, paddingLeft: 16, margin: 0 }}>
            <li>Add your resume URL (Google Drive, Dropbox, Notion, etc.)</li>
            <li>Copy the generated tracking link</li>
            <li>Use this link in your cold emails instead of the direct URL</li>
            <li>When a recruiter clicks, we log the view and redirect them transparently</li>
          </ol>
        </div>
      </div>
    </DashboardLayout>
  );
}
