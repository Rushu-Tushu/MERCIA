import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuroraText } from "./aurora-text";

const faqs = [
  {
    q: "Does the recipient know they're being tracked?",
    a: "Open tracking uses an invisible 1x1 pixel — standard practice in email marketing. Link tracking uses redirect URLs.",
  },
  {
    q: "How accurate is the open tracking?",
    a: "Very accurate for most email clients. Some clients (like Apple Mail Privacy Protection) may show phantom opens — we automatically flag these so your data stays clean.",
  },
  {
    q: "Can I use my own email to send?",
    a: "Yes. You can connect your SMTP server or use our built-in sending integration. Your emails will always come from your address.",
  },
  {
    q: "Is my data secure?",
    a: "All data is stored securely in encrypted databases. We never sell your data, and you can permanently delete your account at any time.",
  },
  {
    q: "Can I track PDF resumes?",
    a: "Yes! You can upload your PDF resume and we generate a uniquely trackable link. You'll see exactly when they open it.",
  },
  {
    q: "How many emails can I track per month?",
    a: "Our free plan allows unlimited email tracking forever. Advanced features like link tracking and detailed analytics have different limits based on your tier.",
  },
  {
    q: "Does it work with Gmail or Outlook?",
    a: "Yes! We integrate seamlessly with Gmail, Outlook, and most major email providers through our browser extension and simple SMTP connections.",
  },
  {
    q: "What happens if someone forwards my email?",
    a: "If your email is forwarded, additional opens will be tracked. Our system intelligently groups these to help you identify when an email is being shared internally.",
  },
  {
    q: "Can I disable tracking for certain emails?",
    a: "Absolutely. You can toggle tracking on or off for individual emails directly from your compose window before hitting send.",
  },
  {
    q: "Do you offer team plans?",
    a: "Yes, team plans are available. You can invite colleagues, share high-converting templates, and view team-wide analytics on our premium tiers.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" style={{ padding: "100px 24px", background: "#000000" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{
            fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700,
            letterSpacing: "-0.04em", margin: 0
          }}>
            <AuroraText colors={["#ff4d00", "#ff7300", "#ffa600", "#ff2a00"]}>FAQs</AuroraText>
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={false}
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "background 0.3s, border-color 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(255, 77, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                }}
              >
                <button
                  onClick={() => toggleFaq(i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px 24px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "white",
                  }}
                >
                  <span style={{
                    fontSize: "16px",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    color: isOpen ? "#FF4D00" : "rgba(255,255,255,0.9)",
                    transition: "color 0.2s"
                  }}>
                    {faq.q}
                  </span>
                  <div style={{
                    position: "relative",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0, opacity: isOpen ? 0 : 1 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ position: "absolute" }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </motion.div>
                    <motion.div
                      animate={{ rotate: isOpen ? 0 : -180, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ position: "absolute" }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF4D00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </motion.div>
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div style={{
                        padding: "0 24px 20px 24px",
                        color: "rgba(255,255,255,0.6)",
                        fontSize: "15px",
                        lineHeight: 1.6,
                        letterSpacing: "-0.01em"
                      }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
