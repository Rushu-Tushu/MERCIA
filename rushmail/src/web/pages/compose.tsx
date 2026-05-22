import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "../components/dashboard-layout";
import { Send, Save, FileText, Check, AlertCircle, ChevronDown, Mail } from "lucide-react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  background: "var(--surface-overlay)",
  border: "1px solid var(--border)",
  borderRadius: 6,
  color: "var(--text)",
  fontSize: 13,
  fontFamily: "Inter, sans-serif",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

export default function ComposePage() {
  const qc = useQueryClient();
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error" | "warn"; msg: string; detail?: string } | null>(null);

  const showToast = (type: "success" | "error" | "warn", msg: string, detail?: string) => {
    setToast({ type, msg, detail });
    setTimeout(() => setToast(null), type === "warn" ? 8000 : 4000);
  };

  const { data: templateData } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const res = await fetch("/api/templates", { credentials: "include" });
      return res.json();
    },
  });

  const { data: connectedData } = useQuery({
    queryKey: ["connected-accounts"],
    queryFn: async () => {
      const res = await fetch("/api/connected-accounts", { credentials: "include" });
      return res.json();
    },
  });

  const connectedAccounts: { id: string; provider: string; providerEmail: string }[] = (connectedData as any)?.accounts || [];
  const activeAccount = connectedAccounts.find(a => a.provider === "gmail") || connectedAccounts.find(a => a.provider === "outlook");

  const sendMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/emails/send", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, html: body }),
      });
      return res.json();
    },
    onSuccess: (data: any) => {
      if (data.success) {
        showToast("success", `Sent to ${to} via Gmail — tracking enabled`);
        setTo(""); setSubject(""); setBody("");
        qc.invalidateQueries({ queryKey: ["dashboard"] });
        qc.invalidateQueries({ queryKey: ["emails"] });
      } else if (data.message === "no_google_account") {
        showToast("error", "Sign in with Google first to send emails.");
      } else {
        showToast("error", data.message || "Send failed");
      }
    },
    onError: () => showToast("error", "Send failed. Try again."),
  });

  const draftMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/emails/draft", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, html: body }),
      });
      return res.json();
    },
    onSuccess: () => showToast("success", "Draft saved"),
  });

  const templates = (templateData as any)?.templates || [];

  const insertTemplate = (t: any) => {
    setSubject(t.subject);
    setBody(t.body);
    setShowTemplates(false);
  };

  const canSend = !sendMutation.isPending && to && subject && body;

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 720 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
            Compose
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
            Tracking pixels are injected automatically.
          </p>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                display: "flex", gap: 8, alignItems: "flex-start",
                background: toast.type === "success" ? "rgba(34,197,94,0.08)" : toast.type === "warn" ? "rgba(234,179,8,0.08)" : "rgba(239,68,68,0.08)",
                border: `1px solid ${toast.type === "success" ? "rgba(34,197,94,0.2)" : toast.type === "warn" ? "rgba(234,179,8,0.25)" : "rgba(239,68,68,0.2)"}`,
                borderRadius: 6, padding: "12px 14px", marginBottom: 16,
              }}
            >
              {toast.type === "success"
                ? <Check size={14} color="#22c55e" style={{ flexShrink: 0, marginTop: 1 }} />
                : toast.type === "warn"
                ? <AlertCircle size={14} color="#eab308" style={{ flexShrink: 0, marginTop: 1 }} />
                : <AlertCircle size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
              }
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: toast.type === "success" ? "#22c55e" : toast.type === "warn" ? "#eab308" : "#ef4444" }}>{toast.msg}</div>
                {toast.detail && <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.5 }}>{toast.detail}</div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{
          background: "var(--surface-raised)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: 24,
        }}>
          {/* Template picker */}
          <div style={{ marginBottom: 18 }}>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "var(--surface-overlay)", border: "1px solid var(--border)",
                borderRadius: 6, padding: "7px 12px", color: "var(--text-secondary)",
                fontSize: 12, fontWeight: 500, cursor: "pointer",
              }}
            >
              <FileText size={13} />
              Use Template
              <ChevronDown size={12} style={{ transform: showTemplates ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
            </button>

            <AnimatePresence>
              {showTemplates && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  style={{
                    marginTop: 8,
                    background: "var(--surface-overlay)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    overflow: "hidden",
                    maxHeight: 240,
                    overflowY: "auto",
                  }}
                >
                  {templates.length === 0 ? (
                    <div style={{ padding: "12px 16px", fontSize: 12, color: "var(--text-tertiary)" }}>No saved templates</div>
                  ) : templates.map((t: any) => (
                    <div
                      key={t.id}
                      onClick={() => insertTemplate(t)}
                      style={{
                        padding: "10px 14px", cursor: "pointer",
                        borderBottom: "1px solid var(--border)",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{t.subject}</div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Fields */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 11, color: "var(--text-tertiary)", marginBottom: 5, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>To</label>
            <input
              type="email"
              value={to}
              onChange={e => setTo(e.target.value)}
              placeholder="recruiter@company.com"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 11, color: "var(--text-tertiary)", marginBottom: 5, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Software Engineer Application — Your Name"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <label style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>Body</label>
              <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{body.length} chars</span>
            </div>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write your email here... HTML is supported."
              rows={12}
              style={{
                ...inputStyle,
                resize: "vertical",
                minHeight: 240,
                lineHeight: 1.6,
              }}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Sending from + Tracking notice */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
            {/* Sender badge */}
            <div style={{
              display: "flex", gap: 8, alignItems: "center",
              background: activeAccount ? "rgba(255,77,0,0.06)" : "var(--surface-overlay)",
              border: activeAccount ? "1px solid rgba(255,77,0,0.2)" : "1px solid var(--border)",
              borderRadius: 6, padding: "9px 14px",
            }}>
              <Mail size={13} color={activeAccount ? "var(--accent)" : "var(--text-tertiary)"} />
              <span style={{ fontSize: 12, color: activeAccount ? "var(--text)" : "var(--text-tertiary)" }}>
                {activeAccount
                  ? <>Sending from <strong style={{ fontFamily: "monospace" }}>{activeAccount.providerEmail}</strong> via Gmail</>
                  : "Sign in with Google to send emails from your Gmail"}
              </span>
            </div>

            {/* Tracking notice */}
            <div style={{
              display: "flex", gap: 8, alignItems: "center",
              background: "var(--surface-overlay)", border: "1px solid var(--border)",
              borderRadius: 6, padding: "9px 14px",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                Tracking pixel + link wrapping auto-injected on send.
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => sendMutation.mutate()}
              disabled={!canSend}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background: canSend ? "var(--accent)" : "var(--surface-overlay)",
                color: canSend ? "white" : "var(--text-tertiary)",
                border: "none",
                borderRadius: 6,
                padding: "10px",
                fontSize: 13,
                fontWeight: 500,
                cursor: canSend ? "pointer" : "not-allowed",
                transition: "opacity 0.15s",
              }}
            >
              {sendMutation.isPending ? (
                <>
                  <div style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={13} />
                  Send Email
                </>
              )}
            </button>

            <button
              onClick={() => draftMutation.mutate()}
              disabled={draftMutation.isPending}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "var(--surface-overlay)", border: "1px solid var(--border)",
                color: "var(--text-secondary)", borderRadius: 6, padding: "10px 18px",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
              }}
            >
              <Save size={13} />
              Save Draft
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}
