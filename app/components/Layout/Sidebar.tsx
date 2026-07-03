"use client";

import React from "react";
import {
  ClipboardList,
  CalendarDays,
  CalendarClock,
  Search,
  WalletCards,
  FileText,
  Calculator,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export const tabs = [
  { id: "dashboard", label: "Dashboard", icon: ClipboardList },
  { id: "events", label: "Bodas", icon: CalendarDays },
  { id: "notion", label: "Notion", icon: FileText },
  { id: "agenda", label: "Agenda", icon: CalendarClock },
  { id: "vendors", label: "Proveedores", icon: Search },
  { id: "finance", label: "Finanzas", icon: WalletCards },
  { id: "simulator", label: "Simulador", icon: Calculator }
] as const;

export type TabId = typeof tabs[number]["id"];

const mobileLabels: Record<TabId, string> = {
  dashboard: "Inicio",
  events: "Bodas",
  notion: "Notion",
  agenda: "Agenda",
  vendors: "Provs.",
  finance: "Fin.",
  simulator: "Sim."
};

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  minimized: boolean;
  setMinimized: (minimized: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, minimized, setMinimized }: SidebarProps) {
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

      <div className="sidebar-collapse">
        <button
          className="sidebar-collapse-button"
          onClick={() => setMinimized(!minimized)}
          title={minimized ? "Expandir" : "Contraer"}
        >
          {minimized ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}

export function MobileTabBar({ activeTab, setActiveTab }: Pick<SidebarProps, "activeTab" | "setActiveTab">) {
  return (
    <nav className="mobile-tabbar" aria-label="Navegacion principal movil">
      <div className="mobile-tabbar-track">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? "mobile-tab-item active" : "mobile-tab-item"}
              onClick={() => setActiveTab(tab.id)}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              <Icon size={19} />
              <span>{mobileLabels[tab.id]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
