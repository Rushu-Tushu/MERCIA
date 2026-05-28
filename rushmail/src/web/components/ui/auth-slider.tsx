import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  { img: "/mercia-2.jpg", text: "Cold approaches opens doors to new beginnings" },
  { img: "/mercia-3.jpg", text: "Sit back and relax while we track your email approaches" },
  { img: "/mercia-4.jpg", text: "We work in a professional way and use your own email addresses" },
  { img: "/mercia-5.jpg", text: "Expect instant replies and track your cold email strategies" },
  { img: "/mercia-6.jpg", text: "By analyzing your flaws in cold approaches, you are not far away from your next interview" },
  { img: "/mercia-7.jpg", text: "Act smart and invest your time elsewhere instead of taking tension of emails" },
  { img: "/mercia-8.jpg", text: "Upgrade your skills while we track your emails, we deliver results" },
];

export function AuthSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      flex: 1,
      position: "relative",
      overflow: "hidden",
      background: "#000",
      height: "100%",
    }}>
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={slides[currentIndex].img}
          alt="Mercia Preview"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </AnimatePresence>

      {/* Dark shadow overlay (65%) */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0, 0, 0, 0.65)",
        zIndex: 10,
      }} />

      {/* Logo positioning (top left) */}
      <div style={{ position: "absolute", top: 40, left: 44, zIndex: 20, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src="/Mercia.png" alt="Merica" style={{ width: 22, height: 22, objectFit: "contain" }} />
        </div>
        <span style={{ fontWeight: 600, fontSize: 15, color: "#fafafa", letterSpacing: "-0.02em" }}>Merica</span>
      </div>

      {/* Text overlay */}
      <div style={{
        position: "absolute",
        bottom: 80,
        left: 44,
        right: 44,
        zIndex: 20,
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <h2 style={{
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 600,
              color: "#ffffff",
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
              maxWidth: "600px",
            }}>
              "{slides[currentIndex].text}"
            </h2>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
