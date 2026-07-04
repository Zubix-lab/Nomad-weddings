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
  ChevronRight,
  Home,
  MoreHorizontal
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

interface MobileTabBarProps {
  activeTab: TabId;
  isMoreOpen: boolean;
  setActiveTab: (tab: TabId) => void;
  onOpenMore: () => void;
}

export function MobileTabBar({ activeTab, isMoreOpen, setActiveTab, onOpenMore }: MobileTabBarProps) {
  const primaryItems = [
    { id: "dashboard" as const, label: "Inicio", icon: Home, onClick: () => setActiveTab("dashboard"), active: activeTab === "dashboard" && !isMoreOpen },
    { id: "events" as const, label: "Bodas", icon: CalendarDays, onClick: () => setActiveTab("events"), active: activeTab === "events" && !isMoreOpen },
    { id: "more" as const, label: "Más", icon: MoreHorizontal, onClick: onOpenMore, active: isMoreOpen || !["dashboard", "events"].includes(activeTab) }
  ];

  return (
    <nav className="mobile-tabbar" aria-label="Navegacion principal movil">
      <div className="mobile-tabbar-track">
        {primaryItems.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              className={tab.active ? "mobile-tab-item active" : "mobile-tab-item"}
              onClick={tab.onClick}
              aria-current={tab.active ? "page" : undefined}
            >
              <Icon size={19} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
