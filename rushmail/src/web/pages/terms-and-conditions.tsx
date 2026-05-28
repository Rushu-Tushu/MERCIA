import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px" }}>
        <Link to="/">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--text-secondary)", marginBottom: 40, cursor: "pointer", fontSize: 14 }}>
            <ArrowLeft size={16} /> Back to home
          </span>
        </Link>
        
        <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700, letterSpacing: "-0.04em", marginBottom: 24 }}>
          Terms & Conditions
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 48 }}>Last updated: May 2026</p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 32, lineHeight: 1.7, fontSize: 15, color: "rgba(255,255,255,0.8)" }}>
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>1. Introduction</h2>
            <p>Welcome to Mercia. By accessing or using our website (mercia.app) and services, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please do not use our services.</p>
          </section>
          
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>2. Service Description</h2>
            <p>Mercia provides email tracking, resume analytics, and related tools for job seekers and professionals. We reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice.</p>
          </section>
          
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>3. User Accounts</h2>
            <p>To use our services, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>
          </section>
          
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>4. Acceptable Use</h2>
            <p>You agree not to use Mercia to send spam, unsolicited emails, or any content that violates applicable laws. You must comply with all local, national, and international laws regarding email communication and data privacy (including GDPR and CAN-SPAM).</p>
          </section>
          
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>5. Limitation of Liability</h2>
            <p>In no event shall Mercia or its creators (Rushu-Tushu) be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the service. The service is provided "as is" without warranties of any kind.</p>
          </section>
          
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>6. Changes to Terms</h2>
            <p>We reserve the right to update or modify these Terms and Conditions at any time. We will notify users of significant changes via email or through the platform. Your continued use of the service after such changes constitutes acceptance of the new terms.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
