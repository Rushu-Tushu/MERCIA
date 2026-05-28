import { Fragment } from "react";
import { motion } from "framer-motion";
import { LightRays } from "./ui/light-rays";
import { useLocation } from "wouter";
import { authClient } from "../lib/auth";

const ORANGE = "#FF4D00";
const ORANGE_DIM = "rgba(255,77,0,0.12)";
const ORANGE_BORDER = "rgba(255,77,0,0.25)";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { show: { transition: { staggerChildren: 0.09 } } };

// Provider Details
const providers = [
    {
        logoImg: "/960px-Gmail_icon.png",
        name: "Google Gmail",
        desc: "Connect your workspace or personal Google account in seconds.",
        tag: "Available now",
        tagColor: "#22c55e",
        tagBg: "rgba(34,197,94,0.06)",
        tagBorder: "rgba(34,197,94,0.15)",
        features: [
            "Official OAuth 2.0 Secure Login",
            "Send through Google's premium SMTP servers",
            "Automatic daily sending limits optimization",
            "Compatible with Google Workspace & custom domains"
        ],
        actionText: "Connect Account",
        disabled: false,
        accentGlow: "rgba(234, 67, 53, 0.08)"
    },
    {
        logoImg: "/960px-Microsoft_Outlook.png",
        name: "Microsoft Outlook",
        desc: "Integrate Office 365, Exchange, or live outlook.com accounts.",
        tag: "Coming soon",
        tagColor: "rgba(255,255,255,0.45)",
        tagBg: "rgba(255,255,255,0.03)",
        tagBorder: "rgba(255,255,255,0.08)",
        features: [
            "Microsoft Graph API integration",
            "High-deliverability enterprise routing",
            "Shared mailbox & alias configuration",
            "Supports Office 365 corporate domains"
        ],
        actionText: "Request Access",
        disabled: true,
        accentGlow: "rgba(0, 120, 212, 0.08)"
    }
];

export function EmailProvidersSection() {
    const { data: session } = authClient.useSession();
    const [, setLocation] = useLocation();

    return (
        <section style={{ 
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px 24px", 
            position: "relative", 
            overflow: "hidden" 
        }}>
            <LightRays count={10} speed={12} color="rgba(255, 77, 0, 0.30)" />
            
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                variants={stagger}
                style={{ maxWidth: 1100, width: "100%", margin: "0 auto", position: "relative", zIndex: 1 }}
            >
                {/* Header */}
                <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 52 }}>
                    <div style={{
                        fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
                        color: ORANGE, textTransform: "uppercase", marginBottom: 12,
                    }}>
                        Sending
                    </div>
                    <h2 style={{
                        fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700,
                        letterSpacing: "-0.03em", color: "var(--text)",
                        margin: "0 0 14px", lineHeight: 1.15,
                    }}>
                        Send from your own inbox.
                    </h2>
                    <p style={{
                        fontSize: 15, color: "var(--text-secondary)",
                        maxWidth: 460, margin: "0 auto",
                        lineHeight: 1.65, letterSpacing: "-0.01em",
                    }}>
                        No shared sending domains. No deliverability penalties. Emails go out
                        directly from your personal address — the way they should.
                    </p>
                </motion.div>

                {/* Grid of jet-black containers */}
                <div className="provider-grid" style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 24,
                    maxWidth: 960,
                    margin: "0 auto",
                }}>
                    {providers.map((p) => {
                        const isGmail = p.name === "Google Gmail";
                        const buttonText = (isGmail && session) ? "Connected" : p.actionText;

                        return (
                            <motion.div
                                key={p.name}
                                variants={fadeUp}
                                whileHover={{ 
                                    y: -8, 
                                    borderColor: p.disabled ? "rgba(255,255,255,0.12)" : "rgba(255, 77, 0, 0.35)",
                                    boxShadow: p.disabled ? "0 10px 30px -15px rgba(0,0,0,0.8)" : "0 20px 45px -15px rgba(255, 77, 0, 0.15)"
                                }}
                                onClick={() => {
                                    if (isGmail && !session) {
                                        setLocation("/sign-in");
                                    }
                                }}
                                style={{
                                    background: "#000000",
                                    border: "1px solid rgba(255,255,255,0.05)",
                                    borderRadius: 20,
                                    padding: "40px",
                                    position: "relative",
                                    overflow: "hidden",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    minHeight: 480,
                                    transition: "border-color 0.3s, box-shadow 0.3s",
                                    cursor: p.disabled ? "default" : isGmail && session ? "default" : "pointer"
                                }}
                            >
                                {/* Accent backdrop radial light inside card */}
                                <div style={{
                                    position: "absolute",
                                    top: "-20%",
                                    right: "-20%",
                                    width: "60%",
                                    height: "60%",
                                    background: `radial-gradient(circle, ${p.accentGlow}, transparent 70%)`,
                                    pointerEvents: "none"
                                }} />

                                <div>
                                    {/* Top bar: Badge and Logo */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                                        <div style={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: 16,
                                            background: "rgba(255,255,255,0.02)",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            position: "relative",
                                            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.03)"
                                        }}>
                                            <img 
                                                src={p.logoImg} 
                                                alt={p.name} 
                                                style={{ 
                                                    width: 40, 
                                                    height: 40, 
                                                    objectFit: "contain",
                                                    opacity: p.disabled ? 0.55 : 1,
                                                    filter: p.disabled ? "grayscale(40%)" : "none"
                                                }} 
                                            />
                                        </div>
                                        
                                        <div style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 6,
                                            background: p.tagBg,
                                            border: `1px solid ${p.tagBorder}`,
                                            padding: "6px 14px",
                                            borderRadius: 100
                                        }}>
                                            <span style={{
                                                width: 5,
                                                height: 5,
                                                borderRadius: "50%",
                                                background: p.tagColor,
                                            }} />
                                            <span style={{
                                                fontSize: 11.5,
                                                fontWeight: 600,
                                                color: p.tagColor,
                                                letterSpacing: "-0.01em"
                                            }}>
                                                {p.tag}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 style={{
                                        fontSize: 22,
                                        fontWeight: 700,
                                        color: "var(--text)",
                                        letterSpacing: "-0.03em",
                                        marginBottom: 12
                                    }}>
                                        {p.name}
                                    </h3>
                                    
                                    <p style={{
                                        fontSize: 14,
                                        color: "var(--text-secondary)",
                                        lineHeight: 1.6,
                                        marginBottom: 32,
                                        maxWidth: "95%"
                                    }}>
                                        {p.desc}
                                    </p>

                                    {/* Divider */}
                                    <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 28 }} />

                                    {/* Bullet points */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
                                        {p.features.map((feat) => (
                                            <div key={feat} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ marginTop: 2, flexShrink: 0 }}>
                                                    <circle cx="7.5" cy="7.5" r="7.5" fill={p.disabled ? "rgba(255,255,255,0.02)" : ORANGE_DIM} />
                                                    <path d="M4.5 7.5l2 2 4-4" stroke={p.disabled ? "rgba(255,255,255,0.25)" : ORANGE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <span style={{
                                                    fontSize: 13,
                                                    color: "var(--text-secondary)",
                                                    lineHeight: 1.4,
                                                    letterSpacing: "-0.01em"
                                                }}>
                                                    {feat}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <div style={{
                                    width: "100%",
                                    padding: "14px 20px",
                                    borderRadius: 12,
                                    background: p.disabled ? "rgba(255,255,255,0.02)" : "rgba(255, 77, 0, 0.06)",
                                    border: p.disabled ? "1px solid rgba(255,255,255,0.04)" : `1px solid ${ORANGE_BORDER}`,
                                    color: p.disabled ? "rgba(255,255,255,0.30)" : ORANGE,
                                    fontSize: 13.5,
                                    fontWeight: 600,
                                    textAlign: "center",
                                    transition: "all 0.2s",
                                    boxShadow: p.disabled ? "none" : `inset 0 1px 0 rgba(255,77,0,0.08)`
                                }}>
                                    {buttonText}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
            
            <style>{`
                @media (max-width: 800px) {
                    .provider-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </section>
    );
}