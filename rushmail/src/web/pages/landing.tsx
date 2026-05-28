import { useState, useEffect } from "react";
import { EmailProvidersSection } from "../components/email-providers-section";
import { NumberTicker } from "../components/ui/number-ticker";
import { BentoGrid, BentoCard } from "../components/ui/bento-grid";
import { AuroraText } from "../components/ui/aurora-text";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  BarChart3, Mail, Shield, Clock, Eye, MousePointer,
  FileText, Star, ArrowRight, Check, Menu, X, Bell, TrendingUp,
  Activity, Users
} from "lucide-react";

// ─── BRAND ────────────────────────────────────────────────────────────────────
const ORANGE = "#FF4D00";
const ORANGE_DIM = "rgba(255,77,0,0.12)";
const ORANGE_BORDER = "rgba(255,77,0,0.25)";

// ─── VARIANTS ─────────────────────────────────────────────────────────────────
const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: any = { show: { transition: { staggerChildren: 0.09 } } };

// ─── PREMIUM NAVBAR ───────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Analytics", href: "#analytics" },
    { label: "Pricing", href: "#pricing" },
    { label: "Docs", href: "#faq" },
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        height: 56,
        background: scrolled
          ? "rgba(9,9,11,0.92)"
          : "rgba(9,9,11,0.6)",
        backdropFilter: `blur(${scrolled ? 24 : 12}px)`,
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)"}`,
        transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
        display: "flex", alignItems: "center",
        padding: "0 32px",
      }}>
        <div style={{
          maxWidth: 1200, width: "100%", margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              filter: "drop-shadow(0 0 6px rgba(255,77,0,0.55))",
            }}>
              <img src="/logo.svg" alt="ColdPulse" style={{ width: 20, height: 20, filter: "brightness(0) saturate(100%) invert(35%) sepia(96%) saturate(2000%) hue-rotate(5deg) brightness(105%)" }} />
            </div>
            <span style={{
              fontWeight: 600, fontSize: 15, color: "var(--text)",
              letterSpacing: "-0.02em",
            }}>ColdPulse</span>
          </div>

          {/* Desktop nav */}
          <div style={{
            display: "flex", gap: 4, alignItems: "center",
            position: "absolute", left: "50%", transform: "translateX(-50%)",
          }}
            className="desktop-nav"
          >
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href} style={{
                color: "var(--text-secondary)", textDecoration: "none",
                fontSize: 13.5, fontWeight: 450, letterSpacing: "-0.01em",
                padding: "6px 14px", borderRadius: 6,
                transition: "color 0.15s, background 0.15s",
                display: "block",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "var(--text)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.background = "transparent";
                }}
              >{label}</a>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link to="/sign-in">
              <span style={{
                color: "var(--text-secondary)", fontSize: 13.5, fontWeight: 450,
                cursor: "pointer", padding: "7px 14px", borderRadius: 6,
                transition: "color 0.15s",
                letterSpacing: "-0.01em",
              }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
              >Sign in</span>
            </Link>
            <Link to="/sign-up">
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: ORANGE, color: "white",
                padding: "7px 16px", borderRadius: 7,
                fontSize: 13.5, fontWeight: 550, cursor: "pointer",
                letterSpacing: "-0.01em",
                transition: "opacity 0.15s, transform 0.15s",
                boxShadow: "0 1px 3px rgba(255,77,0,0.3)",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.opacity = "0.88";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >Get started <ArrowRight size={12} strokeWidth={2.5} /></span>
            </Link>
            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              style={{
                display: "none", background: "transparent",
                border: "none", color: "var(--text-secondary)", cursor: "pointer",
                padding: 6, borderRadius: 6,
              }}
              className="mobile-menu-btn"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              position: "fixed", top: 56, left: 0, right: 0, zIndex: 199,
              background: "rgba(9,9,11,0.97)", backdropFilter: "blur(24px)",
              borderBottom: "1px solid var(--border)",
              padding: "16px 24px 20px",
            }}
          >
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block", padding: "11px 4px",
                  color: "var(--text-secondary)", textDecoration: "none",
                  fontSize: 15, fontWeight: 450,
                  borderBottom: "1px solid var(--border-subtle)",
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
              >{label}</a>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <Link to="/sign-in" style={{ flex: 1 }}>
                <span style={{
                  display: "block", textAlign: "center",
                  padding: "10px", borderRadius: 8,
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)", fontSize: 14, cursor: "pointer",
                }}>Sign in</span>
              </Link>
              <Link to="/sign-up" style={{ flex: 1 }}>
                <span style={{
                  display: "block", textAlign: "center",
                  padding: "10px", borderRadius: 8,
                  background: ORANGE, color: "white",
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}>Get started</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}

// ─── PREMIUM DASHBOARD PREVIEW (Full HTML mock) ────────────────────────────────
function DashboardPreview() {
  return (
    <div style={{
      width: "100%",
      background: "#0a0a0d",
      borderRadius: 10,
      border: "1px solid rgba(255,255,255,0.07)",
      overflow: "hidden",
      fontFamily: "'Inter', sans-serif",
      fontSize: 12,
      color: "#fafafa",
      display: "flex",
      minHeight: 480,
    }}>
      {/* Sidebar */}
      <div style={{
        width: 200, flexShrink: 0,
        background: "#0a0a0d",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        display: "flex", flexDirection: "column",
        padding: "14px 0",
      }}>
        {/* Brand */}
        <div style={{ padding: "0 14px 16px", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{
            width: 22, height: 22, borderRadius: 5,
            display: "flex", alignItems: "center", justifyContent: "center",
            filter: "drop-shadow(0 0 5px rgba(255,77,0,0.5))",
          }}>
            <img src="/logo.svg" alt="ColdPulse" style={{ width: 18, height: 18, filter: "brightness(0) saturate(100%) invert(35%) sepia(96%) saturate(2000%) hue-rotate(5deg) brightness(105%)" }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.02em" }}>ColdPulse</span>
        </div>

        {/* Nav items */}
        <div style={{ padding: "10px 8px", flex: 1 }}>
          {[
            { icon: BarChart3, label: "Dashboard", active: true },
            { icon: Mail, label: "Emails" },
            { icon: TrendingUp, label: "Analytics" },
            { icon: FileText, label: "Templates" },
            { icon: Users, label: "Resume" },
            { icon: Bell, label: "Notifications" },
          ].map(({ icon: Icon, label, active }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "7px 8px", borderRadius: 6, marginBottom: 2,
              background: active ? "rgba(255,77,0,0.1)" : "transparent",
              color: active ? ORANGE : "rgba(255,255,255,0.45)",
              cursor: "default",
              fontSize: 12,
            }}>
              <Icon size={13} />
              <span style={{ fontWeight: active ? 500 : 400 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* User */}
        <div style={{
          padding: "10px 14px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: "50%",
            background: "rgba(255,77,0,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 600, color: ORANGE,
          }}>JD</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>John Doe</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Pro plan</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{
          height: 46, borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", flexShrink: 0,
        }}>
          <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.85)" }}>Overview</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              height: 28, padding: "0 10px", borderRadius: 6,
              background: "#141418", border: "1px solid rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", gap: 6,
              color: "rgba(255,255,255,0.35)", fontSize: 11,
            }}>
              <span>Search...</span>
            </div>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: "#141418", border: "1px solid rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              <Bell size={12} color="rgba(255,255,255,0.45)" />
              <div style={{
                position: "absolute", top: 5, right: 5,
                width: 5, height: 5, borderRadius: "50%",
                background: ORANGE,
              }} />
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: "16px 20px", overflowY: "auto" }}>
          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
            {[
              { label: "Emails Sent", val: "247", delta: "+12%", up: true },
              { label: "Total Opens", val: "183", delta: "+8%", up: true },
              { label: "Open Rate", val: "74.1%", delta: "+2.3%", up: true },
              { label: "Avg Score", val: "68", delta: "-1.2%", up: false },
            ].map(s => (
              <div key={s.label} style={{
                background: "#141418",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 7, padding: "11px 13px",
              }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", marginBottom: 5, letterSpacing: "0.01em" }}>{s.label}</div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.03em", color: "#fafafa" }}>{s.val}</span>
                  <span style={{ fontSize: 10, color: s.up ? "#22c55e" : "#ef4444", fontWeight: 500 }}>{s.delta}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart area */}
          <div style={{
            background: "#141418", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 7, padding: "13px 16px", marginBottom: 14,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.7)", letterSpacing: "-0.01em" }}>Engagement over time</span>
              <div style={{ display: "flex", gap: 8 }}>
                {["7d", "30d", "90d"].map((t, i) => (
                  <span key={t} style={{
                    fontSize: 10, padding: "2px 7px", borderRadius: 4,
                    background: i === 1 ? ORANGE_DIM : "transparent",
                    color: i === 1 ? ORANGE : "rgba(255,255,255,0.3)",
                    border: i === 1 ? `1px solid ${ORANGE_BORDER}` : "1px solid transparent",
                    cursor: "default",
                  }}>{t}</span>
                ))}
              </div>
            </div>
            {/* Mini SVG chart */}
            <svg width="100%" height="80" viewBox="0 0 500 80" preserveAspectRatio="none">
              <defs>
                <linearGradient id="og" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ORANGE} stopOpacity="0.15" />
                  <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="ig" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF4D00" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#FF4D00" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Opens area */}
              <path d="M0,60 L40,50 L80,42 L120,48 L160,30 L200,35 L240,20 L280,28 L320,15 L360,22 L400,10 L440,18 L500,8 L500,80 L0,80 Z"
                fill="url(#og)" />
              <path d="M0,60 L40,50 L80,42 L120,48 L160,30 L200,35 L240,20 L280,28 L320,15 L360,22 L400,10 L440,18 L500,8"
                fill="none" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Clicks area */}
              <path d="M0,72 L40,68 L80,64 L120,66 L160,55 L200,58 L240,48 L280,52 L320,42 L360,48 L400,38 L440,43 L500,35 L500,80 L0,80 Z"
                fill="url(#ig)" />
              <path d="M0,72 L40,68 L80,64 L120,66 L160,55 L200,58 L240,48 L280,52 L320,42 L360,48 L400,38 L440,43 L500,35"
                fill="none" stroke="#FF4D00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 2, borderRadius: 1, background: ORANGE }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Opens</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 2, borderRadius: 1, background: "#FF4D00" }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Clicks</span>
              </div>
            </div>
          </div>

          {/* Bottom row: Activity + Top leads */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {/* Recent activity */}
            <div style={{
              background: "#141418", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 7, padding: "11px 14px",
            }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.7)", marginBottom: 10 }}>Recent Activity</div>
              {[
                { dot: ORANGE, text: "Stripe — email opened", time: "2m ago" },
                { dot: "#22c55e", text: "Vercel — resume viewed", time: "18m ago" },
                { dot: "#FF4D00", text: "Linear — link clicked", time: "1h ago" },
                { dot: ORANGE, text: "Figma — email opened", time: "3h ago" },
                { dot: "rgba(255,255,255,0.2)", text: "Notion — no activity", time: "1d ago" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: item.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.6)" }}>{item.text}</span>
                  </div>
                  <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.25)", flexShrink: 0, marginLeft: 8 }}>{item.time}</span>
                </div>
              ))}
            </div>

            {/* Engagement scores */}
            <div style={{
              background: "#141418", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 7, padding: "11px 14px",
            }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.7)", marginBottom: 10 }}>Top Leads</div>
              {[
                { name: "Stripe Inc.", score: 94, status: "Hot" },
                { name: "Vercel", score: 81, status: "Hot" },
                { name: "Linear", score: 66, status: "Warm" },
                { name: "Figma", score: 52, status: "Warm" },
                { name: "Notion", score: 23, status: "Cold" },
              ].map((lead, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 4,
                      background: "rgba(255,255,255,0.06)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.4)",
                    }}>{lead.name[0]}</div>
                    <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.65)" }}>{lead.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 48, height: 3, borderRadius: 2,
                      background: "rgba(255,255,255,0.07)",
                      overflow: "hidden",
                    }}>
                      <div style={{
                        width: `${lead.score}%`, height: "100%",
                        background: lead.score > 80 ? ORANGE : lead.score > 50 ? "#eab308" : "#52525b",
                        borderRadius: 2,
                      }} />
                    </div>
                    <span style={{
                      fontSize: 9.5, fontWeight: 500, padding: "1px 5px", borderRadius: 3,
                      background: lead.status === "Hot" ? `rgba(255,77,0,0.12)` : lead.status === "Warm" ? "rgba(234,179,8,0.12)" : "rgba(82,82,91,0.3)",
                      color: lead.status === "Hot" ? ORANGE : lead.status === "Warm" ? "#eab308" : "#71717a",
                    }}>{lead.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FLOATING NOTIFICATION CARDS ──────────────────────────────────────────────
function FloatingCard({ children, style }: { children: React.ReactNode; style: React.CSSProperties }) {
  return (
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "absolute",
        background: "#141418",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10,
        padding: "10px 14px",
        backdropFilter: "blur(16px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        pointerEvents: "none",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const bentoFeatures = [
  {
    name: "Real-Time Tracking",
    description: "Know the exact moment your email is opened — device, location, and timestamp included.",
    Icon: Eye,
    className: "lg:col-span-2",
    background: <div style={{ height: 140, width: "100%", background: "transparent" }} />,
    href: "#",
    cta: "Learn more",
  },
  {
    name: "Resume Analytics",
    description: "See when recruiters view your resume and for how long.",
    Icon: FileText,
    className: "lg:col-span-1",
    background: <div style={{ height: 140, width: "100%", background: "transparent" }} />,
    href: "#",
    cta: "Learn more",
  },
  {
    name: "Ghosting Detection",
    description: "Automatically flags inactivity and repeated opens without a reply.",
    Icon: Clock,
    className: "lg:col-span-1",
    background: <div style={{ height: 140, width: "100%", background: "transparent" }} />,
    href: "#",
    cta: "Learn more",
  },
  {
    name: "Engagement Scoring",
    description: "ColdPulse calculates a real score so you know who's Hot, Warm, or Cold instantly.",
    Icon: BarChart3,
    className: "lg:col-span-2",
    background: <div style={{ height: 140, width: "100%", background: "transparent" }} />,
    href: "#",
    cta: "Learn more",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "CS Student, IIT Delhi",
    text: "ColdPulse helped me land 3 interviews in a week. I knew exactly which companies were interested.",
  },
  {
    name: "Alex Rivera",
    role: "Freelance Designer",
    text: "I can finally see if my portfolio is being visited. Game-changer for cold outreach.",
  },
  {
    name: "Jordan Lee",
    role: "Software Engineer",
    text: "The engagement score feature is brilliant. I stopped wasting time following up with cold leads.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["25 emails/month", "Basic open tracking", "3 templates", "7-day history"],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    features: [
      "Unlimited emails",
      "Full analytics suite",
      "Resume & portfolio tracking",
      "Realtime notifications",
      "Ghosting detection",
      "Engagement scoring",
      "Unlimited templates",
      "30-day history",
    ],
    cta: "Start Pro Trial",
    highlight: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    features: [
      "Everything in Pro",
      "5 team members",
      "Shared templates",
      "Team analytics",
      "Priority support",
      "90-day history",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

const faqs = [
  {
    q: "Does the recipient know they're being tracked?",
    a: "Open tracking uses an invisible 1x1 pixel — standard practice in email marketing and CRM tools. Link tracking uses redirect URLs.",
  },
  {
    q: "How accurate is the open tracking?",
    a: "Very accurate for most email clients. Some clients (Apple Mail Privacy Protection) may show phantom opens — we flag these.",
  },
  {
    q: "Can I use my own email to send?",
    a: "Yes. Connect your SMTP or use our built-in sending via Resend. Your emails come from your address.",
  },
  {
    q: "Is my data secure?",
    a: "All data is stored in encrypted databases. We never sell your data. You can delete your account anytime.",
  },
];

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{
      background: "var(--bg)", minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "var(--text)",
    }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        paddingTop: 120, paddingBottom: 0, textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* Radial bg — very subtle */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 900, height: 500, pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 0%, rgba(255,77,0,0.07) 0%, transparent 70%)",
        }} />

        <motion.div
          initial="hidden" animate="show" variants={stagger}
          style={{ maxWidth: 740, margin: "0 auto", padding: "0 24px", position: "relative" }}
        >
          {/* Pill badge */}
          <motion.div variants={fadeUp} style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: ORANGE_DIM, border: `1px solid ${ORANGE_BORDER}`,
            padding: "5px 14px", borderRadius: 100, marginBottom: 28,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: ORANGE }} />
            <span style={{ fontSize: 12.5, color: ORANGE, fontWeight: 500, letterSpacing: "-0.01em" }}>
              Real-time recruiter engagement tracking
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} style={{
            fontSize: "clamp(38px, 6vw, 64px)",
            fontWeight: 700, lineHeight: 1.08,
            letterSpacing: "-0.04em", margin: "0 0 20px",
            color: "#fafafa",
          }}>
            Track every recruiter<br />
            interaction in realtime.
          </motion.h1>

          <motion.p variants={fadeUp} style={{
            fontSize: 16, color: "var(--text-secondary)",
            lineHeight: 1.65, marginBottom: 36,
            maxWidth: 480, margin: "0 auto 36px",
            letterSpacing: "-0.01em",
          }}>
            ColdPulse gives you a real engagement score — so you know exactly
            who's interested and when to follow up.
          </motion.p>

          <motion.div variants={fadeUp} style={{
            display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap",
          }}>
            <Link to="/sign-up">
              <motion.span
                whileHover={{ opacity: 0.88 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: ORANGE, color: "white",
                  padding: "10px 22px", borderRadius: 8,
                  fontSize: 14, fontWeight: 550, cursor: "pointer",
                  letterSpacing: "-0.01em",
                  boxShadow: "0 2px 8px rgba(255,77,0,0.25)",
                }}
              >
                Start for free <ArrowRight size={13} strokeWidth={2.5} />
              </motion.span>
            </Link>
            <Link to="/dashboard">
              <motion.span
                whileHover={{ background: "rgba(255,255,255,0.07)" }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "var(--text-secondary)", padding: "10px 22px", borderRadius: 8,
                  fontSize: 14, fontWeight: 450, cursor: "pointer",
                  letterSpacing: "-0.01em",
                  transition: "background 0.15s",
                }}
              >
                View dashboard
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>

        {/* ── DASHBOARD SHOWCASE ───────────────────────────────────────────── */}
        <div style={{
          maxWidth: 1160, margin: "72px auto 0", padding: "0 24px",
          position: "relative",
        }}>
          {/* Glow under the card */}
          <div style={{
            position: "absolute", bottom: -60, left: "50%", transform: "translateX(-50%)",
            width: "70%", height: 120, borderRadius: "50%", filter: "blur(60px)",
            background: "rgba(255,77,0,0.06)", pointerEvents: "none",
          }} />

          {/* Main showcase container */}
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "relative",
              borderRadius: 14,
              padding: 2,
              background: "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            {/* Browser chrome */}
            <div style={{
              background: "#101013",
              borderRadius: "12px 12px 0 0",
              padding: "10px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["#ff5f57", "#febc2e", "#28c840"].map(c => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <div style={{
                flex: 1, maxWidth: 240, height: 22, borderRadius: 4,
                background: "rgba(255,255,255,0.05)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, color: "rgba(255,255,255,0.2)",
                margin: "0 auto",
              }}>
                app.coldpulse.io/dashboard
              </div>
            </div>

            {/* Dashboard preview */}
            <div style={{ borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
              <DashboardPreview />
            </div>
          </motion.div>

          {/* Floating mini cards */}
          <FloatingCard style={{
            left: -12, top: 120, minWidth: 170,
            animationDelay: "0s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: ORANGE_DIM, border: `1px solid ${ORANGE_BORDER}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Eye size={13} color={ORANGE} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.85)", letterSpacing: "-0.01em" }}>Email opened</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Stripe — just now</div>
              </div>
            </div>
          </FloatingCard>

          <FloatingCard style={{
            right: -16, top: 80, minWidth: 185,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <FileText size={13} color="#22c55e" />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.85)", letterSpacing: "-0.01em" }}>Resume viewed</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>42 seconds · Vercel</div>
              </div>
            </div>
          </FloatingCard>

          <FloatingCard style={{
            right: 40, bottom: 60, minWidth: 160,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: ORANGE_DIM, border: `1px solid ${ORANGE_BORDER}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Activity size={13} color={ORANGE} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: ORANGE, letterSpacing: "-0.01em" }}>Hot Lead</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Score 94 · Linear</div>
              </div>
            </div>
          </FloatingCard>
        </div>
      </section>

      <EmailProvidersSection />

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section id="features" style={{ padding: "100px 24px", background: "#000" }}>
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          style={{ maxWidth: 1100, margin: "0 auto" }}
        >
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{
              fontSize: "clamp(36px, 5vw, 48px)", fontWeight: 800,
              letterSpacing: "-0.03em", color: "var(--text)", margin: "0 0 14px",
            }}>
              Start <AuroraText colors={["#ff4d00", "#ff7300", "#ffa600", "#ff2a00"]}>Approaching</AuroraText>
            </h2>
            <p style={{
              fontSize: 16, color: "var(--text-secondary)", maxWidth: 500,
              margin: "0 auto", lineHeight: 1.65, letterSpacing: "-0.01em",
            }}>
              From the moment you hit send to the interview invite — ColdPulse tracks every step so you land the job faster.
            </p>
          </motion.div>

          <BentoGrid>
            {bentoFeatures.map((f, i) => (
              <motion.div key={i} variants={fadeUp} className={f.className}>
                <BentoCard
                  name={f.name}
                  description={f.description}
                  Icon={f.Icon}
                  background={f.background}
                  href={f.href}
                  cta={f.cta}
                  className="h-full w-full border-none shadow-none"
                  style={{
                    background: "linear-gradient(180deg, var(--surface-raised) 0%, rgba(13, 13, 13, 0.4) 100%)",
                    border: "1px solid var(--border)",
                    borderRadius: 16,
                  }}
                />
              </motion.div>
            ))}
          </BentoGrid>
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 24px 60px" }}>
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={stagger}
          style={{
            maxWidth: 1050, margin: "0 auto",
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20,
          }}
        >
          {[
            {
              label: "Cold emails tracked",
              value: 2181,
              decimals: 0,
              prefix: "",
              suffix: "",
            },
            {
              label: "Average open rate",
              value: 90,
              decimals: 0,
              prefix: "",
              suffix: "%",
            },
            {
              label: "More interviews",
              value: 3.0,
              decimals: 1,
              prefix: "",
              suffix: "×",
            },
            {
              label: "Tracking latency",
              value: 0.8,
              decimals: 1,
              prefix: "<",
              suffix: "s",
            },
          ].map((s) => (
            <motion.div key={s.label} variants={fadeUp} style={{
              padding: "36px 24px", textAlign: "center",
              background: "linear-gradient(180deg, var(--surface-raised) 0%, rgba(13, 13, 13, 0.4) 100%)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.16)",
              display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
            }}>
              <div style={{
                fontSize: 34, fontWeight: 700, letterSpacing: "-0.04em",
                color: "var(--text)", marginBottom: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {s.prefix && <span style={{ opacity: 0.6, marginRight: 2 }}>{s.prefix}</span>}
                <NumberTicker value={s.value} decimalPlaces={s.decimals} />
                {s.suffix && <span style={{ opacity: 0.8, marginLeft: 2 }}>{s.suffix}</span>}
              </div>
              <div style={{
                fontSize: 13, color: "var(--text-secondary)",
                letterSpacing: "-0.01em",
              }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section id="analytics" style={{ padding: "80px 24px", background: "var(--surface)" }}>
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={stagger}
          style={{ maxWidth: 1000, margin: "0 auto" }}
        >
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
              color: ORANGE, textTransform: "uppercase", marginBottom: 12,
            }}>Testimonials</div>
            <h2 style={{
              fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700,
              letterSpacing: "-0.03em", color: "var(--text)",
            }}>
              Loved by job seekers & freelancers.
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {testimonials.map(t => (
              <motion.div key={t.name} variants={fadeUp} style={{
                background: "var(--surface-raised)", border: "1px solid var(--border)",
                borderRadius: 10, padding: "24px",
              }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} color="#eab308" fill="#eab308" />
                  ))}
                </div>
                <p style={{
                  fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7,
                  margin: "0 0 20px", letterSpacing: "-0.01em",
                }}>"{t.text}"</p>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.01em" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: "80px 24px" }}>
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={stagger}
          style={{ maxWidth: 960, margin: "0 auto" }}
        >
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
              color: ORANGE, textTransform: "uppercase", marginBottom: 12,
            }}>Pricing</div>
            <h2 style={{
              fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700,
              letterSpacing: "-0.03em", color: "var(--text)", marginBottom: 10,
            }}>Simple, transparent pricing.</h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", letterSpacing: "-0.01em" }}>
              Start free. Upgrade when you're ready.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {pricingPlans.map(plan => (
              <motion.div key={plan.name} variants={fadeUp} style={{
                background: plan.highlight ? "var(--surface-overlay)" : "var(--surface-raised)",
                border: plan.highlight ? `1px solid ${ORANGE_BORDER}` : "1px solid var(--border)",
                borderRadius: 10, padding: 24, position: "relative",
              }}>
                {plan.highlight && (
                  <div style={{
                    position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                    background: ORANGE, color: "white",
                    padding: "3px 12px", borderRadius: 100,
                    fontSize: 11, fontWeight: 600, letterSpacing: "0.01em",
                    whiteSpace: "nowrap",
                  }}>Most Popular</div>
                )}
                <div style={{ marginBottom: 20 }}>
                  <div style={{
                    fontSize: 12, fontWeight: 600, color: "var(--text-secondary)",
                    marginBottom: 10, letterSpacing: "0.02em", textTransform: "uppercase",
                  }}>{plan.name}</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 3 }}>
                    <span style={{
                      fontSize: 36, fontWeight: 700, color: "var(--text)",
                      letterSpacing: "-0.04em", lineHeight: 1,
                    }}>{plan.price}</span>
                    <span style={{
                      fontSize: 13, color: "var(--text-secondary)",
                      paddingBottom: 4, letterSpacing: "-0.01em",
                    }}>{plan.period}</span>
                  </div>
                </div>
                <div style={{ marginBottom: 24 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{
                      display: "flex", gap: 9, alignItems: "flex-start",
                      marginBottom: 8,
                    }}>
                      <Check size={13} color="#22c55e" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{
                        fontSize: 13, color: "var(--text-secondary)",
                        letterSpacing: "-0.01em",
                      }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link to="/sign-up">
                  <div style={{
                    background: plan.highlight ? ORANGE : "rgba(255,255,255,0.05)",
                    border: plan.highlight ? "none" : "1px solid var(--border)",
                    color: "white", padding: "10px",
                    borderRadius: 8, textAlign: "center",
                    fontSize: 13.5, fontWeight: 550, cursor: "pointer",
                    letterSpacing: "-0.01em",
                    transition: "opacity 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    {plan.cta}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: "80px 24px", background: "var(--surface)" }}>
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={stagger}
          style={{ maxWidth: 660, margin: "0 auto" }}
        >
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
              color: ORANGE, textTransform: "uppercase", marginBottom: 12,
            }}>FAQ</div>
            <h2 style={{
              fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700,
              letterSpacing: "-0.03em", color: "var(--text)",
            }}>Frequently asked questions.</h2>
          </motion.div>

          {faqs.map((faq, i) => (
            <motion.div key={i} variants={fadeUp} style={{
              borderBottom: "1px solid var(--border)",
              paddingBottom: 20, marginBottom: 20,
            }}>
              <div style={{
                fontSize: 14, fontWeight: 550, color: "var(--text)",
                marginBottom: 8, letterSpacing: "-0.01em",
              }}>{faq.q}</div>
              <div style={{
                fontSize: 13.5, color: "var(--text-secondary)",
                lineHeight: 1.7, letterSpacing: "-0.01em",
              }}>{faq.a}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 24px", textAlign: "center" }}>
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={stagger}
          style={{ maxWidth: 560, margin: "0 auto" }}
        >
          <motion.h2 variants={fadeUp} style={{
            fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700,
            letterSpacing: "-0.04em", color: "var(--text)", marginBottom: 14, lineHeight: 1.1,
          }}>
            Start tracking today.
          </motion.h2>
          <motion.p variants={fadeUp} style={{
            fontSize: 15, color: "var(--text-secondary)", marginBottom: 36,
            letterSpacing: "-0.01em",
          }}>
            Free forever. No credit card required.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link to="/sign-up">
              <motion.span
                whileHover={{ opacity: 0.88 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: ORANGE, color: "white",
                  padding: "12px 28px", borderRadius: 9,
                  fontSize: 15, fontWeight: 600, cursor: "pointer",
                  letterSpacing: "-0.02em",
                  boxShadow: "0 4px 16px rgba(255,77,0,0.3)",
                }}
              >
                <img src="/logo.svg" alt="" style={{ width: 16, height: 16, filter: "brightness(0) invert(1)", marginRight: 2 }} />
                Get ColdPulse Free
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid var(--border)", padding: "24px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 5,
            display: "flex", alignItems: "center", justifyContent: "center",
            filter: "drop-shadow(0 0 5px rgba(255,77,0,0.5))",
          }}>
            <img src="/logo.svg" alt="ColdPulse" style={{ width: 18, height: 18, filter: "brightness(0) saturate(100%) invert(35%) sepia(96%) saturate(2000%) hue-rotate(5deg) brightness(105%)" }} />
          </div>
          <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", letterSpacing: "-0.02em" }}>ColdPulse</span>
        </div>
        <p style={{ color: "var(--text-tertiary)", fontSize: 12.5, margin: 0, letterSpacing: "-0.01em" }}>
          © 2025 ColdPulse. Built for the relentless job seeker.
        </p>
      </footer>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .features-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
