"use client";

import React from "react";
import { Download } from "lucide-react";
import type { Event } from "@/lib/types";

interface HeaderProps {
  activeEventId: string;
  setActiveEventId: (id: string) => void;
  events: Event[];
  title: string;
}

export function Header({ activeEventId, setActiveEventId, events, title }: HeaderProps) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Operación Interna</p>
        <h2>{title}</h2>
      </div>
      <div className="topbar-actions">
        <select
          value={activeEventId}
          onChange={(e) => setActiveEventId(e.target.value)}
          aria-label="Evento activo"
          style={{ width: "240px" }}
        >
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name} ({event.location})
            </option>
          ))}
        </select>
        <button className="icon-button" title="Imprimir briefing" onClick={() => window.print()}>
          <Download size={18} />
        </button>
      </div>
    </header>
  );
}
