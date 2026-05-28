import { useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "../lib/auth";
import { AlertCircle, BarChart3, Mail, TrendingUp } from "lucide-react";

const ORANGE = "#FF4D00";

function LeftPanel() {
  return (
    <div style={{
      flex: 1,
      background: "#0a0a0d",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "40px 44px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -80, left: -80,
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,77,0,0.06) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
        <div style={{
          width: 26, height: 26, borderRadius: 6,
          display: "flex", alignItems: "center", justifyContent: "center",
          filter: "drop-shadow(0 0 6px rgba(255,77,0,0.55))",
        }}>
          <img src="/logo.svg" alt="Merica" style={{ width: 22, height: 22, filter: "brightness(0) saturate(100%) invert(35%) sepia(96%) saturate(2000%) hue-rotate(5deg) brightness(105%)" }} />
        </div>
        <span style={{ fontWeight: 600, fontSize: 15, color: "#fafafa", letterSpacing: "-0.02em" }}>Merica</span>
      </div>

      {/* Headline */}
      <div style={{ position: "relative" }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
          color: ORANGE, textTransform: "uppercase", marginBottom: 14,
        }}>Cold Outreach Intelligence</div>
        <h2 style={{
          fontSize: 26, fontWeight: 700, letterSpacing: "-0.035em",
          color: "#fafafa", lineHeight: 1.25, margin: "0 0 14px",
        }}>
          Know exactly when<br />recruiters engage.
        </h2>
        <p style={{
          fontSize: 13.5, color: "rgba(255,255,255,0.45)",
          lineHeight: 1.65, letterSpacing: "-0.01em", margin: 0, maxWidth: 320,
        }}>
          Send tracked cold emails directly from your Gmail. Real-time opens, clicks, and engagement scoring.
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
          {[
            { icon: Mail, label: "247 emails", sub: "tracked" },
            { icon: TrendingUp, label: "74.1%", sub: "open rate" },
            { icon: BarChart3, label: "Score 94", sub: "top lead" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} style={{
              flex: 1,
              background: "#141418",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 8, padding: "10px 12px",
            }}>
              <Icon size={12} color="rgba(255,255,255,0.3)" style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fafafa", letterSpacing: "-0.02em" }}>{label}</div>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity feed */}
      <div style={{
        background: "#141418",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 9, padding: "14px 16px",
        position: "relative",
      }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginBottom: 11 }}>
          Recent activity
        </div>
        {[
          { dot: ORANGE, text: "Stripe opened your email", time: "2m ago" },
          { dot: "#22c55e", text: "Vercel viewed resume · 42s", time: "18m ago" },
          { dot: "#FF4D00", text: "Linear clicked portfolio link", time: "1h ago" },
          { dot: "rgba(255,255,255,0.15)", text: "Notion — no activity", time: "2d ago" },
        ].map((item, i, arr) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "6px 0",
            borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: item.dot, flexShrink: 0 }} />
              <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)" }}>{item.text}</span>
            </div>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", flexShrink: 0, marginLeft: 12 }}>{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch {
      setError("Sign in failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "#09090b",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div className="auth-left-panel" style={{ flex: 1 }}>
        <LeftPanel />
      </div>

      <div style={{
        width: 460,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 40px",
        background: "#09090b",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%", maxWidth: 360 }}
        >
          {/* Mobile logo */}
          <div className="auth-mobile-logo" style={{ display: "none", marginBottom: 32, alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", filter: "drop-shadow(0 0 5px rgba(255,77,0,0.5))" }}>
              <img src="/logo.svg" alt="Merica" style={{ width: 20, height: 20, filter: "brightness(0) saturate(100%) invert(35%) sepia(96%) saturate(2000%) hue-rotate(5deg) brightness(105%)" }} />
            </div>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#fafafa", letterSpacing: "-0.02em" }}>Merica</span>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{
              fontSize: 22, fontWeight: 700, color: "#fafafa",
              letterSpacing: "-0.035em", margin: "0 0 6px",
            }}>Welcome back</h1>
            <p style={{
              fontSize: 13.5, color: "rgba(255,255,255,0.4)",
              margin: 0, letterSpacing: "-0.01em",
            }}>
              Sign in with Google to send tracked emails from your Gmail
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex", gap: 9, alignItems: "center",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 7, padding: "10px 12px", marginBottom: 20,
              }}
            >
              <AlertCircle size={14} color="#ef4444" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: "#ef4444" }}>{error}</span>
            </motion.div>
          )}

          {/* Google Sign In button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "11px 16px",
              background: loading ? "rgba(255,255,255,0.04)" : "#fff",
              color: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 9,
              fontSize: 14,
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "-0.01em",
              transition: "all 0.15s",
              opacity: loading ? 0.6 : 1,
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "rgba(255,255,255,0.92)"; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#fff"; }}
          >
            {loading ? (
              <div style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "#1a1a1a", borderRadius: "50%", animation: "cp-spin 0.7s linear infinite" }} />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            {loading ? "Redirecting to Google..." : "Continue with Google"}
          </button>

          {/* Info box */}
          <div style={{
            marginTop: 20,
            padding: "14px 16px",
            background: "rgba(255,77,0,0.05)",
            border: "1px solid rgba(255,77,0,0.12)",
            borderRadius: 8,
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: ORANGE, marginBottom: 6, letterSpacing: "0.02em", textTransform: "uppercase" }}>
              Why Google?
            </div>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.6 }}>
              Merica sends tracked emails directly from your Gmail account — so replies land in your inbox and recipients see your real address.
            </p>
          </div>

          <p style={{
            textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.2)",
            margin: "20px 0 0", lineHeight: 1.5,
          }}>
            By continuing, you allow Merica to send emails on your behalf via Gmail.
          </p>
        </motion.div>
      </div>

      <style>{`
        @keyframes cp-spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
          .auth-mobile-logo { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
