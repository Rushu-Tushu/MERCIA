import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import { authClient } from "../lib/auth";
import { Check, AlertCircle } from "lucide-react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--surface-overlay)",
  border: "1px solid var(--border)",
  borderRadius: 6,
  padding: "9px 12px",
  color: "var(--text)",
  fontSize: 13,
  fontFamily: "Inter, sans-serif",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  color: "var(--text-tertiary)",
  fontWeight: 500,
  display: "block",
  marginBottom: 5,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "var(--surface-raised)", border: "1px solid var(--border)",
      borderRadius: 8, padding: 24, marginBottom: 12,
    }}>
      {children}
    </div>
  );
}

function StatusMsg({ type, msg }: { type: "success" | "error"; msg: string }) {
  return (
    <div style={{
      display: "flex", gap: 7, alignItems: "center",
      color: type === "success" ? "#22c55e" : "#ef4444",
      fontSize: 12, marginBottom: 12,
    }}>
      {type === "success" ? <Check size={13} /> : <AlertCircle size={13} />}
      {msg}
    </div>
  );
}

export default function Settings() {
  const { data: session } = authClient.useSession();
  const [tab, setTab] = useState<"profile" | "preferences" | "account">("profile");

  const [profile, setProfile] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");



  useEffect(() => {
    if (session?.user) {
      setProfile({ name: session.user.name || "", email: session.user.email || "" });
    }
  }, [session]);

  const handleSaveProfile = async () => {
    setSaving(true); setError(""); setSaved(false);
    try {
      await authClient.updateUser({ name: profile.name });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };



  const handleDeleteAccount = async () => {
    if (!window.confirm("Delete your account? This is irreversible.")) return;
    try {
      await authClient.deleteUser();
      window.location.href = "/";
    } catch {
      alert("Failed to delete account.");
    }
  };



  const TABS = [
    { id: "profile", label: "Profile" },
    { id: "preferences", label: "Preferences" },
    { id: "account", label: "Account" },
  ] as const;

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 640 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Settings</h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>Manage your account and preferences</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, marginBottom: 20, background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 7, padding: 3, width: "fit-content" }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: tab === t.id ? "var(--surface-overlay)" : "transparent",
                color: tab === t.id ? "var(--text)" : "var(--text-secondary)",
                border: tab === t.id ? "1px solid var(--border)" : "1px solid transparent",
                borderRadius: 5, padding: "6px 16px",
                cursor: "pointer", fontWeight: tab === t.id ? 500 : 400,
                fontSize: 13, transition: "all 0.15s",
              }}
            >{t.label}</button>
          ))}
        </div>

        {/* Profile tab */}
        {tab === "profile" && (
          <>
            <SectionCard>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 18 }}>Personal Info</div>

              {/* Avatar */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "var(--accent-subtle)",
                  border: "1px solid var(--border-strong)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, fontWeight: 600, color: "var(--accent)",
                }}>
                  {(profile.name || "U")[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14, color: "var(--text)" }}>{profile.name || "Your Name"}</div>
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{profile.email}</div>
                </div>
              </div>

              {error && <StatusMsg type="error" msg={error} />}
              {saved && <StatusMsg type="success" msg="Profile updated" />}

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Display Name</label>
                  <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = "var(--accent)")} onBlur={e => (e.target.style.borderColor = "var(--border)")} />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input value={profile.email} disabled style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }} />
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 4 }}>Email cannot be changed</div>
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={saving}
                style={{ marginTop: 18, background: "var(--accent)", color: "white", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 500, cursor: "pointer", fontSize: 13 }}
              >{saving ? "Saving…" : "Save Changes"}</button>
            </SectionCard>


          </>
        )}

        {/* Preferences tab */}
        {tab === "preferences" && (
          <>
            {/* Gmail Account */}
            <SectionCard>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 6 }}>Gmail Account</div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14, marginTop: 4 }}>
                Your emails are sent directly from your Gmail account. Replies land in your inbox.
              </p>
              {session?.user ? (
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "var(--surface-overlay)", border: "1px solid var(--border)",
                  borderRadius: 6, padding: "10px 14px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 6,
                      background: "var(--accent-subtle)", border: "1px solid var(--border-strong)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>Gmail</div>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "monospace" }}>{session.user.email}</div>
                    </div>
                  </div>
                  <div style={{
                    background: "rgba(34,197,94,0.1)", color: "#22c55e",
                    border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 500,
                  }}>Active</div>
                </div>
              ) : null}
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 10 }}>
                To switch accounts, sign out and sign back in with a different Google account.
              </div>
            </SectionCard>

            <SectionCard>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 6 }}>Notification Events</div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16, marginTop: 4 }}>
                Choose what activity triggers a notification
              </p>
              {[
                { label: "Email opened", desc: "When a recruiter opens your email" },
                { label: "Resume viewed", desc: "When your tracking link is clicked" },
                { label: "Reply received", desc: "When you receive a reply (manual)" },
                { label: "Ghosted alert", desc: "7 days after open with no reply" },
              ].map((item, i, arr) => (
                <div key={item.label} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "11px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{item.desc}</div>
                  </div>
                  {/* Toggle (decorative) */}
                  <div style={{
                    width: 40, height: 22, borderRadius: 11,
                    background: "var(--accent-subtle)",
                    border: "1px solid var(--accent)",
                    cursor: "pointer", position: "relative", flexShrink: 0,
                  }}>
                    <div style={{
                      position: "absolute", right: 3, top: 3,
                      width: 14, height: 14, borderRadius: "50%", background: "var(--accent)",
                    }} />
                  </div>
                </div>
              ))}
            </SectionCard>
          </>
        )}

        {/* Account tab */}
        {tab === "account" && (
          <>
            <SectionCard>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 16 }}>Account Info</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { label: "User ID", value: session?.user?.id || "—", mono: true },
                  { label: "Email", value: session?.user?.email || "—", mono: false },
                  { label: "Member since", value: session?.user?.createdAt ? new Date(session.user.createdAt).toLocaleDateString() : "—", mono: false },
                ].map(({ label, value, mono }, i, arr) => (
                  <div key={label} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 0",
                    borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                  }}>
                    <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{label}</span>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: mono ? "monospace" : "inherit" }}>{value}</span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <div style={{
              background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: 8, padding: 24,
            }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#ef4444", marginBottom: 6 }}>Danger Zone</div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 18 }}>
                Deleting your account permanently removes all data — emails, templates, resumes, and analytics. This cannot be undone.
              </p>
              <button
                onClick={handleDeleteAccount}
                style={{
                  background: "rgba(239,68,68,0.08)", color: "#ef4444",
                  border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6,
                  padding: "8px 16px", cursor: "pointer", fontWeight: 500, fontSize: 13,
                }}
              >Delete My Account</button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
