"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { MobileTabBar, Sidebar, tabs, type TabId } from "./components/Layout/Sidebar";
import { Header } from "./components/Layout/Header";
import type { Event, Task } from "@/lib/types";
import {
  ArrowRight,
  Users,
  CalendarDays,
  AlertTriangle,
  WalletCards,
  Database,
  Bot,
  Wand2,
  ClipboardList,
  FileText,
  Heart,
  Plus,
  Search,
  Bell,
  CheckCircle2,
  ReceiptText,
  X,
  Settings,
  Grid2X2,
  ChevronRight
} from "lucide-react";

// Components
import ProveedoresPage from "./components/Proveedores/ProveedoresPage";
import BodasPage from "./components/Bodas/BodasPage";
import BodaDetail from "./components/Bodas/BodaDetail";
import { BudgetSimulator } from "./components/Simulador/BudgetSimulator";
import { NotionWorkspace } from "./components/Notion/NotionWorkspace";
import { FinanzasPage } from "./components/Finanzas/FinanzasPage";
import { AgendaPage } from "./components/Agenda/AgendaPage";

function isTabId(value: string | null): value is TabId {
  return Boolean(value && tabs.some((tab) => tab.id === value));
}
function getTabFromLocation(): TabId | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#/, "");
  const hashParams = new URLSearchParams(hash);
  const hashTab = hashParams.get("tab");
  if (isTabId(hashTab)) return hashTab;
  const queryTab = new URL(window.location.href).searchParams.get("tab");
  return isTabId(queryTab) ? queryTab : null;
}

function urlForTab(tab: TabId): string {
  const url = new URL(window.location.href);
  url.hash = `tab=${tab}`;
  return `${url.pathname}${url.search}${url.hash}`;
}

function urlForMobileMore(): string {
  const url = new URL(window.location.href);
  url.hash = "tab=more";
  return `${url.pathname}${url.search}${url.hash}`;
}

function getHashTab(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.hash.replace(/^#/, "")).get("tab") || "";
}

const mobileWeddingImages = [
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=82",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=700&q=82",
  "https://images.unsplash.com/photo-1529634597503-139d3726fed5?auto=format&fit=crop&w=700&q=82",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=82"
];

const mobileDemoWeddings = [
  { name: "Laura & Javier", date: "2026-10-10", location: "Costa vasca", guests: 96, phase: "diseno", color: "#c88b28" },
  { name: "Sofia & Diego", date: "2026-06-14", location: "Palacio historico", guests: 180, phase: "proveedores", color: "#3868a8" },
  { name: "Ana & Pablo", date: "2026-09-05", location: "Carpa en finca", guests: 118, phase: "descubrimiento", color: "#7b56b3" },
  { name: "Marina & Alvaro", date: "2026-12-12", location: "Jardin privado", guests: 72, phase: "planificacion", color: "#8c8c8c" }
];

function formatMobileDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export default function Home() {
  const {
    leads,
    events,
    vendors,
    eventServices,
    tasks,
    calendarItems,
    workspacePages,
    workspaceBlocks,
    clients,
    parejaProfiles,
    initialized,
    resetToSeed,
    exportBackup,
    importBackup
  } = useApp();

  const [activeTab, setActiveTabState] = useState<TabId>(() => getTabFromLocation() || "dashboard");
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(() => getHashTab() === "more");
  const [mobileEventDetailOpen, setMobileEventDetailOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [activeEventId, setActiveEventId] = useState("");
  const [backupStatus, setBackupStatus] = useState("");
  const [notionFocus, setNotionFocus] = useState({ pageId: "", blockId: "" });
  const [financeFocusPaymentId, setFinanceFocusPaymentId] = useState("");
  const [createBodaRequestId, setCreateBodaRequestId] = useState(0);
  const backupInputRef = useRef<HTMLInputElement>(null);
  const bodaDetailRef = useRef<HTMLDivElement>(null);
  const isRestoringHistoryRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const selectedEventId = activeEventId || events[0]?.id || "";

  const setActiveTab = (tab: TabId) => {
    setMobileMoreOpen(false);
    setMobileEventDetailOpen(false);
    setActiveTabState(tab);
  };

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const updateViewport = () => setIsMobileViewport(media.matches);
    updateViewport();
    media.addEventListener("change", updateViewport);
    return () => media.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  useEffect(() => {
    const currentTab = getTabFromLocation() || "dashboard";
    window.history.replaceState({ ...(window.history.state || {}), nomadTab: currentTab }, "", urlForTab(currentTab));

    const handlePopState = () => {
      if (getHashTab() === "more") {
        isRestoringHistoryRef.current = true;
        setMobileMoreOpen(true);
        return;
      }
      const restoredTab = getTabFromLocation() || window.history.state?.nomadTab;
      if (!isTabId(restoredTab)) return;
      isRestoringHistoryRef.current = true;
      setMobileMoreOpen(false);
      setActiveTabState(restoredTab);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (isRestoringHistoryRef.current) {
      isRestoringHistoryRef.current = false;
      return;
    }
    if (mobileMoreOpen) return;
    if (getTabFromLocation() === activeTab && window.history.state?.nomadTab === activeTab) return;
    window.history.pushState({ ...(window.history.state || {}), nomadTab: activeTab }, "", urlForTab(activeTab));
  }, [activeTab, mobileMoreOpen]);

  const openMobileMore = () => {
    setMobileEventDetailOpen(false);
    setMobileMoreOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (getHashTab() !== "more") {
      window.history.pushState({ ...(window.history.state || {}), nomadMobileMore: true }, "", urlForMobileMore());
    }
  };

  const handleMobileBack = () => {
    if (mobileEventDetailOpen) {
      setMobileEventDetailOpen(false);
      return;
    }
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    setActiveTab("dashboard");
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    if (!touch || touch.clientX > 36) {
      touchStartRef.current = null;
      return;
    }
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];
    touchStartRef.current = null;
    if (!start || !touch) return;
    const deltaX = touch.clientX - start.x;
    const deltaY = Math.abs(touch.clientY - start.y);
    const elapsed = Date.now() - start.time;
    if (deltaX > 78 && deltaY < 48 && elapsed < 850) {
      window.history.back();
    }
  };

  // Determine active event
  const activeEvent = useMemo(() => {
    if (selectedEventId) {
      return events.find((e) => e.id === selectedEventId) || events[0];
    }
    return events[0];
  }, [events, selectedEventId]);

  // Calculations for Dashboard
  const activeWorkspaceBlocks = workspaceBlocks.filter((block) => block.eventId === selectedEventId);
  const workspacePayments = activeWorkspaceBlocks.filter((block) => block.type === "payment");
  const pendingWorkspacePayments = workspacePayments.filter((block) => block.status !== "pagado");
  const overdueWorkspacePayments = pendingWorkspacePayments.filter((block) => block.dueDate && new Date(`${block.dueDate}T00:00:00`) < new Date("2026-07-03T00:00:00"));
  const upcomingWorkspaceReminders = activeWorkspaceBlocks
    .filter((block) => !["hecha", "pagado", "contratado"].includes(String(block.status)))
    .map((block) => ({
      ...block,
      alertDate: block.reminderDate || block.dueDate || ""
    }))
    .filter((block) => block.alertDate)
    .filter((block) => {
      const distance = Math.ceil((new Date(`${block.alertDate}T00:00:00`).getTime() - new Date("2026-07-03T00:00:00").getTime()) / 86_400_000);
      return distance >= 0 && distance <= 21;
    })
    .sort((a, b) => new Date(`${a.alertDate}T00:00:00`).getTime() - new Date(`${b.alertDate}T00:00:00`).getTime())
    .slice(0, 4);
  const missingServices = eventServices.filter((s) => !s.vendorId);
  const totalSpend = eventServices.reduce((sum, s) => sum + Number(s.estimatedCost), 0);
  const workspaceProjectCount = events.filter((event) => workspacePages.some((page) => page.eventId === event.id)).length;
  const weddingProjects = events.map((event) => {
    const eventPages = workspacePages.filter((page) => page.eventId === event.id);
    const blocks = workspaceBlocks.filter((block) => block.eventId === event.id);
    const actionableBlocks = blocks.filter((block) => ["task", "milestone", "payment", "vendor"].includes(block.type));
    const completedBlocks = actionableBlocks.filter((block) => ["hecha", "pagado", "contratado"].includes(String(block.status)));
    const profiles = parejaProfiles.filter((profile) => profile.eventId === event.id);
    const pendingBlocks = blocks.filter((block) => ["task", "milestone", "vendor"].includes(block.type) && !["hecha", "contratado"].includes(String(block.status)));
    const pendingPaymentsForEvent = blocks.filter((block) => block.type === "payment" && block.status !== "pagado");
    const nextBlock = [...blocks]
      .filter((block) => !["hecha", "pagado", "contratado"].includes(String(block.status)) && (block.reminderDate || block.dueDate))
      .sort((a, b) => new Date(`${a.reminderDate || a.dueDate}T00:00:00`).getTime() - new Date(`${b.reminderDate || b.dueDate}T00:00:00`).getTime())[0];

    return {
      event,
      pageCount: eventPages.length,
      blockCount: blocks.length,
      pendingCount: pendingBlocks.length,
      pendingPayments: pendingPaymentsForEvent.length,
      profilesCount: profiles.length,
      nextBlock,
      completion: actionableBlocks.length > 0 ? Math.round((completedBlocks.length / actionableBlocks.length) * 100) : 0
    };
  });
  const workspaceProgress = activeWorkspaceBlocks.length > 0
    ? Math.round((activeWorkspaceBlocks.filter((block) => ["hecha", "pagado", "contratado"].includes(String(block.status))).length / activeWorkspaceBlocks.length) * 100)
    : 0;

  const upcomingCalendar = useMemo(() => {
    return [...calendarItems]
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
      .slice(0, 6);
  }, [calendarItems]);

  const currency = (val: number) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(val);
  };

  const tabTitle = (tab: TabId) => {
    const labels: Record<TabId, string> = {
      dashboard: "Dashboard de Operaciones",
      events: "Fichas de Bodas",
      notion: "Notion de Boda",
      agenda: "Agenda Operativa",
      vendors: "Base de Proveedores",
      finance: "Finanzas",
      simulator: "Simulador de Presupuesto"
    };
    return labels[tab];
  };

  const mobileTabTitle = (tab: TabId) => {
    const labels: Record<TabId, string> = {
      dashboard: "Nomad",
      events: "Bodas",
      notion: "Notion",
      agenda: "Agenda",
      vendors: "Proveedores",
      finance: "Finanzas",
      simulator: "Simulador"
    };
    return labels[tab];
  };

  const shouldShowMobileBack =
    mobileEventDetailOpen ||
    (!mobileMoreOpen && activeTab !== "dashboard" && activeTab !== "events");

  const headerTitle = mobileMoreOpen
    ? "M\u00e1s"
    : mobileEventDetailOpen
      ? "Ficha de boda"
      : isMobileViewport
        ? mobileTabTitle(activeTab)
        : tabTitle(activeTab);

  const headerEyebrow = isMobileViewport
    ? mobileMoreOpen
      ? "Explora todos los m\u00f3dulos"
      : activeTab === "dashboard"
        ? "WEDDINGS OPS"
        : activeTab === "events"
          ? "Tus proyectos de boda"
          : "Operacion Interna"
    : "Operacion Interna";

  const headerMobileAction = isMobileViewport && !mobileEventDetailOpen
    ? mobileMoreOpen
      ? (
        <button type="button" className="mobile-close-button" aria-label="Cerrar m\u00e1s" onClick={() => setActiveTab("dashboard")}>
          <X size={19} />
        </button>
      )
      : activeTab === "dashboard"
        ? (
          <button
            type="button"
            className="mobile-notification-button"
            aria-label="Avisos"
            onClick={() => {
              setMobileMoreOpen(false);
              setActiveEventId(selectedEventId);
              setFinanceFocusPaymentId("");
              setNotionFocus({ pageId: "", blockId: "" });
              setActiveTab("notion");
            }}
          >
            <Bell size={18} />
            <span>3</span>
          </button>
        )
        : activeTab === "events"
          ? (
            <button
              type="button"
              className="mobile-create-button"
              onClick={() => {
                setMobileMoreOpen(false);
                setActiveTab("events");
                setCreateBodaRequestId((current) => current + 1);
              }}
            >
              Crear boda <Plus size={16} />
            </button>
          )
          : null
    : null;

  const openNotion = (pageId?: string, blockId?: string) => {
    setMobileMoreOpen(false);
    setFinanceFocusPaymentId("");
    setNotionFocus({ pageId: pageId || "", blockId: blockId || "" });
    setActiveTab("notion");
  };

  const openBodaProject = (eventId?: string) => {
    setMobileMoreOpen(false);
    if (eventId) setActiveEventId(eventId);
    setActiveTab("events");
  };

  const startCreateBoda = () => {
    setMobileMoreOpen(false);
    setActiveTab("events");
    setCreateBodaRequestId((current) => current + 1);
  };

  const openBodaDetail = (eventId: string) => {
    setActiveEventId(eventId);
    window.setTimeout(() => {
      bodaDetailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const openNotionProject = (eventId: string) => {
    setMobileMoreOpen(false);
    setActiveEventId(eventId);
    setFinanceFocusPaymentId("");
    setNotionFocus({ pageId: "", blockId: "" });
    setActiveTab("notion");
  };

  const openFinance = (paymentId?: string) => {
    setMobileMoreOpen(false);
    setFinanceFocusPaymentId(paymentId || "");
    setActiveTab("finance");
  };

  const showBackupStatus = (message: string) => {
    setBackupStatus(message);
    window.setTimeout(() => setBackupStatus(""), 4500);
  };

  const handleExportBackup = () => {
    const backup = exportBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `nomad-weddings-backup-${backup.exportedAt.slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    showBackupStatus("Backup exportado.");
  };

  const handleImportBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const payload = JSON.parse(await file.text());
      const result = importBackup(payload);
      setActiveEventId("");
      showBackupStatus(`Backup importado: ${result.importedRecords} registros.`);
    } catch (error) {
      showBackupStatus(error instanceof Error ? error.message : "No se pudo importar el backup.");
    } finally {
      event.target.value = "";
    }
  };

  if (!initialized) {
    return (
      <main
        className={sidebarMinimized ? "app-shell sidebar-minimized" : "app-shell"}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} minimized={sidebarMinimized} setMinimized={setSidebarMinimized} />
        <section className="workspace">
          <div className="loading-panel">
            <div className="panel-action"><Database size={18} /></div>
            <h2>Preparando demo operativa</h2>
            <p>Cargando datos locales, agenda, proveedores y checklist.</p>
          </div>
        </section>
        <MobileTabBar activeTab={activeTab} isMoreOpen={mobileMoreOpen} setActiveTab={setActiveTab} onOpenMore={openMobileMore} />
      </main>
    );
  }

  return (
    <main
      className={sidebarMinimized ? "app-shell sidebar-minimized" : "app-shell"}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} minimized={sidebarMinimized} setMinimized={setSidebarMinimized} />

      <section className="workspace">
        <Header
          activeEventId={selectedEventId}
          setActiveEventId={setActiveEventId}
          events={events}
          title={headerTitle}
          eyebrow={headerEyebrow}
          backupStatus={backupStatus}
          onExportBackup={handleExportBackup}
          onImportBackup={() => backupInputRef.current?.click()}
          onResetSeed={resetToSeed}
          onBack={shouldShowMobileBack ? handleMobileBack : undefined}
          mobileAction={headerMobileAction}
          mobileVariant={mobileMoreOpen ? "sheet" : "default"}
        />
        <input
          ref={backupInputRef}
          className="visually-hidden-input"
          type="file"
          accept="application/json,.json"
          onChange={handleImportBackup}
          aria-hidden="true"
          tabIndex={-1}
        />

        {mobileMoreOpen ? (
          <MobileMoreMenu
            onOpenTab={setActiveTab}
            onExportBackup={handleExportBackup}
            onImportBackup={() => backupInputRef.current?.click()}
            onResetSeed={resetToSeed}
          />
        ) : activeTab === "dashboard" && (
          <>
          <MobileHomeScreen
            activeEvent={activeEvent}
            projects={weddingProjects}
            pendingPayments={pendingWorkspacePayments.length}
            reminders={upcomingWorkspaceReminders.length}
            missingServices={missingServices.length}
            workspaceProgress={workspaceProgress}
            onCreateBoda={startCreateBoda}
            onOpenBodas={() => setActiveTab("events")}
            onOpenBodaDetail={(eventId) => {
              setActiveEventId(eventId);
              setActiveTab("events");
              setMobileEventDetailOpen(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onOpenNotion={() => openNotionProject(selectedEventId)}
            onOpenFinance={() => openFinance()}
          />
          <div className="screen-grid desktop-dashboard">
            {/* 1. Header Banner */}
            <div className="dashboard-hero">
              <div>
                <h2 style={{ fontFamily: '"Source Serif 4", Georgia, serif', fontSize: "28px", color: "var(--primary)", margin: "0 0 6px 0" }}>Nomad Weddings Workspace</h2>
                <p style={{ margin: 0, color: "var(--slate-grey)", fontSize: "14px" }}>Crea una boda, completa la pareja y gestiona su roadmap Notion hasta el dia B.</p>
              </div>
              <button className="primary-button" type="button" onClick={startCreateBoda} style={{ marginLeft: "auto", display: "inline-flex", gap: "7px", alignItems: "center" }}>
                <Plus size={16} /> Crear boda
              </button>
            </div>

            {/* 2. Metrics (KPIs) */}
            <Metric
              label="Cuentas de boda"
              value={clients.length}
              detail="Parejas dentro de proyectos"
              icon={<Users size={18} />}
            />
            <Metric
              label="Proyectos Notion"
              value={events.length}
              detail={`${workspaceProjectCount} con workspace creado`}
              icon={<CalendarDays size={18} />}
            />
            <Metric
              label="Proveedores verificados"
              value={vendors.length}
              detail={`${vendors.filter(v => v.region === "Gipuzkoa").length} Gipuzkoa - ${vendors.filter(v => v.region === "Gran Canaria" || v.region === "Tenerife" || v.region === "Lanzarote").length} Canarias`}
              icon={<Search size={18} />}
            />
            <Metric
              label="Logistica y presupuesto"
              value={currency(totalSpend)}
              detail={`${pendingWorkspacePayments.length} pagos - ${upcomingWorkspaceReminders.length} avisos`}
              icon={<WalletCards size={18} />}
            />

            <Metric
              label="Progreso workspace"
              value={`${workspaceProgress}%`}
              detail={activeEvent?.name || "Sin boda activa"}
              icon={<ClipboardList size={18} />}
            />

            {/* 3. Wedding project board (Spans 3 columns) */}
            <section className="panel" style={{ gridColumn: "span 3" }}>
              <PanelHeader title="Proyectos Notion de bodas" action={<FileText size={18} />} />
              <WeddingProjectsPanel
                projects={weddingProjects}
                activeEventId={selectedEventId}
                onSelectProject={setActiveEventId}
                onOpenBoda={openBodaProject}
                onOpenNotion={openNotionProject}
                onOpenFinance={(eventId) => {
                  setActiveEventId(eventId);
                  openFinance();
                }}
              />
            </section>

            {/* 4. Agenda & Alerts Sidebar (Spans 1 column) */}
            <div style={{ display: "grid", gap: "16px", alignContent: "start" }}>
              <section className="panel">
                <PanelHeader title="Proximos Hitos" action={<CalendarDays size={18} />} />
                <div className="timeline-list" style={{ marginTop: "12px" }}>
                  {upcomingCalendar.map((item) => (
                    <div key={item.id} className="timeline-row" style={{ padding: "8px 0" }}>
                      <span className={`status-dot ${item.kind}`} />
                      <div style={{ minWidth: 0 }}>
                        <strong style={{ fontSize: "13px", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</strong>
                        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "var(--slate-grey)" }}>
                          {new Date(item.startsAt).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short"
                          })}{" "}
                          - {item.owner}
                        </p>
                      </div>
                    </div>
                  ))}
                  {upcomingCalendar.length === 0 && (
                    <div className="empty-state compact">Sin hitos proximos.</div>
                  )}
                </div>
              </section>

              <section className="panel">
                <PanelHeader title="Alertas de Coordinacion" action={<AlertTriangle size={18} />} />
                <div className="alert-list" style={{ marginTop: "12px", display: "grid", gap: "8px", fontSize: "12px" }}>
                  {missingServices.slice(0, 3).map((service) => {
                    const ev = events.find((e) => e.id === service.eventId);
                    return (
                      <p key={service.id} style={{ margin: 0, paddingLeft: "8px", borderLeft: "2px solid var(--secondary)", lineHeight: "1.4" }}>
                        Falta proveedor para <strong>{service.category}</strong> en {ev?.name || "boda"}.
                      </p>
                    );
                  })}
                  {tasks.filter((t) => t.status === "bloqueada").slice(0, 2).map((task) => (
                    <p key={task.id} style={{ margin: 0, paddingLeft: "8px", borderLeft: "2px solid var(--error)", lineHeight: "1.4" }}>
                      Bloqueada: {task.title} (Boda {events.find((e) => e.id === task.eventId)?.name}).
                    </p>
                  ))}
                  {overdueWorkspacePayments.slice(0, 2).map((payment) => (
                    <p key={payment.id} style={{ margin: 0, paddingLeft: "8px", borderLeft: "2px solid var(--error)", lineHeight: "1.4" }}>
                      Pago vencido: <strong>{payment.title}</strong> ({payment.dueDate}).
                    </p>
                  ))}
                  {upcomingWorkspaceReminders.map((block) => (
                    <p key={block.id} style={{ margin: 0, paddingLeft: "8px", borderLeft: "2px solid var(--secondary)", lineHeight: "1.4" }}>
                      Aviso Notion: <strong>{block.title}</strong> ({block.alertDate}).
                    </p>
                  ))}
                  {missingServices.length === 0 && tasks.filter((t) => t.status === "bloqueada").length === 0 && overdueWorkspacePayments.length === 0 && upcomingWorkspaceReminders.length === 0 && (
                    <p style={{ color: "var(--slate-grey)", margin: 0 }}>
                      Sin alertas pendientes en este momento.
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* 5. Agent Demo Panel (Spans 4 columns) */}
            <div style={{ gridColumn: "span 4" }}>
              <AgentDemoPanel activeEventId={activeEvent?.id || ""} leadId={leads[0]?.id || ""} />
            </div>
          </div>
          </>
        )}

        {activeTab === "events" && (
          <>
          <MobileWeddingsScreen
            projects={weddingProjects}
            activeEventId={selectedEventId}
            onCreateBoda={startCreateBoda}
            onOpenDetail={(eventId) => {
              setActiveEventId(eventId);
              setMobileEventDetailOpen(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onOpenNotion={openNotionProject}
            onOpenFinance={(eventId) => {
              setActiveEventId(eventId);
              openFinance();
            }}
            detail={mobileEventDetailOpen && selectedEventId ? <BodaDetail eventId={selectedEventId} /> : null}
          />
          <div className="desktop-events-flow" style={{ display: "grid", gap: "24px" }}>
            <BodasPage onSelectEvent={setActiveEventId} onOpenDetail={openBodaDetail} activeEventId={selectedEventId} createRequestId={createBodaRequestId} />
            {selectedEventId && (
              <div ref={bodaDetailRef} style={{ borderTop: "2px solid var(--outline-variant)", paddingTop: "20px", scrollMarginTop: "18px" }}>
                <BodaDetail eventId={selectedEventId} />
              </div>
            )}
          </div>
          </>
        )}

        {activeTab === "notion" && (
          <NotionWorkspace
            activeEventId={selectedEventId}
            events={events}
            focusPageId={notionFocus.pageId}
            focusBlockId={notionFocus.blockId}
          />
        )}

        {activeTab === "agenda" && (
          <AgendaPage
            activeEventId={selectedEventId}
            events={events}
            onOpenNotion={openNotion}
            onOpenFinance={openFinance}
          />
        )}

        {activeTab === "vendors" && <ProveedoresPage />}

        {activeTab === "finance" && (
          <FinanzasPage
            activeEventId={selectedEventId}
            events={events}
            onOpenNotion={openNotion}
            focusPaymentId={financeFocusPaymentId}
          />
        )}

        {activeTab === "simulator" && <BudgetSimulator />}
      </section>
      <MobileTabBar activeTab={activeTab} isMoreOpen={mobileMoreOpen} setActiveTab={setActiveTab} onOpenMore={openMobileMore} />
    </main>
  );
}

// Subcomponents helper
function MobileHomeScreen({
  activeEvent,
  projects,
  pendingPayments,
  reminders,
  missingServices,
  workspaceProgress,
  onCreateBoda,
  onOpenBodas,
  onOpenBodaDetail,
  onOpenNotion,
  onOpenFinance
}: {
  activeEvent?: Event;
  projects: WeddingProjectSummary[];
  pendingPayments: number;
  reminders: number;
  missingServices: number;
  workspaceProgress: number;
  onCreateBoda: () => void;
  onOpenBodas: () => void;
  onOpenBodaDetail: (eventId: string) => void;
  onOpenNotion: () => void;
  onOpenFinance: () => void;
}) {
  const nextProject = projects[0];
  const nextStep = nextProject?.nextBlock?.title || "Revisar roadmap y tareas pendientes";
  const heroImage = mobileWeddingImages[0];
  const heroDate = activeEvent ? formatMobileDate(activeEvent.date) : "24 ago 2026";
  const heroGuests = activeEvent?.guests || 120;

  return (
    <div className="mobile-app-screen mobile-home-screen">
      <section className="mobile-greeting">
        <h3>{"Buenos d\u00edas, Alex"}</h3>
        <p>{"Aqu\u00ed tienes el estado de hoy."}</p>
      </section>

      <section className="mobile-active-wedding">
        <span>Boda activa</span>
        <button type="button" className="mobile-hero-card" aria-label={`Boda activa, progreso ${workspaceProgress}%`} onClick={() => nextProject ? onOpenBodaDetail(nextProject.event.id) : onOpenBodas()}>
        <img src={heroImage} alt="" />
        <div className="mobile-photo-card-overlay" />
        <div>
          <span>Hoy</span>
          <h3>{activeEvent?.name || "Nomad Weddings"}</h3>
          <p>{nextStep}</p>
        </div>
        <strong><ChevronRight size={22} /></strong>
        <footer>
          <small><CalendarDays size={14} /> {heroDate}</small>
          <small><Users size={14} /> {heroGuests} invitados</small>
        </footer>
        </button>
      </section>

      <section className="mobile-primary-actions" aria-label="Acciones r\u00e1pidas">
        <h3>{"Acciones r\u00e1pidas"}</h3>
        <button type="button" onClick={onOpenNotion}>
          <CheckCircle2 size={22} /> Nueva tarea
        </button>
        <button type="button" onClick={onOpenNotion}>
          <CalendarDays size={22} /> {"Nueva reuni\u00f3n"}
        </button>
        <button type="button" onClick={onOpenFinance}>
          <ReceiptText size={22} /> Registrar gasto
        </button>
        <button type="button" className="accent" onClick={onCreateBoda}>
          <Plus size={24} /> Crear boda
        </button>
      </section>

      <section className="mobile-status-grid" aria-label="Resumen operativo">
        <h3>Resumen operativo</h3>
        <button type="button" onClick={onOpenBodas}>
          <span>Bodas activas</span>
          <strong>{projects.length}</strong>
          <small>Proyectos abiertos</small>
        </button>
        <button type="button" onClick={onOpenFinance}>
          <span>Pagos</span>
          <strong>{pendingPayments}</strong>
          <small>Pendientes</small>
        </button>
        <button type="button" onClick={onOpenNotion}>
          <span>Avisos</span>
          <strong>{reminders}</strong>
          <small>{"Pr\u00f3ximos 21 d\u00edas"}</small>
        </button>
        <button type="button" onClick={onOpenBodas}>
          <span>Sin proveedor</span>
          <strong>{missingServices}</strong>
          <small>Por cerrar</small>
        </button>
      </section>

      <section className="mobile-section">
        <div className="mobile-section-header">
          <h3>Siguiente boda</h3>
          <button type="button" onClick={onOpenBodas}>Ver todas</button>
        </div>
        {nextProject ? (
          <MobileWeddingCard
            project={nextProject}
            active={true}
            onOpenDetail={() => onOpenBodaDetail(nextProject.event.id)}
            onOpenNotion={() => onOpenNotion()}
            onOpenFinance={() => onOpenFinance()}
          />
        ) : (
          <div className="mobile-empty-card">Crea una boda para empezar el flujo operativo.</div>
        )}
      </section>
    </div>
  );
}

function MobileWeddingsScreen({
  projects,
  activeEventId,
  onCreateBoda,
  onOpenDetail,
  onOpenNotion,
  onOpenFinance,
  detail
}: {
  projects: WeddingProjectSummary[];
  activeEventId: string;
  onCreateBoda: () => void;
  onOpenDetail: (eventId: string) => void;
  onOpenNotion: (eventId: string) => void;
  onOpenFinance: (eventId: string) => void;
  detail: React.ReactNode;
}) {
  if (detail) {
    return <div className="mobile-app-screen mobile-wedding-detail">{detail}</div>;
  }

  const mobileItems = [
    ...projects.map((project, index) => ({
      id: project.event.id,
      name: project.event.name,
      date: project.event.date,
      phase: project.event.phase,
      image: mobileWeddingImages[index % mobileWeddingImages.length],
      color: "#167047",
      project
    })),
    ...mobileDemoWeddings.map((item, index) => ({
      id: `demo-${index}`,
      name: item.name,
      date: item.date,
      phase: item.phase,
      image: mobileWeddingImages[(index + 1) % mobileWeddingImages.length],
      color: item.color,
      project: null
    }))
  ].slice(0, 5);

  return (
    <div className="mobile-app-screen mobile-weddings-screen">
      <div className="mobile-filter-pills" aria-label="Filtro de bodas">
        <button type="button" className="active">Todas</button>
        <button type="button">En curso</button>
        <button type="button">{"Pr\u00f3ximas"}</button>
        <button type="button">Completadas</button>
      </div>
      <section className="mobile-module-intro">
        <div>
          <span>Bodas</span>
          <h3>Proyectos activos</h3>
          <p>Gestiona cada boda desde una ficha clara: pareja, roadmap, servicios y pagos.</p>
        </div>
        <button type="button" className="primary-button" onClick={onCreateBoda}>
          <Plus size={16} /> Crear
        </button>
      </section>

      <div className="mobile-wedding-list">
        {mobileItems.map((item) => (
          <MobileWeddingCard
            key={item.id}
            project={item.project || projects[0]}
            image={item.image}
            displayName={item.name}
            displayDate={item.date}
            displayPhase={item.phase}
            statusColor={item.color}
            active={item.id === activeEventId}
            onOpenDetail={() => item.project && onOpenDetail(item.project.event.id)}
            onOpenNotion={() => item.project && onOpenNotion(item.project.event.id)}
            onOpenFinance={() => item.project && onOpenFinance(item.project.event.id)}
          />
        ))}
        {projects.length === 0 && (
          <div className="mobile-empty-card">Todavia no hay bodas activas.</div>
        )}
      </div>
    </div>
  );
}

function MobileWeddingCard({
  project,
  image,
  displayName,
  displayDate,
  displayPhase,
  statusColor = "#167047",
  active,
  onOpenDetail,
  onOpenNotion,
  onOpenFinance
}: {
  project?: WeddingProjectSummary;
  image?: string;
  displayName?: string;
  displayDate?: string;
  displayPhase?: string;
  statusColor?: string;
  active: boolean;
  onOpenDetail: () => void;
  onOpenNotion: () => void;
  onOpenFinance: () => void;
}) {
  const date = formatMobileDate(displayDate || project?.event.date || "2026-08-24");
  const name = displayName || project?.event.name || "Boda";
  const phase = displayPhase || project?.event.phase || "planificacion";
  const location = project?.event.location || "Proyecto de boda";

  return (
    <article className={active ? "mobile-wedding-card active" : "mobile-wedding-card"}>
      {image && <img src={image} alt="" />}
      <button type="button" className="mobile-wedding-card-main" onClick={onOpenDetail}>
        <div>
          <span>{phase}</span>
          <h4>{name}</h4>
          <p>{date} · {location}</p>
          <small><i style={{ background: statusColor }} /> {phase}</small>
        </div>
        <strong><ChevronRight size={20} /></strong>
      </button>
      <div className="mobile-progress-line">
        <span style={{ width: `${project?.completion || 68}%` }} />
      </div>
      <div className="mobile-wedding-meta">
        <span>{project?.pendingCount || 4} tareas</span>
        <span>{project?.pendingPayments || 2} pagos</span>
        <span>{project?.profilesCount || 2}/2 pareja</span>
      </div>
      <div className="mobile-card-actions">
        <button type="button" onClick={onOpenDetail}>Ficha</button>
        <button type="button" onClick={onOpenNotion}>Notion</button>
        <button type="button" onClick={onOpenFinance}>Finanzas</button>
      </div>
    </article>
  );
}

function MobileMoreMenu({
  onOpenTab,
  onExportBackup,
  onImportBackup,
  onResetSeed
}: {
  onOpenTab: (tab: TabId) => void;
  onExportBackup: () => void;
  onImportBackup: () => void;
  onResetSeed: () => void;
}) {
  const modules: Array<{ tab: TabId | "data"; title: string; detail: string; icon: React.ReactNode; tone: string }> = [
    { tab: "notion", title: "Notion Workspace", detail: "Tareas, notas y documentos", icon: <FileText size={22} />, tone: "mint" },
    { tab: "agenda", title: "Agenda", detail: "Reuniones y eventos", icon: <CalendarDays size={22} />, tone: "peach" },
    { tab: "vendors", title: "Proveedores", detail: "Catálogo y contactos", icon: <Users size={22} />, tone: "lavender" },
    { tab: "finance", title: "Finanzas", detail: "Pagos, presupuestos y gastos", icon: <WalletCards size={22} />, tone: "aqua" },
    { tab: "simulator", title: "Simulador", detail: "Calcula y planifica escenarios", icon: <Grid2X2 size={22} />, tone: "sand" },
    { tab: "data", title: "Ajustes y datos", detail: "Preferencias y gestión", icon: <Settings size={22} />, tone: "aqua" }
  ];

  return (
    <div className="mobile-app-screen mobile-more-screen">
      <section className="mobile-module-intro">
        <div>
          <span>Modulos</span>
          <h3>Mas herramientas</h3>
          <p>Todo lo secundario queda aqui para que la navegacion principal respire.</p>
        </div>
      </section>

      <div className="mobile-more-list">
        {modules.map((module) => (
          <button key={module.tab} type="button" className="mobile-more-row" onClick={() => module.tab === "data" ? onExportBackup() : onOpenTab(module.tab)}>
            <span className={module.tone}>{module.icon}</span>
            <div>
              <strong>{module.title}</strong>
              <small>{module.detail}</small>
            </div>
            <ArrowRight size={16} />
          </button>
        ))}
      </div>

      <section className="mobile-more-data">
        <h3>Datos y demo</h3>
        <div>
          <button type="button" onClick={onExportBackup}>Exportar backup</button>
          <button type="button" onClick={onImportBackup}>Importar backup</button>
          <button type="button" onClick={onResetSeed}>Restaurar demo</button>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, detail, icon }: { label: string; value: string | number; detail: string; icon: React.ReactNode }) {
  return (
    <section className="metric">
      <div className="metric-icon">{icon}</div>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </section>
  );
}

function PanelHeader({ title, action }: { title: string; action: React.ReactNode }) {
  return (
    <div className="panel-header">
      <h3>{title}</h3>
      <div className="panel-action">{action}</div>
    </div>
  );
}

type AgentDemoResult = {
  title: string;
  endpoint: string;
  data: unknown;
};

function AgentDemoPanel({ activeEventId, leadId }: { activeEventId: string; leadId: string }) {
  const [loadingAction, setLoadingAction] = useState("");
  const [result, setResult] = useState<AgentDemoResult | null>(null);

  const postJson = (body: Record<string, string>) => ({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const runAction = async (title: string, endpoint: string, init?: RequestInit) => {
    setLoadingAction(title);
    try {
      const response = await fetch(endpoint, init);
      const data = await response.json();
      setResult({ title, endpoint, data });
    } catch (error) {
      setResult({
        title,
        endpoint,
        data: {
          error: error instanceof Error ? error.message : "No se pudo ejecutar la accion"
        }
      });
    } finally {
      setLoadingAction("");
    }
  };

  return (
    <section className="panel full agent-demo">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Demo operativa</p>
          <h3>Ops Agent con aprobacion humana</h3>
        </div>
        <div className="panel-action"><Bot size={18} /></div>
      </div>

      <div className="agent-demo-grid">
        <div className="agent-demo-actions">
          <button
            className="secondary-button"
            disabled={!activeEventId || Boolean(loadingAction)}
            onClick={() => runAction("Briefing de boda", `/api/events/${activeEventId}/brief`)}
          >
            <Wand2 size={16} /> Briefing
          </button>
          <button
            className="secondary-button"
            disabled={!activeEventId || Boolean(loadingAction)}
            onClick={() => runAction("Matching proveedores", "/api/agent/vendor-match", postJson({ eventId: activeEventId, category: "decoracion" }))}
          >
            <Wand2 size={16} /> Matching decoracion
          </button>
          <button
            className="secondary-button"
            disabled={!activeEventId || Boolean(loadingAction)}
            onClick={() => runAction("Borrador presupuesto", "/api/agent/budget-draft", postJson({ eventId: activeEventId }))}
          >
            <Wand2 size={16} /> Presupuesto
          </button>
          <button
            className="secondary-button"
            disabled={!activeEventId || Boolean(loadingAction)}
            onClick={() => runAction("Runbook dia B", "/api/agent/runbook", postJson({ eventId: activeEventId }))}
          >
            <Wand2 size={16} /> Runbook
          </button>
          <button
            className="secondary-button"
            disabled={!leadId || Boolean(loadingAction)}
            onClick={() => runAction("Respuesta a lead", "/api/agent/draft-reply", postJson({ leadId }))}
          >
            <Wand2 size={16} /> Respuesta lead
          </button>
        </div>

        <div className="agent-demo-output">
          {loadingAction ? (
            <div className="empty-state compact">Generando {loadingAction.toLowerCase()}...</div>
          ) : result ? (
            <>
              <div className="agent-demo-output-header">
                <strong>{result.title}</strong>
                <span>{result.endpoint}</span>
              </div>
              <pre>{JSON.stringify(result.data, null, 2)}</pre>
            </>
          ) : (
            <div className="empty-state compact">
              Ejecuta una accion para ver el contrato real del endpoint.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

interface WeddingProjectSummary {
  event: {
    id: string;
    name: string;
    date: string;
    location: string;
    guests: number;
    totalBudget: number;
    phase: string;
  };
  pageCount: number;
  blockCount: number;
  pendingCount: number;
  pendingPayments: number;
  profilesCount: number;
  completion: number;
  nextBlock?: {
    title: string;
    dueDate?: string;
    reminderDate?: string;
  };
}

function WeddingProjectsPanel({
  projects,
  activeEventId,
  onSelectProject,
  onOpenBoda,
  onOpenNotion,
  onOpenFinance
}: {
  projects: WeddingProjectSummary[];
  activeEventId: string;
  onSelectProject: (id: string) => void;
  onOpenBoda: (id: string) => void;
  onOpenNotion: (id: string) => void;
  onOpenFinance: (id: string) => void;
}) {
  const formatDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
  const money = (value: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

  if (projects.length === 0) {
    return (
      <div className="empty-state" style={{ marginTop: "12px" }}>
        Todavia no hay proyectos. Crea una boda para generar su ficha, pareja y roadmap.
      </div>
    );
  }

  return (
    <div className="wedding-project-board">
      {projects.map((project) => {
        const active = project.event.id === activeEventId;
        const coupleReady = project.profilesCount >= 2;
        const notionReady = project.pageCount > 0;
        const nextDate = project.nextBlock?.reminderDate || project.nextBlock?.dueDate;

        return (
          <article key={project.event.id} className={active ? "wedding-project-card active" : "wedding-project-card"}>
            <button className="wedding-project-main" type="button" onClick={() => onSelectProject(project.event.id)}>
              <div>
                <span className="pill">{project.event.phase}</span>
                <h4>{project.event.name}</h4>
                <p>{formatDate(project.event.date)} - {project.event.location} - {project.event.guests} invitados</p>
              </div>
              <strong>{project.completion}%</strong>
            </button>

            <div className="wedding-project-progress">
              <span style={{ width: `${project.completion}%` }} />
            </div>

            <div className="wedding-project-steps">
              <span className={notionReady ? "ready" : ""}><FileText size={13} /> {project.pageCount} paginas</span>
              <span className={coupleReady ? "ready" : ""}><Heart size={13} /> {project.profilesCount}/2 pareja</span>
              <span><ClipboardList size={13} /> {project.pendingCount} pendientes</span>
              <span><WalletCards size={13} /> {project.pendingPayments} pagos</span>
            </div>

            <div className="wedding-project-next">
              <small>Siguiente paso</small>
              <strong>{project.nextBlock?.title || "Completar briefing y roadmap inicial"}</strong>
              <span>{nextDate ? formatDate(nextDate) : money(project.event.totalBudget)}</span>
            </div>

            <div className="wedding-project-actions">
              <button className="secondary-button" type="button" onClick={() => onOpenBoda(project.event.id)}>
                Ficha boda
              </button>
              <button className="primary-button" type="button" onClick={() => onOpenNotion(project.event.id)}>
                Notion <ArrowRight size={14} />
              </button>
              <button className="secondary-button" type="button" onClick={() => onOpenFinance(project.event.id)}>
                Finanzas
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

// Notion-style Global Task Manager Subcomponent
interface GlobalTaskManagerProps {
  tasks: Task[];
  addTask: (t: Omit<Task, "id"> & { id?: string }) => string;
  updateTask: (t: Task) => void;
  deleteTask: (id: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function GlobalTaskManager({ tasks, addTask, updateTask, deleteTask }: GlobalTaskManagerProps) {
  const [title, setTitle] = React.useState("");
  const [owner, setOwner] = React.useState("Soraya");
  const [dueDate, setDueDate] = React.useState("");

  const globalTasks = React.useMemo(() => {
    return tasks.filter((t) => t.eventId === "global" || t.eventId === "" || !t.eventId);
  }, [tasks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      owner,
      dueDate: dueDate || new Date().toISOString().split("T")[0],
      status: "pendiente",
      eventId: "global"
    });
    setTitle("");
    setDueDate("");
  };

  const handleToggle = (task: Task) => {
    updateTask({
      ...task,
      status: task.status === "hecha" ? "pendiente" : "hecha"
    });
  };

  return (
    <div style={{ display: "grid", gap: "16px", marginTop: "12px" }}>
      {/* Task input form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", background: "var(--surface-low)", padding: "12px", borderRadius: "8px", border: "1px solid var(--outline-variant)" }}>
        <input
          type="text"
          placeholder="[+] Nueva tarea corporativa..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, minWidth: "200px", minHeight: "36px", padding: "6px 12px", fontSize: "13px" }}
          aria-label="Nueva tarea"
        />
        <select
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          style={{ width: "120px", minHeight: "36px", padding: "6px 10px", fontSize: "13px" }}
          aria-label="Responsable"
        >
          <option value="Soraya">Soraya</option>
          <option value="Aritz">Aritz</option>
          <option value="Nomad">Nomad</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ width: "130px", minHeight: "36px", padding: "6px 10px", fontSize: "13px" }}
          aria-label="Fecha limite"
        />
        <button type="submit" className="primary-button" style={{ minHeight: "36px", padding: "6px 16px", fontSize: "13px" }}>
          Anadir
        </button>
      </form>

      {/* Tasks list */}
      <div style={{ display: "grid", gap: "10px" }}>
        {globalTasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: "var(--pure-white)",
              border: "1px solid var(--line)",
              borderRadius: "8px",
              opacity: task.status === "hecha" ? 0.6 : 1,
              transition: "opacity 0.2s"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
              <input
                type="checkbox"
                checked={task.status === "hecha"}
                onChange={() => handleToggle(task)}
                style={{ width: "16px", height: "16px", flexShrink: 0, cursor: "pointer" }}
                aria-label="Marcar como hecha"
              />
              <span
                style={{
                  fontSize: "14px",
                  textDecoration: task.status === "hecha" ? "line-through" : "none",
                  color: task.status === "hecha" ? "var(--slate-grey)" : "var(--ink)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {task.title}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "12px", flexShrink: 0 }}>
              <span className="pill" style={{ fontSize: "11px", background: "var(--surface-low)", color: "var(--primary)" }}>
                {task.owner}
              </span>
              <span style={{ fontSize: "12px", color: "var(--slate-grey)" }}>
                {task.dueDate}
              </span>
              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                style={{
                  background: "transparent",
                  border: 0,
                  color: "var(--error)",
                  cursor: "pointer",
                  fontSize: "12px",
                  padding: "4px"
                }}
                title="Eliminar"
              >
                âœ•
              </button>
            </div>
          </div>
        ))}
        {globalTasks.length === 0 && (
          <div className="empty-state">No hay tareas corporativas. Anade una arriba para empezar!</div>
        )}
      </div>
    </div>
  );
}
