"use client";

import React from "react";
import {
  ClipboardList,
  Users,
  CalendarDays,
  Search,
  WalletCards,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from "lucide-react";

export const tabs = [
  { id: "dashboard", label: "Dashboard", icon: ClipboardList },
  { id: "leads", label: "Clientes / CRM", icon: Users },
  { id: "events", label: "Bodas", icon: CalendarDays },
  { id: "vendors", label: "Proveedores", icon: Search },
  { id: "simulator", label: "Simulador", icon: WalletCards }
] as const;

export type TabId = typeof tabs[number]["id"];

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  minimized: boolean;
  setMinimized: (minimized: boolean) => void;
  onResetSeed?: () => void;
}

export function Sidebar({ activeTab, setActiveTab, minimized, setMinimized, onResetSeed }: SidebarProps) {
  return (
    <aside className={minimized ? "sidebar minimized" : "sidebar"}>
      <div className="brand-block">
        <div className="brand-mark">NW</div>
        {!minimized && (
          <div>
            <h1 style={{ fontSize: "18px", margin: 0, whiteSpace: "nowrap" }}>Nomad Weddings</h1>
          </div>
        )}
      </div>

      <nav className="nav-list" aria-label="Secciones" style={{ marginTop: "24px" }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "nav-item active" : "nav-item"}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
            >
              <Icon size={18} />
              {!minimized && <span>{tab.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-foot" style={{ marginTop: "auto", display: "grid", gap: "10px" }}>
        {onResetSeed && (
          <button
            className="secondary-button"
            onClick={onResetSeed}
            title="Restaurar base de datos"
            style={{
              padding: minimized ? "10px 0" : "8px 12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              minHeight: "auto",
              borderColor: "var(--outline-variant)",
              width: "100%"
            }}
          >
            <RefreshCw size={12} />
            {!minimized && <span>Restaurar BD</span>}
          </button>
        )}
        <button
          className="secondary-button"
          onClick={() => setMinimized(!minimized)}
          title={minimized ? "Expandir" : "Contraer"}
          style={{
            padding: "8px 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            minHeight: "auto",
            borderColor: "var(--outline-variant)"
          }}
        >
          {minimized ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
