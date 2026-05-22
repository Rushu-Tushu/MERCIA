import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardLayout } from "../components/dashboard-layout";

const HOURS = Array.from({ length: 24 }, (_, i) =>
  i === 0 ? "12am" : i < 12 ? `${i}am` : i === 12 ? "12pm" : `${i - 12}pm`
);
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const tooltipStyle = {
  background: "var(--surface-overlay)",
  border: "1px solid var(--border)",
  borderRadius: 6,
  padding: "8px 12px",
  fontSize: 12,
  color: "var(--text)",
};

function HeatCell({ value, max }: { value: number; max: number }) {
  const intensity = max > 0 ? value / max : 0;
  return (
    <div
      title={`${value} opens`}
      style={{
        width: 26,
        height: 26,
        borderRadius: 3,
        background: intensity > 0
          ? `rgba(255,77,0,${0.12 + intensity * 0.7})`
          : "var(--surface-overlay)",
        border: "1px solid var(--border)",
      }}
    />
  );
}

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/analytics/dashboard", { credentials: "include" })
      .then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then((d: any) => { setData(d); setLoading(false); })
      .catch(() => { setError("Failed to load analytics"); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
          <div style={{ width: 28, height: 28, border: "2px solid var(--border)", borderTop: "2px solid var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <div style={{ padding: 24, color: "#ef4444", fontSize: 13 }}>{error || "No data"}</div>
      </DashboardLayout>
    );
  }

  const statItems = [
    { label: "Emails Sent", value: data.totalEmails },
    { label: "Unique Opens", value: data.uniqueOpens },
    { label: "Open Rate", value: `${data.openRate}%` },
    { label: "Click Rate", value: `${data.clickRate}%` },
    { label: "Resume Views", value: data.resumeViews },
    { label: "Avg Score", value: data.avgEngagementScore },
  ];

  const hourlyData: { hour: number; count: number }[] = data.hourlyData || [];
  const trendData: { date: string; opens: number; clicks: number }[] = data.last7Days || [];

  const heatGrid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  (data.recentEvents || []).forEach((e: any) => {
    if (e.type === "open") {
      const d = new Date(e.createdAt);
      heatGrid[d.getDay()][d.getHours()]++;
    }
  });
  const heatMax = Math.max(1, ...heatGrid.flat());

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Analytics</h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>Track your outreach performance</p>
        </div>

        {/* Stat row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 16 }}>
          {statItems.map((s) => (
            <div key={s.label} style={{
              background: "var(--surface-raised)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "14px 16px",
            }}>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 6, fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Trend chart */}
        <div style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8, padding: "20px 20px 16px", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>Engagement Trend — Last 7 Days</div>
          <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 16 }}>Opens and clicks over time</div>
          {trendData.every(d => d.opens === 0 && d.clicks === 0) ? (
            <div style={{ color: "var(--text-tertiary)", fontSize: 13, padding: "20px 0" }}>No activity in the last 7 days.</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
                <YAxis tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="opens" stroke="#FF4D00" fill="url(#gOpens)" strokeWidth={1.5} dot={false} name="Opens" />
                <Area type="monotone" dataKey="clicks" stroke="#a1a1aa" fill="url(#gClicks)" strokeWidth={1.5} dot={false} name="Clicks" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          {/* Hourly bar */}
          <div style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8, padding: "20px 20px 16px" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>Opens by Hour</div>
            <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 16 }}>Best time to send</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={hourlyData.filter((_, i) => i % 2 === 0)} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="hour" tickFormatter={(h) => HOURS[h]} tick={{ fill: "var(--text-tertiary)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-tertiary)", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any, _: any, p: any) => [v, HOURS[p.payload.hour]]} />
                <Bar dataKey="count" fill="#FF4D00" radius={[3, 3, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Heatmap */}
          <div style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8, padding: "20px 20px 16px" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>Send Day Heatmap</div>
            <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 16 }}>Opens by day & hour</div>
            <div style={{ overflowX: "auto" }}>
              <div style={{ display: "flex", gap: 3, marginBottom: 3, paddingLeft: 32 }}>
                {[0, 3, 6, 9, 12, 15, 18, 21].map((h) => (
                  <div key={h} style={{ width: 26, fontSize: 9, color: "var(--text-tertiary)", textAlign: "center" }}>{HOURS[h]}</div>
                ))}
              </div>
              {heatGrid.map((row, di) => (
                <div key={di} style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 3 }}>
                  <div style={{ width: 28, fontSize: 10, color: "var(--text-tertiary)", fontWeight: 500 }}>{DAYS[di]}</div>
                  {[0, 3, 6, 9, 12, 15, 18, 21].map((h) => (
                    <HeatCell key={h} value={row[h]} max={heatMax} />
                  ))}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-tertiary)" }}>Darker = more opens</div>
          </div>
        </div>

        {/* Activity table */}
        <div style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8 }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>Recent Activity</div>
          </div>
          {!(data.recentEvents || []).length ? (
            <div style={{ color: "var(--text-tertiary)", fontSize: 13, padding: "24px 20px" }}>No activity yet.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Event", "Recipient", "Subject", "Time"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 20px", fontSize: 11, color: "var(--text-tertiary)", fontWeight: 500, borderBottom: "1px solid var(--border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data.recentEvents || []).map((e: any, i: number) => (
                  <tr key={e.id} style={{ borderBottom: i < data.recentEvents.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <td style={{ padding: "10px 20px" }}>
                      <span style={{
                        background: "var(--surface-overlay)",
                        color: "var(--text-secondary)",
                        borderRadius: 4,
                        padding: "2px 8px",
                        fontSize: 11,
                        fontWeight: 500,
                        border: "1px solid var(--border)",
                      }}>
                        {e.type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td style={{ padding: "10px 20px", fontSize: 12, color: "var(--text-secondary)" }}>{e.emailTo || "—"}</td>
                    <td style={{ padding: "10px 20px", fontSize: 12, color: "var(--text-secondary)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.emailSubject || "—"}</td>
                    <td style={{ padding: "10px 20px", fontSize: 11, color: "var(--text-tertiary)" }}>
                      {new Date(e.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
