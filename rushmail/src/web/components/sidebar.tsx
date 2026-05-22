import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Send, BarChart3, FileText, Bell,
  Settings, ChevronLeft, ChevronRight, LogOut,
  FileSearch, Mail
} from "lucide-react";
import { authClient } from "../lib/auth";
import { useQuery } from "@tanstack/react-query";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Send, label: "Compose", path: "/compose" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Mail, label: "Emails", path: "/emails" },
  { icon: FileText, label: "Templates", path: "/templates" },
  { icon: FileSearch, label: "Resume Tracking", path: "/resume" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();
  const { data: session } = authClient.useSession();

  const { data: notifData } = useQuery({
    queryKey: ["notifications-unread"],
    queryFn: async () => {
      const res = await fetch("/api/notifications", { credentials: "include" });
      return res.json();
    },
    refetchInterval: 15000,
  });

  const unread = (notifData as any)?.unread ?? 0;

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const w = collapsed ? 56 : 220;

  return (
    <>
      <style>{`
        .sidebar-nav-item {
          transition: background 0.15s;
          outline: none !important;
        }
        .sidebar-nav-item:hover {
          background: rgba(255,255,255,0.04) !important;
        }
        .sidebar-nav-item:focus, .sidebar-nav-item:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }
        .sidebar-btn:hover {
          background: rgba(255,255,255,0.04) !important;
        }
        .sidebar-btn:focus, .sidebar-btn:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }
        .sidebar-signout:hover {
          background: rgba(239,68,68,0.08) !important;
        }
        .sidebar-link {
          outline: none !important;
          display: block;
        }
        .sidebar-link:focus, .sidebar-link:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>
      <aside
        style={{
          width: w,
          minWidth: w,
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 50,
          overflow: "hidden",
          transition: "width 0.2s ease",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{
          padding: collapsed ? "0 12px" : "0 16px",
          height: 56,
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          overflow: "hidden",
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            filter: "drop-shadow(0 0 6px rgba(255,77,0,0.55))",
          }}>
            <img src="/logo.svg" alt="ColdPulse" style={{ width: 22, height: 22, filter: "brightness(0) invert(1)" }} />
          </div>
          {!collapsed && (
            <span style={{
              fontWeight: 600,
              fontSize: 15,
              color: "var(--text)",
              whiteSpace: "nowrap",
              letterSpacing: "-0.01em",
            }}>
              ColdPulse
            </span>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "8px 6px", overflow: "hidden" }}>
          {navItems.map((item) => {
            const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
            return (
              <Link key={item.path} to={item.path} className="sidebar-link">
                <div
                  className="sidebar-nav-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: collapsed ? "7px 14px" : "7px 10px",
                    borderRadius: 6,
                    marginBottom: 1,
                    cursor: "pointer",
                    background: isActive ? "var(--accent-subtle)" : "transparent",
                    justifyContent: collapsed ? "center" : "flex-start",
                    position: "relative",
                  }}
                >
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <item.icon
                      size={16}
                      color={isActive ? "var(--accent)" : "var(--text-secondary)"}
                      strokeWidth={isActive ? 2 : 1.75}
                    />
                    {item.label === "Notifications" && unread > 0 && (
                      <span style={{
                        position: "absolute", top: -3, right: -4,
                        background: "#ef4444", color: "white", borderRadius: "50%",
                        width: 12, height: 12, fontSize: 8, display: "flex",
                        alignItems: "center", justifyContent: "center", fontWeight: 700,
                        lineHeight: 1,
                      }}>
                        {unread > 9 ? "9+" : unread}
                      </span>
                    )}
                  </div>
                  {!collapsed && (
                    <span style={{
                      fontSize: 13,
                      fontWeight: isActive ? 500 : 400,
                      color: isActive ? "var(--text)" : "var(--text-secondary)",
                      whiteSpace: "nowrap",
                    }}>
                      {item.label}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: user + sign out + collapse */}
        <div style={{ padding: "6px 6px 8px", borderTop: "1px solid var(--border)" }}>
          {/* User row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: collapsed ? "7px 14px" : "7px 10px",
            borderRadius: 6,
            marginBottom: 1,
            overflow: "hidden",
            justifyContent: collapsed ? "center" : "flex-start",
          }}>
            <div style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "var(--accent-subtle)",
              border: "1px solid var(--border-strong)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--accent)",
              flexShrink: 0,
            }}>
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            {!collapsed && (
              <div style={{ overflow: "hidden" }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {session?.user?.name || "User"}
                </p>
                <p style={{ fontSize: 11, color: "var(--text-tertiary)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {session?.user?.email}
                </p>
              </div>
            )}
          </div>

          {/* Sign out */}
          <button
            className="sidebar-signout"
            onClick={handleSignOut}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: collapsed ? "7px 14px" : "7px 10px",
              borderRadius: 6,
              width: "100%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              justifyContent: collapsed ? "center" : "flex-start",
              marginBottom: 1,
            }}
          >
            <LogOut size={15} color="var(--text-tertiary)" />
            {!collapsed && (
              <span style={{ fontSize: 13, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                Sign out
              </span>
            )}
          </button>

          {/* Collapse toggle */}
          <button
            className="sidebar-btn"
            onClick={() => setCollapsed(!collapsed)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "7px",
              borderRadius: 6,
              width: "100%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            {collapsed
              ? <ChevronRight size={14} color="var(--text-tertiary)" />
              : <ChevronLeft size={14} color="var(--text-tertiary)" />
            }
          </button>
        </div>
      </aside>
    </>
  );
}
