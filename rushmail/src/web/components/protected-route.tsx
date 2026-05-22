import { Redirect } from "wouter";
import { authClient } from "../lib/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: "var(--bg)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          <p style={{ color: "var(--text-muted)", fontFamily: "Sora, sans-serif", fontSize: "14px" }}>Loading ColdPulse...</p>
        </div>
      </div>
    );
  }

  if (!session) return <Redirect to="/sign-in" />;
  return <>{children}</>;
}
