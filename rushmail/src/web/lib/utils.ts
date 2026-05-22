import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEngagementLabel(score: number): { label: string; color: string; badge: string } {
  if (score >= 61) return { label: "Hot Lead", color: "#f43f5e", badge: "badge-hot" };
  if (score >= 31) return { label: "Warm Lead", color: "#f59e0b", badge: "badge-warm" };
  return { label: "Cold Lead", color: "#64748b", badge: "badge-cold" };
}

export function getGhostingBadge(status: string) {
  if (status === "Interested") return "badge-interested";
  if (status === "Possibly Ghosting") return "badge-ghosting";
  return "badge-neutral";
}

export function formatRelativeTime(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date);
  const now = Date.now();
  const diff = now - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

export function getEventIcon(type: string): string {
  const icons: Record<string, string> = {
    open: "📧",
    click: "🔗",
    resume_view: "📄",
    resume_download: "⬇️",
    portfolio_click: "🌐",
    sent: "✉️",
  };
  return icons[type] || "📌";
}

export function getEventLabel(type: string): string {
  const labels: Record<string, string> = {
    open: "Email opened",
    click: "Link clicked",
    resume_view: "Resume viewed",
    resume_download: "Resume downloaded",
    portfolio_click: "Portfolio visited",
    sent: "Email sent",
  };
  return labels[type] || type;
}
