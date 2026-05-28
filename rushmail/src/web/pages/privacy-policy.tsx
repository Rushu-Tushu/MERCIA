import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px" }}>
        <Link to="/">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--text-secondary)", marginBottom: 40, cursor: "pointer", fontSize: 14 }}>
            <ArrowLeft size={16} /> Back to home
          </span>
        </Link>
        
        <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700, letterSpacing: "-0.04em", marginBottom: 24 }}>
          Privacy Policy
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 48 }}>Last updated: May 2026</p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 32, lineHeight: 1.7, fontSize: 15, color: "rgba(255,255,255,0.8)" }}>
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>1. Information We Collect</h2>
            <p>When you use Mercia, we collect the following types of information:</p>
            <ul style={{ paddingLeft: 24, marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><strong>Account Information:</strong> Your name, email address, and authentication data.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our platform, including email opens, clicks, and tracking metrics.</li>
              <li><strong>Device & Log Data:</strong> IP addresses, browser types, and operating systems to ensure security and improve our service.</li>
            </ul>
          </section>
          
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>2. How We Use Your Information</h2>
            <p>We use your information strictly to provide, maintain, and improve our services. This includes powering our core tracking features, authenticating users, providing customer support, and analyzing usage trends to optimize the user experience.</p>
          </section>
          
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>3. Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal data from unauthorized access, alteration, or disclosure. All sensitive data is encrypted in transit and at rest. However, no internet transmission is completely secure, and we cannot guarantee absolute security.</p>
          </section>
          
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>4. Data Sharing & Third Parties</h2>
            <p>We never sell your personal data to third parties. We may share information with trusted service providers (such as hosting and email delivery partners) solely for the purpose of operating our service. These providers are bound by strict confidentiality agreements.</p>
          </section>
          
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>5. Your Rights</h2>
            <p>You have the right to access, correct, or permanently delete your personal data at any time. You can manage your account settings directly within the platform or contact our support team for assistance.</p>
          </section>
          
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>6. Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at support@mercia.app.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
