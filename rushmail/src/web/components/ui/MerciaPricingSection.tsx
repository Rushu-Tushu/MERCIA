import { LightRays } from "./light-rays";
import { AuroraText } from "./aurora-text";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function MerciaPricingSection() {
    const features = [
        {
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                </svg>
            ),
            title: "Email Open Tracking",
            desc: "Know the exact moment your email is opened",
        },
        {
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                </svg>
            ),
            title: "Resume Link Tracking",
            desc: "Track every click on your resume link",
        },
        {
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
            ),
            title: "Real-time Notifications",
            desc: "Instant alerts when someone views your content",
        },
        {
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="3" y1="15" x2="21" y2="15" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                    <line x1="15" y1="3" x2="15" y2="21" />
                </svg>
            ),
            title: "Outreach Dashboard",
            desc: "All your cold emails in one clean view",
        },
        {
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
            ),
            title: "Unlimited Tracking Links",
            desc: "No cap on how many links you can track",
        },
        {
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
            title: "Unlimited Contacts",
            desc: "Track as many recruiters as you want",
        },
    ];

    return (
        <section
            id="pricing"
            style={{
                background: "#000000",
                padding: "100px 24px",
                fontFamily: "'Inter', system-ui, sans-serif",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Subtle top noise/grain */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(255,115,0,0.05) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            {/* Heading */}
            <div style={{ textAlign: "center", marginBottom: "52px", position: "relative", zIndex: 1 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "clamp(28px, 4vw, 44px)",
                            fontWeight: 700,
                            letterSpacing: "-0.025em",
                            color: "#ffffff",
                        }}
                    >
                        Use <AuroraText colors={["#ff4d00", "#ff7300", "#ffa600", "#ff2a00"]}>Mercia</AuroraText>
                    </h2>
                </div>
            </div>

            {/* Feature card with orange ambient border glow */}
            <div
                style={{
                    maxWidth: "820px",
                    margin: "0 auto",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Light Rays Background */}
                {/* <div className="absolute inset-0 z-0 scale-110 pointer-events-none">
                    <LightRays count={8} color="#ff4d00" blur={40} speed={12} />
                </div> */}
                {/* Glow layer behind the card */}
                <div
                    style={{
                        position: "absolute",
                        inset: "-2px",
                        borderRadius: "22px",
                        background:
                            "linear-gradient(135deg, #ff4d00, #ff7300, #ffa600, #ff2a00, #ff7300, #ff4d00)",
                        backgroundSize: "300% 300%",
                        animation: "borderShimmer 5s ease infinite",
                        padding: "2px",
                        zIndex: 0,
                    }}
                />
                {/* Inner card */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 1,
                        background: "#0a0a0a",
                        borderRadius: "20px",
                        padding: "40px 36px",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1px 1fr",
                            gap: "0",
                        }}
                    >
                        {/* Left column */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                            {features.slice(0, 3).map((f) => (
                                <FeatureRow key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
                            ))}
                        </div>

                        {/* Vertical divider */}
                        <div
                            style={{
                                background:
                                    "linear-gradient(to bottom, transparent, rgba(255,115,0,0.3), rgba(255,77,0,0.3), transparent)",
                                margin: "8px 0",
                            }}
                        />

                        {/* Right column */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingLeft: "36px" }}>
                            {features.slice(3).map((f) => (
                                <FeatureRow key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub-caption */}
            <p
                style={{
                    textAlign: "center",
                    color: "rgba(255,255,255,0.3)",
                    fontSize: "14px",
                    marginTop: "28px",
                    marginBottom: "52px",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <span style={{ color: "white" }}>All features are available to all users. Forever free.</span>
            </p>

            {/* Price block */}
            <div
                style={{
                    textAlign: "center",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "flex-end",
                        gap: "6px",
                        lineHeight: 1,
                    }}
                >
                    <span
                        style={{
                            fontSize: "24px",
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.5)",
                            marginBottom: "16px",
                        }}
                    >
                        $
                    </span>
                    <span
                        style={{
                            fontSize: "96px",
                            fontWeight: 800,
                            letterSpacing: "-0.04em",
                            background: "linear-gradient(135deg, #ff4d00 0%, #ffa600 50%, #ff7300 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            lineHeight: 1,
                        }}
                    >
                        0
                    </span>
                    <span
                        style={{
                            fontSize: "20px",
                            fontWeight: 500,
                            color: "rgba(255,255,255,0.35)",
                            marginBottom: "16px",
                        }}
                    >
                        / forever
                    </span>
                </div>

                <p
                    style={{
                        color: "rgba(255,255,255,0.35)",
                        fontSize: "14px",
                        marginTop: "8px",
                    }}
                >
                    <span style={{ color: "white" }}>Start tracking your emails and resumes today. Completely free.</span>
                </p>

                {/* CTA Button */}
                <div style={{ marginTop: "32px" }}>
                    <Link to="/sign-up" style={{ textDecoration: "none" }}>
                        <motion.button
                            whileHover={{ opacity: 0.88 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                background: "#FF4D00",
                                color: "white",
                                border: "none",
                                borderRadius: "9px",
                                padding: "12px 28px",
                                fontSize: "15px",
                                fontWeight: 600,
                                cursor: "pointer",
                                letterSpacing: "-0.02em",
                                boxShadow: "0 4px 16px rgba(255,77,0,0.3)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                fontFamily: "'Inter', system-ui, sans-serif",
                            }}
                        >
                            Get started for free →
                        </motion.button>
                    </Link>
                </div>
            </div>

            <style>{`
        @keyframes borderShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
        </section>
    );
}

function FeatureRow({
    icon,
    title,
    desc,
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
}) {
    return (
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <div
                style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(255,115,0,0.08)",
                    border: "1px solid rgba(255,115,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.55)",
                    flexShrink: 0,
                }}
            >
                {icon}
            </div>
            <div>
                <div
                    style={{
                        color: "#ffffff",
                        fontWeight: 600,
                        fontSize: "15px",
                        letterSpacing: "-0.01em",
                        marginBottom: "4px",
                    }}
                >
                    {title}
                </div>
                <div
                    style={{
                        color: "rgba(255,255,255,0.38)",
                        fontSize: "13px",
                        lineHeight: 1.5,
                    }}
                >
                    {desc}
                </div>
            </div>
        </div>
    );
}