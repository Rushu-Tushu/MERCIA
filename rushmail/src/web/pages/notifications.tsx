import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import { Bell, Eye, MousePointer, FileSearch, MessageCircle, AlertTriangle, Info } from "lucide-react";

const TYPE_CONFIG: Record<string, { color: string; Icon: any; label: string }> = {
  email_opened: { color: "#FF4D00", Icon: Eye, label: "Opened" },
  email_clicked: { color: "#22c55e", Icon: MousePointer, label: "Clicked" },
  resume_viewed: { color: "#a1a1aa", Icon: FileSearch, label: "Resume" },
  reply_received: { color: "#22c55e", Icon: MessageCircle, label: "Reply" },
  ghosted: { color: "#ef4444", Icon: AlertTriangle, label: "Ghosted" },
  system: { color: "#a1a1aa", Icon: Info, label: "System" },
};

function timeAgo(date: string | number) {
  const diff = Date.now() - new Date(date).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const r = await fetch("/api/notifications", { credentials: "include" });
      const d: any = await r.json();
      setNotifications(d.notifications || []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "POST", credentials: "include" });
      setNotifications(ns => ns.map(n => ({ ...n, read: true })));
    } catch {}
  };

  const markRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "POST", credentials: "include" });
      setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
    } catch {}
  };

  const unread = notifications.filter(n => !n.read).length;
  const types = ["all", ...Array.from(new Set(notifications.map(n => n.type)))];
  const filtered = filter === "all" ? notifications : notifications.filter(n => n.type === filter);

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 720 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", margin: 0, letterSpacing: "-0.02em" }}>Notifications</h1>
              {unread > 0 && (
                <span style={{
                  background: "#ef4444", color: "white", borderRadius: 10,
                  padding: "2px 8px", fontSize: 11, fontWeight: 600,
                }}>{unread}</span>
              )}
            </div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0 0" }}>Real-time outreach activity</p>
          </div>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              style={{
                background: "var(--surface-overlay)", color: "var(--text-secondary)",
                border: "1px solid var(--border)", borderRadius: 6, padding: "7px 14px",
                cursor: "pointer", fontSize: 12, fontWeight: 500,
              }}
            >Mark all read</button>
          )}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {types.map((t) => {
            const cfg = TYPE_CONFIG[t];
            return (
              <button
                key={t}
                onClick={() => setFilter(t)}
                style={{
                  background: filter === t ? "var(--accent-subtle)" : "var(--surface-overlay)",
                  color: filter === t ? "var(--accent)" : "var(--text-secondary)",
                  border: `1px solid ${filter === t ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: 6, padding: "5px 12px", cursor: "pointer",
                  fontSize: 12, fontWeight: 500, transition: "all 0.15s",
                }}
              >
                {t === "all" ? "All" : cfg?.label || t.replace(/_/g, " ")}
              </button>
            );
          })}
        </div>

        {/* List */}
        {loading ? (
          <div style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", gap: 12, alignItems: "center" }}>
                <div className="skeleton" style={{ width: 30, height: 30, borderRadius: 6, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ width: "50%", height: 13, borderRadius: 4, marginBottom: 6 }} />
                  <div className="skeleton" style={{ width: "30%", height: 11, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            background: "var(--surface-raised)", border: "1px solid var(--border)",
            borderRadius: 8, padding: "48px 20px", textAlign: "center",
          }}>
            <Bell size={32} color="var(--text-tertiary)" style={{ marginBottom: 12 }} />
            <div style={{ fontWeight: 500, fontSize: 14, color: "var(--text)", marginBottom: 6 }}>No notifications</div>
            <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>
              {filter === "all" ? "Send some cold emails to start tracking activity" : `No ${filter.replace(/_/g, " ")} notifications yet`}
            </div>
          </div>
        ) : (
          <div style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8 }}>
            {filtered.map((n, i) => {
              const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
              const { Icon } = cfg;
              return (
                <div
                  key={n.id}
                  onClick={() => !n.read && markRead(n.id)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "13px 20px",
                    borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                    background: n.read ? "transparent" : "rgba(255,77,0,0.04)",
                    cursor: n.read ? "default" : "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 30, height: 30, borderRadius: 6, flexShrink: 0,
                    background: "var(--surface-overlay)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={13} color={cfg.color} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 500, color: "var(--text)", marginBottom: 2 }}>
                      {n.message || n.title}
                    </div>
                    {n.body && <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{n.body}</div>}
                  </div>

                  {/* Right */}
                  <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{timeAgo(n.createdAt)}</div>
                    {!n.read && (
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
                    )}
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
