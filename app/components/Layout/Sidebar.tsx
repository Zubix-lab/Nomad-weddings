"use client";

import React from "react";
import {
  ClipboardList,
  Users,
  CalendarDays,
  Search,
  Palette,
  WalletCards,
  Mail,
  ShieldCheck
} from "lucide-react";

export const tabs = [
  { id: "dashboard", label: "Panel", icon: ClipboardList },
  { id: "leads", label: "Leads", icon: Users },
  { id: "events", label: "Bodas", icon: CalendarDays },
  { id: "vendors", label: "Proveedores", icon: Search },
  { id: "experience", label: "Experiencia", icon: Palette },
  { id: "simulator", label: "Simulador", icon: WalletCards },
  { id: "emails", label: "Emails", icon: Mail },
  { id: "governance", label: "RGPD", icon: ShieldCheck }
] as const;

export type TabId = typeof tabs[number]["id"];

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-mark">NW</div>
        <div>
          <p className="eyebrow" style={{ fontSize: "10px", margin: 0 }}>Nomad Weddings</p>
          <h1 style={{ fontSize: "18px", margin: 0, whiteSpace: "nowrap" }}>Gestión Ops</h1>
        </div>
      </div>
      <nav className="nav-list" aria-label="Secciones">
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
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-foot" style={{ marginTop: "auto", padding: "12px", borderRadius: "8px" }}>
        <p className="eyebrow" style={{ fontSize: "10px", margin: "0 0 4px 0" }}>Control de datos</p>
        <strong style={{ fontSize: "12px" }}>Persistencia local</strong>
        <span style={{ fontSize: "11px", display: "block", marginTop: "4px", lineHeight: "1.3" }}>
          Todos los cambios se guardan automáticamente en tu navegador.
        </span>
      </div>
    </aside>
  );
}
