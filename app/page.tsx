"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { Sidebar, type TabId } from "./components/Layout/Sidebar";
import { Header } from "./components/Layout/Header";
import {
  Users,
  CalendarDays,
  AlertTriangle,
  WalletCards,
  ShieldCheck,
  Palette,
  MapPin,
  Utensils,
  Database
} from "lucide-react";

// Components
import ProveedoresPage from "./components/Proveedores/ProveedoresPage";
import ClientesPage from "./components/Clientes/ClientesPage";
import BodasPage from "./components/Bodas/BodasPage";
import BodaDetail from "./components/Bodas/BodaDetail";
import { BudgetSimulator } from "./components/Simulador/BudgetSimulator";
import EmailTemplatesPage from "./components/Emails/EmailTemplatesPage";

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
    resetToSeed
  } = useApp();

  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [activeEventId, setActiveEventId] = useState("");

  // Determine active event
  const activeEvent = useMemo(() => {
    if (activeEventId) {
      return events.find((e) => e.id === activeEventId) || events[0];
    }
    return events[0];
  }, [events, activeEventId]);

  // Set default active event if none selected
  React.useEffect(() => {
    if (events.length > 0 && !activeEventId) {
      setActiveEventId(events[0].id);
    }
  }, [events, activeEventId]);

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
      dashboard: "Panel operativo",
      leads: "CRM y Clientes",
      events: "Fichas de Bodas",
      vendors: "Base de Proveedores",
      experience: "Configurador de Experiencia",
      simulator: "Simulador de Presupuesto",
      emails: "Plantillas de Email",
      governance: "RGPD y Gobernanza"
    };
    return labels[tab];
  };

  return (
    <main className="app-shell">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <section className="workspace">
        <Header
          activeEventId={activeEventId}
          setActiveEventId={setActiveEventId}
          events={events}
          title={tabTitle(activeTab)}
        />

        {activeTab === "dashboard" && (
          <div className="screen-grid">
            <Metric
              label="Leads abiertos"
              value={leads.filter((l) => !["won", "lost"].includes(l.status)).length}
              detail="Pipeline comercial activo"
              icon={<Users size={18} />}
            />
            <Metric
              label="Bodas activas"
              value={events.length}
              detail={`${openTasks.length} tareas pendientes`}
              icon={<CalendarDays size={18} />}
            />
            <Metric
              label="Servicios sin proveedor"
              value={missingServices.length}
              detail="Shortlist recomendada"
              icon={<AlertTriangle size={18} />}
            />
            <Metric
              label="Gasto en proveedores"
              value={currency(totalSpend)}
              detail="Tarifas reales + estimaciones"
              icon={<WalletCards size={18} />}
            />

            <section className="panel wide">
              <PanelHeader title="Agenda y Hitos de Bodas" action={<CalendarDays size={18} />} />
              <div className="timeline-list">
                {upcomingCalendar.map((item) => (
                  <div key={item.id} className="timeline-row">
                    <span className={`status-dot ${item.kind}`} />
                    <div>
                      <strong>{item.title}</strong>
                      <p>
                        {new Date(item.startsAt).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}{" "}
                        · {item.owner}
                      </p>
                    </div>
                    <span className="pill">{item.kind}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel">
              <PanelHeader title="Alertas de Coordinación" action={<AlertTriangle size={18} />} />
              <div className="alert-list">
                {missingServices.map((service) => {
                  const ev = events.find((e) => e.id === service.eventId);
                  return (
                    <p key={service.id}>
                      Falta proveedor para <strong>{service.category}</strong> en {ev?.name || "boda"}.
                    </p>
                  );
                })}
                {tasks.filter((t) => t.status === "bloqueada").map((task) => (
                  <p key={task.id}>
                    Bloqueada: {task.title} (Boda {events.find((e) => e.id === task.eventId)?.name}).
                  </p>
                ))}
                {eventServices.length === 0 && (
                  <p style={{ color: "var(--slate-grey)", background: "transparent", borderLeft: 0, paddingLeft: 0 }}>
                    Sin alertas pendientes en este momento.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === "leads" && <ClientesPage />}

        {activeTab === "events" && (
          <div style={{ display: "grid", gap: "24px" }}>
            <BodasPage onSelectEvent={setActiveEventId} activeEventId={activeEventId} />
            {activeEventId && (
              <div style={{ borderTop: "2px solid var(--outline-variant)", paddingTop: "20px" }}>
                <BodaDetail eventId={activeEventId} />
              </div>
            )}
          </div>
        )}

        {activeTab === "vendors" && <ProveedoresPage />}

        {activeTab === "experience" && activeEvent && (
          <ExperienceConfigurator
            activeEvent={activeEvent}
            vendors={vendors}
            vendorPrices={vendorPrices}
          />
        )}

        {activeTab === "simulator" && <BudgetSimulator />}

        {activeTab === "emails" && <EmailTemplatesPage />}

        {activeTab === "governance" && (
          <div className="screen-grid">
            <section className="panel wide">
              <PanelHeader title="Permisos de la Aplicación" action={<ShieldCheck size={18} />} />
              <div className="permission-grid">
                <Permission role="Admin / Socio" access="Acceso ilimitado a clientes, contabilidad, proveedores, emails y control del RGPD." />
                <Permission role="Planner Colaborador" access="Acceso exclusivo a bodas asignadas, checklist, runbook y contacto con proveedores." />
                <Permission role="Solo lectura (Parejas)" access="Acceso controlado a su checklist personal, documentos aprobados y presupuesto." />
              </div>
            </section>
            
            <section className="panel">
              <PanelHeader title="Auditoría RGPD" action={<ShieldCheck size={18} />} />
              <div className="compact-list" style={{ fontSize: "13px", lineHeight: "1.5" }}>
                <p>✓ Registro de consentimiento de datos en leads comerciales.</p>
                <p>✓ Opción de exportar y anonimizar datos personales de parejas.</p>
                <p>✓ Registro interno de cambios de precios y presupuestos.</p>
                <p>✓ Servidores locales y almacenamiento encriptado.</p>
              </div>
            </section>

            <section className="panel">
              <PanelHeader title="Base de Datos" action={<Database size={18} />} />
              <div style={{ display: "grid", gap: "10px" }}>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--slate-grey)" }}>
                  Restaura la base de datos a su estado original para cargar la semilla de 35+ proveedores y coordinaciones.
                </p>
                <button
                  className="primary-button"
                  style={{ background: "var(--secondary)" }}
                  onClick={resetToSeed}
                >
                  Restaurar Datos Semilla
                </button>
              </div>
            </section>

            <section className="panel full">
              <PanelHeader title="Clientes y Consentimiento RGPD" action={<Users size={18} />} />
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Pareja / Cliente</th>
                      <th>Preferencias de Boda</th>
                      <th>Estado de Consentimiento</th>
                      <th>Notas de Privacidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id}>
                        <td style={{ fontWeight: "bold" }}>{client.coupleName}</td>
                        <td>{client.preferences.join(", ") || "No definidas"}</td>
                        <td>
                          <span
                            className="pill"
                            style={{
                              background: client.rgpdConsent ? "var(--primary-soft)" : "var(--error-soft)",
                              color: client.rgpdConsent ? "var(--primary)" : "var(--error)",
                              fontWeight: "bold"
                            }}
                          >
                            {client.rgpdConsent ? "Aceptado y firmado" : "Pendiente de firma"}
                          </span>
                        </td>
                        <td>{client.notes || "Ninguna nota registrada."}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
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

// Experience Configurator Subcomponent
function ExperienceConfigurator({
  activeEvent,
  vendors,
  vendorPrices
}: {
  activeEvent: any;
  vendors: any[];
  vendorPrices: any[];
}) {
  const venues = vendors.filter((v) => v.category === "localizacion");
  const caterers = vendors.filter((v) => v.category === "restauracion");
  const decors = vendors.filter((v) => v.category === "decoracion");

  return (
    <div className="experience-layout">
      <section className="experience-main">
        <div className="stepper" aria-label="Configurador de experiencia">
          <span className="step active">1</span>
          <span className="step-line active" />
          <span className="step">2</span>
          <span className="step-line" />
          <span className="step">3</span>
        </div>
        <div className="editorial-header">
          <p className="eyebrow">Configurador de Estilo</p>
          <h3>Diseñar experiencia para {activeEvent.name}</h3>
          <p>Combina localizaciones, restauración y floristas recomendados para construir una propuesta estética coherente.</p>
        </div>

        <div className="experience-grid">
          {venues.slice(0, 2).map((vendor, index) => (
            <ExperienceCard key={vendor.id} vendor={vendor} prices={vendorPrices} tone={index === 0 ? "navy" : "apricot"} icon={<MapPin size={18} />} />
          ))}
          {caterers.slice(0, 1).map((vendor) => (
            <ExperienceCard key={vendor.id} vendor={vendor} prices={vendorPrices} tone="white" icon={<Utensils size={18} />} />
          ))}
          {decors.slice(0, 1).map((vendor) => (
            <ExperienceCard key={vendor.id} vendor={vendor} prices={vendorPrices} tone="slate" icon={<Palette size={18} />} />
          ))}
        </div>
      </section>

      <aside className="experience-summary">
        <p className="eyebrow">Propuesta de Concepto</p>
        <h3>{activeEvent.location}</h3>
        <div className="summary-stat"><span>Invitados</span><strong>{activeEvent.guests}</strong></div>
        <div className="summary-stat"><span>Presupuesto</span><strong>{new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(activeEvent.totalBudget)}</strong></div>
        <div className="summary-stat"><span>Estilo</span><strong>{activeEvent.style}</strong></div>
        <button className="primary-button" onClick={() => window.print()}>
          Imprimir Dossier Estilo
        </button>
      </aside>
    </div>
  );
}

function ExperienceCard({
  vendor,
  prices,
  tone,
  icon
}: {
  vendor: any;
  prices: any[];
  tone: "navy" | "apricot" | "white" | "slate";
  icon: React.ReactNode;
}) {
  const price = prices.find((item) => item.vendorId === vendor.id);
  const currency = (val: number) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <article className="experience-card">
      <div className={`experience-visual ${tone}`}>
        <div>{icon}</div>
        <span>{vendor.region}</span>
      </div>
      <div className="experience-copy">
        <div>
          <p className="eyebrow">{vendor.category.toUpperCase()}</p>
          <h4 style={{ margin: "4px 0 2px 0" }}>{vendor.name}</h4>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--slate-grey)", height: "36px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {vendor.notes}
          </p>
        </div>
        <div className="experience-meta" style={{ display: "flex", gap: "8px", borderTop: "1px dashed var(--line)", paddingTop: "8px", marginTop: "8px", fontSize: "11px" }}>
          <span>Cap. {vendor.capacity}</span>
          <span>
            {price ? `${currency(price.minPrice)}-${currency(price.maxPrice)}` : "Consultar precio"}
          </span>
        </div>
      </div>
    </article>
  );
}
