"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { Sidebar, type TabId } from "./components/Layout/Sidebar";
import { Header } from "./components/Layout/Header";
import type { Event, Vendor, VendorPrice, Task } from "@/lib/types";
import {
  Users,
  CalendarDays,
  AlertTriangle,
  WalletCards,
  Database,
  Bot,
  Wand2,
  ClipboardList,
  Search
} from "lucide-react";

// Components
import ProveedoresPage from "./components/Proveedores/ProveedoresPage";
import ClientesPage from "./components/Clientes/ClientesPage";
import BodasPage from "./components/Bodas/BodasPage";
import BodaDetail from "./components/Bodas/BodaDetail";
import { BudgetSimulator } from "./components/Simulador/BudgetSimulator";

export default function Home() {
  const {
    leads,
    events,
    vendors,
    vendorPrices,
    eventServices,
    tasks,
    calendarItems,
    checklistItems,
    clients,
    initialized,
    resetToSeed,
    addTask,
    updateTask,
    deleteTask
  } = useApp();

  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [activeEventId, setActiveEventId] = useState("");
  const selectedEventId = activeEventId || events[0]?.id || "";

  // Determine active event
  const activeEvent = useMemo(() => {
    if (selectedEventId) {
      return events.find((e) => e.id === selectedEventId) || events[0];
    }
    return events[0];
  }, [events, selectedEventId]);

  // Calculations for Dashboard
  const openTasks = checklistItems.filter((t) => !t.completada);
  const missingServices = eventServices.filter((s) => !s.vendorId);
  const totalSpend = eventServices.reduce((sum, s) => sum + Number(s.estimatedCost), 0);

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
      leads: "Clientes y CRM",
      events: "Fichas de Bodas",
      vendors: "Base de Proveedores",
      simulator: "Simulador de Presupuesto"
    };
    return labels[tab];
  };

  if (!initialized) {
    return (
      <main className={sidebarMinimized ? "app-shell sidebar-minimized" : "app-shell"}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} minimized={sidebarMinimized} setMinimized={setSidebarMinimized} onResetSeed={resetToSeed} />
        <section className="workspace">
          <div className="loading-panel">
            <div className="panel-action"><Database size={18} /></div>
            <h2>Preparando demo operativa</h2>
            <p>Cargando datos locales, agenda, proveedores y checklist.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={sidebarMinimized ? "app-shell sidebar-minimized" : "app-shell"}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} minimized={sidebarMinimized} setMinimized={setSidebarMinimized} onResetSeed={resetToSeed} />

      <section className="workspace">
        <Header
          activeEventId={selectedEventId}
          setActiveEventId={setActiveEventId}
          events={events}
          title={tabTitle(activeTab)}
        />

        {activeTab === "dashboard" && (
          <div className="screen-grid">
            {/* 1. Header Banner */}
            <div style={{ gridColumn: "span 4", background: "var(--surface-low)", border: "1px solid var(--outline-variant)", borderRadius: "8px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontFamily: '"Source Serif 4", Georgia, serif', fontSize: "28px", color: "var(--primary)", margin: "0 0 6px 0" }}>Nomad Weddings Workspace</h2>
                <p style={{ margin: 0, color: "var(--slate-grey)", fontSize: "14px" }}>Espacio de trabajo y Notion corporativo para la organización de bodas, clientes y proveedores.</p>
              </div>
            </div>

            {/* 2. Metrics (KPIs) */}
            <Metric
              label="Clientes / CRM"
              value={clients.length}
              detail="Parejas registradas en CRM"
              icon={<Users size={18} />}
            />
            <Metric
              label="Bodas activas"
              value={events.length}
              detail={`${checklistItems.filter((t) => !t.completada).length} tareas en bodas`}
              icon={<CalendarDays size={18} />}
            />
            <Metric
              label="Proveedores verificados"
              value={vendors.length}
              detail={`${vendors.filter(v => v.region === "Guipúzcoa").length} Gipuzkoa · ${vendors.filter(v => v.region === "Gran Canaria" || v.region === "Tenerife" || v.region === "Lanzarote").length} Canarias`}
              icon={<Search size={18} />}
            />
            <Metric
              label="Logística y presupuesto"
              value={currency(totalSpend)}
              detail="Total estimado contratado"
              icon={<WalletCards size={18} />}
            />

            {/* 3. Notion-Style task board (Spans 3 columns) */}
            <section className="panel" style={{ gridColumn: "span 3" }}>
              <PanelHeader title="Gestor de Tareas Corporativo (Notion-style)" action={<ClipboardList size={18} />} />
              <GlobalTaskManager tasks={tasks} addTask={addTask} updateTask={updateTask} deleteTask={deleteTask} />
            </section>

            {/* 4. Agenda & Alerts Sidebar (Spans 1 column) */}
            <div style={{ display: "grid", gap: "16px", alignContent: "start" }}>
              <section className="panel">
                <PanelHeader title="Próximos Hitos" action={<CalendarDays size={18} />} />
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
                          · {item.owner}
                        </p>
                      </div>
                    </div>
                  ))}
                  {upcomingCalendar.length === 0 && (
                    <div className="empty-state compact">Sin hitos próximos.</div>
                  )}
                </div>
              </section>

              <section className="panel">
                <PanelHeader title="Alertas de Coordinación" action={<AlertTriangle size={18} />} />
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
                  {missingServices.length === 0 && tasks.filter((t) => t.status === "bloqueada").length === 0 && (
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
        )}

        {activeTab === "leads" && <ClientesPage onSelectEvent={setActiveEventId} setActiveTab={setActiveTab} />}

        {activeTab === "events" && (
          <div style={{ display: "grid", gap: "24px" }}>
            <BodasPage onSelectEvent={setActiveEventId} activeEventId={selectedEventId} />
            {selectedEventId && (
              <div style={{ borderTop: "2px solid var(--outline-variant)", paddingTop: "20px" }}>
                <BodaDetail eventId={selectedEventId} />
              </div>
            )}
          </div>
        )}

        {activeTab === "vendors" && <ProveedoresPage />}

        {activeTab === "simulator" && <BudgetSimulator />}
      </section>
    </main>
  );
}

// Subcomponents helper
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

function Permission({ role, access }: { role: string; access: string }) {
  return (
    <div className="permission" style={{ padding: "16px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--pure-white)" }}>
      <strong>{role}</strong>
      <p style={{ margin: "6px 0 0 0", color: "var(--slate-grey)", fontSize: "13px", lineHeight: "1.4" }}>{access}</p>
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
          error: error instanceof Error ? error.message : "No se pudo ejecutar la acción"
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
          <h3>Ops Agent con aprobación humana</h3>
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
            <Wand2 size={16} /> Matching decoración
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
            onClick={() => runAction("Runbook día B", "/api/agent/runbook", postJson({ eventId: activeEventId }))}
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
              Ejecuta una acción para ver el contrato real del endpoint.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Notion-style Global Task Manager Subcomponent
interface GlobalTaskManagerProps {
  tasks: Task[];
  addTask: (t: Omit<Task, "id"> & { id?: string }) => string;
  updateTask: (t: Task) => void;
  deleteTask: (id: string) => void;
}

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
          aria-label="Fecha límite"
        />
        <button type="submit" className="primary-button" style={{ minHeight: "36px", padding: "6px 16px", fontSize: "13px" }}>
          Añadir
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
                ✕
              </button>
            </div>
          </div>
        ))}
        {globalTasks.length === 0 && (
          <div className="empty-state">No hay tareas corporativas. ¡Añade una arriba para empezar!</div>
        )}
      </div>
    </div>
  );
}
