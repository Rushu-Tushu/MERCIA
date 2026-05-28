import { useRef, useState } from "react";

const testimonials = [
    {
        name: "Arjun Mehta",
        role: "Product Manager @ Razorpay",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=ArjunMehta&backgroundColor=b6e3f4",
        quote:
            "Mercia completely changed how I approach cold outreach. I know exactly when a recruiter opens my resume — no more guessing games. Landed 3 interviews in a week.",
        logo: "https://logo.clearbit.com/razorpay.com",
        company: "Razorpay",
        accent: "#ff4d00",
    },
    {
        name: "Priya Venkataraman",
        role: "Senior SDE @ Swiggy",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=PriyaVenkataraman&backgroundColor=ffd5dc",
        quote:
            "The email tracking alone is worth it. But the resume tracker on top of that? I finally stopped sending emails into the void. Mercia gives you real signal.",
        logo: "https://logo.clearbit.com/swiggy.com",
        company: "Swiggy",
        accent: "#ff7300",
    },
    {
        name: "Rohan Kapoor",
        role: "Growth Lead @ CRED",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=RohanKapoor&backgroundColor=c0aede",
        quote:
            "I used to follow up blindly. Now I follow up with confidence because I see the open data. Mercia made my cold outreach 10x more strategic.",
        logo: "https://logo.clearbit.com/cred.club",
        company: "CRED",
        accent: "#ffa600",
    },
    {
        name: "Sneha Iyer",
        role: "UX Designer @ Zepto",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=SnehaIyer&backgroundColor=d1f4d1",
        quote:
            "As a designer cold-emailing hiring managers, knowing when they viewed my portfolio link was a game changer. Mercia is the tool I didn't know I needed.",
        logo: "https://logo.clearbit.com/zepto.com",
        company: "Zepto",
        accent: "#ff2a00",
    },
    {
        name: "Karthik Sundaram",
        role: "Engineering Manager @ Meesho",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=KarthikSundaram&backgroundColor=fde68a",
        quote:
            "Mercia tracks both my emails AND my resume links in one dashboard. It's clean, fast, and incredibly useful for anyone serious about their job search.",
        logo: "https://logo.clearbit.com/meesho.com",
        company: "Meesho",
        accent: "#ff4d00",
    },
    {
        name: "Divya Nair",
        role: "Startup Founder @ YC W24",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=DivyaNair&backgroundColor=fed7aa",
        quote:
            "I pitched 40 investors in a month. Mercia helped me see who was actually interested before I even got a reply. It's like having a secret edge in every conversation.",
        logo: "https://logo.clearbit.com/ycombinator.com",
        company: "Y Combinator",
        accent: "#ff7300",
    },
];

// Duplicate for seamless loop
const allTestimonials = [...testimonials, ...testimonials];

function StarRating() {
    return (
        <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
            {[...Array(5)].map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#ffa600">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </div>
    );
}

function QuoteIcon({ color }: { color: string }) {
    return (
        <svg
            width="28"
            height="20"
            viewBox="0 0 28 20"
            fill="none"
            style={{ marginBottom: "12px", opacity: 0.9 }}
        >
            <path
                d="M0 20V12.667C0 9.556 0.778 6.889 2.333 4.667 3.889 2.444 6.222 0.889 9.333 0l1.334 2.333C8.444 3.111 7 4.222 6 5.667 5 7.111 4.444 8.667 4.333 10.333H8V20H0zm16 0V12.667c0-3.111.778-5.778 2.333-8C19.889 2.444 22.222.889 25.333 0l1.334 2.333c-2.223.778-3.667 1.889-4.667 3.334C21 7.111 20.444 8.667 20.333 10.333H24V20H16z"
                fill={color}
            />
        </svg>
    );
}

interface TestimonialCardProps {
    item: (typeof testimonials)[0];
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

function TestimonialCard({ item, onMouseEnter, onMouseLeave }: TestimonialCardProps) {
    const [imgError, setImgError] = useState(false);

    return (
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                width: "340px",
                flexShrink: 0,
                borderRadius: "16px",
                padding: "28px",
                background:
                    "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)",
                border: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(12px)",
                boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.45), 0 0 40px ${item.accent}0d`,
                position: "relative",
                overflow: "hidden",
                cursor: "default",
                transition: "box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease",
                userSelect: "none",
                display: "flex",
                flexDirection: "column",
            }}
            onMouseOver={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#ff4d00";
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 1px #ff4d00, 0 12px 48px rgba(0,0,0,0.8), 0 0 80px rgba(255,77,0,0.4), inset 0 0 20px rgba(255,77,0,0.15)`;
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
            }}
            onMouseOut={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.45), 0 0 40px ${item.accent}0d`;
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            }}
        >
            {/* Ambient glow blob */}
            <div
                style={{
                    position: "absolute",
                    top: "-60px",
                    left: "-60px",
                    width: "220px",
                    height: "220px",
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${item.accent}22 0%, transparent 70%)`,
                    pointerEvents: "none",
                }}
            />

            <QuoteIcon color={item.accent} />
            <StarRating />

            <p
                style={{
                    color: "rgba(255,255,255,0.82)",
                    fontSize: "14.5px",
                    lineHeight: "1.75",
                    fontWeight: 400,
                    marginBottom: "24px",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    letterSpacing: "0.01em",
                    flex: 1,
                }}
            >
                "{item.quote}"
            </p>

            {/* Divider */}
            <div
                style={{
                    height: "1px",
                    background: `linear-gradient(90deg, transparent, ${item.accent}40, transparent)`,
                    marginBottom: "20px",
                }}
            />

            {/* Author row */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                    style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: `2px solid ${item.accent}66`,
                        flexShrink: 0,
                        background: "rgba(255,255,255,0.05)",
                    }}
                >
                    <img
                        src={item.avatar}
                        alt={item.name}
                        width={44}
                        height={44}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={() => setImgError(true)}
                    />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "14px",
                            fontFamily: "'Inter', system-ui, sans-serif",
                            letterSpacing: "0.01em",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {item.name}
                    </div>
                    <div
                        style={{
                            color: "rgba(255,255,255,0.45)",
                            fontSize: "12px",
                            fontFamily: "'Inter', system-ui, sans-serif",
                            marginTop: "2px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {item.role}
                    </div>
                </div>
                {/* Company logo */}
                <div
                    style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        border: "1px solid rgba(255,255,255,0.1)",
                    }}
                >
                    <img
                        src={item.logo}
                        alt={item.company}
                        width={20}
                        height={20}
                        style={{ width: "20px", height: "20px", objectFit: "contain" }}
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default function TestimonialsSection() {
    const [paused, setPaused] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);

    return (
        <section
            id="analytics"
            style={{
                background: "#000000",
                padding: "100px 0",
                overflow: "hidden",
                position: "relative",
                fontFamily: "'Inter', system-ui, sans-serif",
            }}
        >
            {/* Background texture */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,77,0,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(255,166,0,0.04) 0%, transparent 60%)",
                    pointerEvents: "none",
                }}
            />

            {/* Noise overlay for depth */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.025,
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    pointerEvents: "none",
                }}
            />

            {/* Header */}
            <div
                style={{
                    textAlign: "center",
                    marginBottom: "64px",
                    padding: "0 24px",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Eyebrow */}
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "rgba(255,77,0,0.12)",
                        border: "1px solid rgba(255,77,0,0.25)",
                        borderRadius: "100px",
                        padding: "6px 16px",
                        marginBottom: "24px",
                    }}
                >
                    <div
                        style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "#ff4d00",
                            boxShadow: "0 0 8px #ff4d00",
                        }}
                    />
                    <span
                        style={{
                            color: "#ff7300",
                            fontSize: "12px",
                            fontWeight: 600,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                        }}
                    >
                        Loved by professionals
                    </span>
                </div>

                <h2
                    style={{
                        color: "#ffffff",
                        fontSize: "clamp(28px, 4vw, 48px)",
                        fontWeight: 700,
                        lineHeight: 1.2,
                        letterSpacing: "-0.02em",
                        margin: "0 auto",
                        maxWidth: "640px",
                    }}
                >
                    What people have said{" "}
                    <span
                        style={{
                            background: "linear-gradient(90deg, #ff4d00, #ffa600)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        how good Mercia is
                    </span>
                </h2>

                <p
                    style={{
                        color: "rgba(255,255,255,0.45)",
                        fontSize: "16px",
                        marginTop: "16px",
                        maxWidth: "440px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        lineHeight: 1.6,
                    }}
                >
                    Real stories from people who turned cold emails into warm conversations.
                </p>
            </div>

            {/* Marquee */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    maskImage:
                        "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
                    WebkitMaskImage:
                        "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
                }}
            >
                <style>{`
          @keyframes marquee-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-track {
            display: flex;
            gap: 24px;
            width: max-content;
            padding: 32px 0;
            animation: marquee-scroll 40s linear infinite;
          }
          .marquee-track.paused {
            animation-play-state: paused;
          }
        `}</style>

                <div
                    ref={trackRef}
                    className={`marquee-track${paused ? " paused" : ""}`}
                >
                    {allTestimonials.map((item, idx) => (
                        <TestimonialCard
                            key={idx}
                            item={item}
                            onMouseEnter={() => setPaused(true)}
                            onMouseLeave={() => setPaused(false)}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom stat row */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "48px",
                    marginTop: "72px",
                    padding: "0 24px",
                    position: "relative",
                    zIndex: 1,
                    flexWrap: "wrap",
                }}
            >
                {[
                    { value: "2,000+", label: "emails tracked" },
                    { value: "4.9 / 5", label: "average rating" },
                    { value: "7x", label: "more reply rate" },
                ].map((stat) => (
                    <div key={stat.label} style={{ textAlign: "center" }}>
                        <div
                            style={{
                                fontSize: "28px",
                                fontWeight: 700,
                                letterSpacing: "-0.02em",
                                background: "linear-gradient(90deg, #ff4d00, #ffa600)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            {stat.value}
                        </div>
                        <div
                            style={{
                                color: "rgba(255,255,255,0.4)",
                                fontSize: "13px",
                                marginTop: "4px",
                                letterSpacing: "0.03em",
                            }}
                        >
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}