import { useQuery } from "@tanstack/react-query";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import { getEngagementLabel, formatRelativeTime, getEventLabel } from "../lib/utils";
import {
  Mail, Eye, MousePointer, FileSearch, TrendingUp,
  Activity, Send
} from "lucide-react";
import { DashboardLayout } from "../components/dashboard-layout";

const tooltipStyle = {
  background: "var(--surface-overlay)",
  border: "1px solid var(--border)",
  borderRadius: 6,
  padding: "8px 12px",
  fontSize: 12,
  color: "var(--text)",
  boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
};

function StatCard({ label, value, sub, loading }: {
  label: string; value: string | number; sub?: string; loading: boolean;
}) {
  return (
    <div style={{
      background: "var(--surface-raised)",
      border: "1px solid var(--border)",
      borderRadius: 8,
      padding: "16px 20px",
    }}>
      {loading ? (
        <>
          <div className="skeleton" style={{ width: "55%", height: 12, borderRadius: 4, marginBottom: 10 }} />
          <div className="skeleton" style={{ width: "35%", height: 24, borderRadius: 4 }} />
        </>
      ) : (
        <>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, fontWeight: 500 }}>{label}</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: "var(--text)", lineHeight: 1, letterSpacing: "-0.02em" }}>
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
          {sub && <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 6 }}>{sub}</div>}
        </>
      )}
    </div>
  );
}

function EventIcon({ type }: { type: string }) {
  const map: Record<string, any> = {
    open: Eye,
    click: MousePointer,
    resume_view: FileSearch,
    send: Send,
  };
  const Icon = map[type] || Mail;
  return <Icon size={13} color="var(--text-tertiary)" />;
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/analytics/dashboard", { credentials: "include" });
      return res.json();
    },
    refetchInterval: 30000,
  });

  const stats = data as any;

  const statsCards = [
    { label: "Emails Sent", value: stats?.totalEmails ?? 0, sub: "All time" },
    { label: "Total Opens", value: stats?.totalOpens ?? 0, sub: `${stats?.openRate ?? 0}% open rate` },
    { label: "Click Rate", value: `${stats?.clickRate ?? 0}%`, sub: "Unique clicks" },
    { label: "Resume Views", value: stats?.resumeViews ?? 0, sub: "Tracked views" },
    { label: "Avg Score", value: stats?.avgEngagementScore ?? 0, sub: getEngagementLabel(stats?.avgEngagementScore ?? 0).label },
    { label: "Portfolio Clicks", value: stats?.portfolioClicks ?? 0, sub: "Total visits" },
  ];

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1100 }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
            Dashboard
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
            Real-time recruiter engagement overview
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 20 }}>
          {statsCards.map((s) => (
            <StatCard key={s.label} {...s} loading={isLoading} />
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 16 }}>
          {/* Area chart */}
          <div style={{
            background: "var(--surface-raised)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "20px 20px 16px",
          }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>
                Engagement — Last 7 Days
              </div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Opens & clicks over time</div>
            </div>
            {isLoading ? (
              <div className="skeleton" style={{ height: 180, borderRadius: 6 }} />
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={stats?.last7Days || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gOpens" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF4D00" stopOpacity={0.06} />
                      <stop offset="100%" stopColor="#FF4D00" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a1a1aa" stopOpacity={0.06} />
                      <stop offset="100%" stopColor="#a1a1aa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--border)" }} />
                  <Area type="monotone" dataKey="opens" stroke="#FF4D00" strokeWidth={1.5} fill="url(#gOpens)" name="Opens" dot={false} />
                  <Area type="monotone" dataKey="clicks" stroke="#a1a1aa" strokeWidth={1.5} fill="url(#gClicks)" name="Clicks" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Best send time */}
          <div style={{
            background: "var(--surface-raised)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "20px 20px 16px",
          }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>Best Send Time</div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Opens by hour</div>
            </div>
            {isLoading ? (
              <div className="skeleton" style={{ height: 180, borderRadius: 6 }} />
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={(stats?.hourlyData || []).filter((_: any, i: number) => i % 3 === 0)} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fill: "var(--text-tertiary)", fontSize: 10 }} axisLine={false} tickLine={false}
                    tickFormatter={(h: number) => `${h}h`} />
                  <YAxis tick={{ fill: "var(--text-tertiary)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" name="Opens" radius={[3, 3, 0, 0]}>
                    {(stats?.hourlyData || []).filter((_: any, i: number) => i % 3 === 0).map((_: any, i: number) => (
                      <Cell key={i} fill={i % 4 === 0 ? "#FF4D00" : "var(--border-strong)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Activity feed */}
        <div style={{
          background: "var(--surface-raised)",
          border: "1px solid var(--border)",
          borderRadius: 8,
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>Activity</div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Real-time recruiter interactions</div>
            </div>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
          </div>

          {isLoading ? (
            <div style={{ padding: "0 20px" }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                  <div className="skeleton" style={{ width: 28, height: 28, borderRadius: 6, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ width: "45%", height: 12, borderRadius: 4, marginBottom: 6 }} />
                    <div className="skeleton" style={{ width: "30%", height: 10, borderRadius: 4 }} />
                  </div>
                  <div className="skeleton" style={{ width: 60, height: 10, borderRadius: 4 }} />
                </div>
              ))}
            </div>
          ) : !stats?.recentEvents?.length ? (
            <div style={{ padding: "48px 20px", textAlign: "center" }}>
              <Activity size={28} color="var(--text-tertiary)" style={{ marginBottom: 12 }} />
              <p style={{ color: "var(--text-secondary)", fontSize: 14, fontWeight: 500, margin: "0 0 6px" }}>No activity yet</p>
              <p style={{ color: "var(--text-tertiary)", fontSize: 12, margin: 0 }}>
                Send your first cold email to start tracking.
              </p>
            </div>
          ) : (
            <div style={{ maxHeight: 340, overflow: "auto" }}>
              {stats.recentEvents.map((event: any, i: number) => (
                <div
                  key={event.id}
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                    padding: "11px 20px",
                    borderBottom: i < stats.recentEvents.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: "var(--surface-overlay)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <EventIcon type={event.type} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {getEventLabel(event.type)}{" "}
                      <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>{event.emailSubject}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>
                      {event.emailTo}{event.deviceType ? ` · ${event.deviceType}` : ""}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: "var(--text-tertiary)", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {formatRelativeTime(event.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
