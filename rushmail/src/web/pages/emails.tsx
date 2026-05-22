import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { DashboardLayout } from "../components/dashboard-layout";
import { getEngagementLabel, formatRelativeTime } from "../lib/utils";
import { Send, Eye, MousePointer, ChevronRight, Mail } from "lucide-react";

export default function EmailsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["emails"],
    queryFn: async () => {
      const res = await fetch("/api/emails", { credentials: "include" });
      return res.json();
    },
  });

  const emails = (data as any)?.emails || [];

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 900 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Emails</h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
              {emails.length} tracked email{emails.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link to="/compose">
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "var(--accent)", color: "white", padding: "8px 16px", borderRadius: 6,
              fontSize: 13, fontWeight: 500, cursor: "pointer",
            }}>
              <Send size={13} strokeWidth={2} />
              Compose
            </span>
          </Link>
        </div>

        {isLoading ? (
          <div style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
                <div className="skeleton" style={{ width: "35%", height: 13, borderRadius: 4, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: "22%", height: 11, borderRadius: 4 }} />
              </div>
            ))}
          </div>
        ) : emails.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "64px 20px",
            background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8,
          }}>
            <Mail size={36} color="var(--text-tertiary)" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", margin: "0 0 8px" }}>No emails sent yet</h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>
              Send your first cold email to start tracking.
            </p>
            <Link to="/compose">
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "var(--accent)", color: "white", padding: "8px 16px", borderRadius: 6,
                fontSize: 13, fontWeight: 500, cursor: "pointer",
              }}>
                <Send size={13} />
                Send First Email
              </span>
            </Link>
          </div>
        ) : (
          <div style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8 }}>
            {emails.map((email: any, i: number) => {
              const eng = getEngagementLabel(email.engagementScore);
              return (
                <div
                  key={email.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "13px 20px",
                    borderBottom: i < emails.length - 1 ? "1px solid var(--border)" : "none",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Icon */}
                  <div style={{
                    width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                    background: "var(--surface-overlay)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Send size={14} color={email.status === "sent" ? "var(--accent)" : "var(--text-tertiary)"} />
                  </div>

                  {/* Main info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {email.subject}
                      </span>
                      <span style={{
                        fontSize: 10, padding: "2px 6px", borderRadius: 4, flexShrink: 0,
                        background: email.status === "sent" ? "rgba(34,197,94,0.08)" : "var(--surface-overlay)",
                        color: email.status === "sent" ? "#22c55e" : "var(--text-tertiary)",
                        border: `1px solid ${email.status === "sent" ? "rgba(34,197,94,0.2)" : "var(--border)"}`,
                        fontWeight: 500,
                      }}>
                        {email.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
                      {email.to} · {formatRelativeTime(email.createdAt)}
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Eye size={12} color="var(--text-tertiary)" />
                      <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 500 }}>{email.openCount || 0}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <MousePointer size={12} color="var(--text-tertiary)" />
                      <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 500 }}>{email.clickCount || 0}</span>
                    </div>
                    <span style={{
                      padding: "3px 8px", borderRadius: 4, fontSize: 11, fontWeight: 500,
                      background: `${eng.color}12`, color: eng.color,
                      border: `1px solid ${eng.color}25`,
                    }}>
                      {email.engagementScore}
                    </span>
                    <ChevronRight size={13} color="var(--text-tertiary)" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
