import { Sidebar } from "./sidebar";
import { useState, useEffect } from "react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(220);

  useEffect(() => {
    const sidebar = document.querySelector("aside");
    if (!sidebar) return;
    const ro = new ResizeObserver(() => {
      setSidebarWidth(sidebar.offsetWidth);
    });
    ro.observe(sidebar);
    return () => ro.disconnect();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          marginLeft: sidebarWidth,
          padding: "24px",
          minHeight: "100vh",
          overflow: "auto",
          transition: "margin-left 0.2s ease",
        }}
      >
        {children}
      </main>
    </div>
  );
}
