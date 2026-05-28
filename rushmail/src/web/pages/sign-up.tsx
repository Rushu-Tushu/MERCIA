import { useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "../lib/auth";
import { AuthSlider } from "../components/ui/auth-slider";
import { BorderBeam } from "../components/ui/border-beam";
import { AlertCircle, Check } from "lucide-react";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignUp = async () => {
    setError("");
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch {
      setError("Sign up failed. Please try again.");
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
        <AuthSlider />
      </div>

      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 40px",
        background: "#09090b",
        overflowY: "auto",
        position: "relative",
      }}>
        <BorderBeam size={300} duration={8} delay={0} borderWidth={1.5} />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%", maxWidth: 380 }}
        >
          {/* Mobile logo */}
          <div className="auth-mobile-logo" style={{ display: "none", marginBottom: 32, alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src="/Mercia.png" alt="Merica" style={{ width: 20, height: 20, objectFit: "contain" }} />
            </div>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#fafafa", letterSpacing: "-0.02em" }}>Merica</span>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{
              fontSize: 22, fontWeight: 700, color: "#fafafa",
              letterSpacing: "-0.035em", margin: "0 0 6px",
            }}>Get started free</h1>
            <p style={{
              fontSize: 13.5, color: "rgba(255,255,255,0.4)",
              margin: 0,
            }}>
              Connect your Gmail and start tracking cold emails
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

          {/* Google button */}
          <button
            onClick={handleGoogleSignUp}
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

          {/* Perks */}
          <div style={{
            marginTop: 20, paddingTop: 20,
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            {[
              "Emails send from your real Gmail address",
              "Replies land directly in your inbox",
              "Full open & click tracking on every send",
            ].map(b => (
              <div key={b} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Check size={11} color="#22c55e" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)" }}>{b}</span>
              </div>
            ))}
          </div>

          <p style={{
            textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.2)",
            margin: "20px 0 0", lineHeight: 1.5,
          }}>
            Already have an account? Just click the button above — we'll sign you in automatically.
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
