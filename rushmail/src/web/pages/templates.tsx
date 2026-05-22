import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DashboardLayout } from "../components/dashboard-layout";
import { FileText, X, Plus } from "lucide-react";

const DEFAULT_TEMPLATES = [
  {
    id: "default-1",
    name: "Software Engineer – Intro",
    subject: "Interested in {role} at {company}",
    body: `Hi {firstName},\n\nI came across {company} and was really impressed by {something_specific}. I'm a software engineer with experience in {skills} and would love to explore opportunities on your team.\n\nI've attached my resume and would be happy to chat for 15 minutes at your convenience.\n\nBest,\n{yourName}`,
    tags: ["engineering", "intro"],
    isDefault: true,
  },
  {
    id: "default-2",
    name: "Follow-up (No Response)",
    subject: "Re: {role} at {company}",
    body: `Hi {firstName},\n\nJust following up on my previous email about the {role} position at {company}. I'm still very interested and would love to connect.\n\nDo you have 10 minutes this week?\n\nBest,\n{yourName}`,
    tags: ["follow-up"],
    isDefault: true,
  },
  {
    id: "default-3",
    name: "Product Manager – Value Prop",
    subject: "PM background that might interest {company}",
    body: `Hi {firstName},\n\nI've been following {company}'s growth in {space} and believe my background in product strategy and data-driven roadmapping could be a strong fit.\n\nSome quick highlights:\n• {achievement1}\n• {achievement2}\n• {achievement3}\n\nOpen to a quick call?\n\nBest,\n{yourName}`,
    tags: ["product", "intro"],
    isDefault: true,
  },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--surface-overlay)",
  border: "1px solid var(--border)",
  borderRadius: 6,
  padding: "9px 12px",
  color: "var(--text)",
  fontSize: 13,
  fontFamily: "Inter, sans-serif",
  boxSizing: "border-box",
  outline: "none",
};

export default function Templates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [form, setForm] = useState({ name: "", subject: "", body: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchTemplates(); }, []);

  const fetchTemplates = async () => {
    try {
      const r = await fetch("/api/templates", { credentials: "include" });
      const d: any = await r.json();
      setTemplates(d.templates || []);
    } catch {
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.name || !form.subject || !form.body) { setError("All fields required"); return; }
    setSaving(true); setError("");
    try {
      const r = await fetch("/api/templates", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d: any = await r.json();
      if (d.template) {
        setTemplates(t => [d.template, ...t]);
        setForm({ name: "", subject: "", body: "" });
        setShowCreate(false);
      }
    } catch {
      setError("Failed to create template");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/templates/${id}`, { method: "DELETE", credentials: "include" });
      setTemplates(t => t.filter(x => x.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {}
  };

  const allTemplates = [...DEFAULT_TEMPLATES, ...templates];

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Templates</h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>Reusable email templates</p>
          </div>
          <button
            onClick={() => { setShowCreate(true); setSelected(null); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "var(--accent)", color: "white", border: "none",
              borderRadius: 6, padding: "8px 14px", fontWeight: 500, cursor: "pointer", fontSize: 13,
            }}
          >
            <Plus size={14} />
            New Template
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: selected || showCreate ? "1fr 1.4fr" : "1fr", gap: 16, alignItems: "start" }}>
          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: selected || showCreate ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8, padding: 16, height: 100 }}>
                  <div className="skeleton" style={{ width: "60%", height: 13, borderRadius: 4, marginBottom: 8 }} />
                  <div className="skeleton" style={{ width: "80%", height: 11, borderRadius: 4 }} />
                </div>
              ))
            ) : allTemplates.map((t) => (
              <div
                key={t.id}
                onClick={() => { setSelected(t); setShowCreate(false); }}
                style={{
                  background: selected?.id === t.id ? "var(--accent-subtle)" : "var(--surface-raised)",
                  border: `1px solid ${selected?.id === t.id ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: 8, padding: "14px 16px", cursor: "pointer",
                  transition: "all 0.15s",
                  position: "relative",
                }}
                onMouseEnter={e => { if (selected?.id !== t.id) e.currentTarget.style.borderColor = "var(--border-strong)"; }}
                onMouseLeave={e => { if (selected?.id !== t.id) e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                {t.isDefault && (
                  <span style={{
                    fontSize: 10, background: "var(--surface-overlay)", color: "var(--text-tertiary)",
                    borderRadius: 4, padding: "1px 6px", fontWeight: 500, marginBottom: 6, display: "inline-block",
                    border: "1px solid var(--border)",
                  }}>DEFAULT</span>
                )}
                <div style={{ fontWeight: 500, fontSize: 13, color: "var(--text)", marginTop: t.isDefault ? 4 : 0, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.subject}</div>
                {t.tags && (
                  <div style={{ display: "flex", gap: 4, marginTop: 10, flexWrap: "wrap" }}>
                    {t.tags.map((tag: string) => (
                      <span key={tag} style={{ fontSize: 10, background: "var(--surface-overlay)", borderRadius: 4, padding: "2px 6px", color: "var(--text-tertiary)", border: "1px solid var(--border)" }}>#{tag}</span>
                    ))}
                  </div>
                )}
                {!t.isDefault && (
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(t.id); }}
                    style={{
                      position: "absolute", top: 10, right: 10,
                      background: "none", border: "none", color: "var(--text-tertiary)",
                      cursor: "pointer", padding: 4, borderRadius: 4, display: "flex", alignItems: "center",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-tertiary)")}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Detail / Create panel */}
          <AnimatePresence>
            {(selected || showCreate) && (
              <motion.div
                key={showCreate ? "create" : selected?.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                style={{
                  background: "var(--surface-raised)", border: "1px solid var(--border)",
                  borderRadius: 8, padding: 24,
                }}
              >
                {showCreate ? (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>New Template</div>
                      <button onClick={() => setShowCreate(false)} style={{ background: "none", border: "none", color: "var(--text-tertiary)", cursor: "pointer", padding: 2 }}>
                        <X size={16} />
                      </button>
                    </div>
                    {error && <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>{error}</div>}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 500, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Name</label>
                        <input placeholder="My template" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 500, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Subject</label>
                        <input placeholder="Subject with {variable} placeholders" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 500, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Body</label>
                        <textarea
                          placeholder="Email body…"
                          value={form.body}
                          onChange={e => setForm({ ...form, body: e.target.value })}
                          rows={10}
                          style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: 12, lineHeight: 1.6 }}
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                      <button
                        onClick={handleCreate}
                        disabled={saving}
                        style={{ background: "var(--accent)", color: "white", border: "none", borderRadius: 6, padding: "9px 18px", fontWeight: 500, cursor: "pointer", fontSize: 13 }}
                      >{saving ? "Saving…" : "Save Template"}</button>
                      <button
                        onClick={() => setShowCreate(false)}
                        style={{ background: "var(--surface-overlay)", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: 6, padding: "9px 18px", cursor: "pointer", fontSize: 13 }}
                      >Cancel</button>
                    </div>
                  </>
                ) : selected ? (
                  <>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{selected.name}</div>
                      <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "var(--text-tertiary)", cursor: "pointer", padding: 2 }}>
                        <X size={16} />
                      </button>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 500 }}>Subject</div>
                    <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 16, padding: "9px 12px", background: "var(--surface-overlay)", borderRadius: 6, border: "1px solid var(--border)" }}>{selected.subject}</div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 500 }}>Body</div>
                    <pre style={{
                      fontSize: 12, lineHeight: 1.7, color: "var(--text-secondary)",
                      whiteSpace: "pre-wrap", fontFamily: "monospace",
                      background: "var(--surface-overlay)", borderRadius: 6,
                      padding: 14, margin: 0, border: "1px solid var(--border)",
                      maxHeight: 320, overflow: "auto",
                    }}>{selected.body}</pre>
                    <button
                      onClick={() => { window.location.href = `/compose?templateId=${selected.id}`; }}
                      style={{ marginTop: 18, background: "var(--accent)", color: "white", border: "none", borderRadius: 6, padding: "9px 18px", fontWeight: 500, cursor: "pointer", fontSize: 13, width: "100%" }}
                    >
                      <FileText size={13} style={{ marginRight: 6, verticalAlign: "middle" }} />
                      Use This Template
                    </button>
                  </>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
