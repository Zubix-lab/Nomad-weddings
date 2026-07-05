"use client";

import React from "react";
import { ChevronLeft, Download, Printer, RefreshCw, Upload } from "lucide-react";
import type { Event } from "@/lib/types";

interface HeaderProps {
  activeEventId: string;
  setActiveEventId: (id: string) => void;
  events: Event[];
  title: string;
  eyebrow?: string;
  backupStatus?: string;
  onExportBackup: () => void;
  onImportBackup: () => void;
  onResetSeed: () => void;
  onBack?: () => void;
  mobileAction?: React.ReactNode;
  mobileVariant?: "default" | "sheet";
}

export function Header({
  activeEventId,
  setActiveEventId,
  events,
  title,
  eyebrow = "Operación Interna",
  backupStatus,
  onExportBackup,
  onImportBackup,
  onResetSeed,
  onBack,
  mobileAction,
  mobileVariant = "default"
}: HeaderProps) {
  return (
    <header className={mobileVariant === "sheet" ? "topbar mobile-sheet-topbar" : "topbar"}>
      <div className="topbar-title">
        {onBack && (
          <button className="mobile-back-button" type="button" onClick={onBack} aria-label="Volver">
            <ChevronLeft size={20} />
          </button>
        )}
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          {backupStatus && <p className="backup-status">{backupStatus}</p>}
        </div>
      </div>
      {mobileAction && <div className="mobile-topbar-action">{mobileAction}</div>}
      <div className="topbar-actions">
        <select
          className="event-select"
          value={activeEventId}
          onChange={(event) => setActiveEventId(event.target.value)}
          aria-label="Evento activo"
        >
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name} ({event.location})
            </option>
          ))}
        </select>
        <button className="icon-button" type="button" title="Exportar backup" aria-label="Exportar backup" onClick={onExportBackup}>
          <Download size={18} />
        </button>
        <button className="icon-button" type="button" title="Importar backup" aria-label="Importar backup" onClick={onImportBackup}>
          <Upload size={18} />
        </button>
        <button className="icon-button" type="button" title="Imprimir briefing" aria-label="Imprimir briefing" onClick={() => window.print()}>
          <Printer size={18} />
        </button>
        <button className="icon-button muted-danger" type="button" title="Restaurar datos demo" aria-label="Restaurar datos demo" onClick={onResetSeed}>
          <RefreshCw size={18} />
        </button>
      </div>
    </header>
  );
}
