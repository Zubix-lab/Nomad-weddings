"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Plus, Calendar, Kanban, Search, MapPin } from "lucide-react";
import type { Event, EventPhase } from "@/lib/types";

interface BodasPageProps {
  onSelectEvent: (id: string) => void;
  activeEventId: string;
}

const PHASES: Array<{ id: EventPhase; label: string; desc: string }> = [
  { id: "descubrimiento", label: "Descubrimiento", desc: "Primeras reuniones y concepto" },
  { id: "diseno", label: "Diseño", desc: "Estilo y boceto de presupuesto" },
  { id: "proveedores", label: "Proveedores", desc: "Shortlist y contrataciones" },
  { id: "produccion", label: "Producción", desc: "Coordinación y runbook" },
  { id: "semana-boda", label: "Semana Boda", desc: "Montaje final y día B" }
];

const DEMO_TODAY = new Date("2026-07-03T00:00:00");

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function operationalDate(weddingDate: string, daysBeforeWedding: number, fallbackDaysFromToday: number): string {
  const base = weddingDate ? new Date(`${weddingDate}T00:00:00`) : new Date(DEMO_TODAY);
  base.setDate(base.getDate() + (weddingDate ? -daysBeforeWedding : fallbackDaysFromToday));
  return formatDate(base);
}

function calendarRange(date: string, hour: string): { startsAt: string; endsAt: string } {
  return {
    startsAt: `${date}T${hour}:00`,
    endsAt: `${date}T${hour}:45`,
  };
}

export default function BodasPage({ onSelectEvent, activeEventId }: BodasPageProps) {
  const {
    events,
    updateEvent,
    addEvent,
    addClient,
    addEventService,
    addWorkspacePage,
    addWorkspaceBlock,
    addCalendarItem
  } = useApp();
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [coupleName, setCoupleName] = useState("");
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("Pais Vasco");
  const [guests, setGuests] = useState(100);
  const [budget, setBudget] = useState(30000);
  const [style, setStyle] = useState("");

  const filteredEvents = events.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBoda = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new client first
    const clientId = "client-" + Date.now();
    addClient({
      id: clientId,
      coupleName,
      contacts: [
        { name: coupleName.split("&")[0]?.trim() || "Novio", role: "pareja", phone: "", email: "" }
      ],
      preferences: [],
      notes: "Creado desde alta de boda",
      rgpdConsent: true
    });

    // Create event
    const eventId = "event-" + Date.now();
    addEvent({
      id: eventId,
      clientId,
      name: eventName || `Boda de ${coupleName}`,
      date,
      location,
      region,
      guests: Number(guests),
      style,
      totalBudget: Number(budget),
      phase: "descubrimiento",
      risks: [],
      dietaryNeeds: [],
      accommodationNeeds: "",
      paymentStatus: "Pendiente primer pago"
    });

    const estimatedBudget = Number(budget);
    [
      { category: "espacio", ratio: 0.28 },
      { category: "catering", ratio: 0.34 },
      { category: "fotografia", ratio: 0.08 },
      { category: "musica", ratio: 0.07 },
      { category: "decoracion", ratio: 0.09 }
    ].forEach((service) => {
      addEventService({
        eventId,
        category: service.category,
        estimatedCost: Math.max(800, Math.round(estimatedBudget * service.ratio)),
        margin: 0,
        status: "pendiente"
      });
    });

    const kickoffPageId = addWorkspacePage({
      eventId,
      title: "Kickoff operativo",
      icon: "CalendarDays",
      description: "Briefing, alcance, decisiones iniciales y proximos pasos de la pareja.",
      order: 1
    });
    const vendorPageId = addWorkspacePage({
      eventId,
      title: "Proveedores clave",
      icon: "Users",
      description: "Shortlist, reservas, contratos y responsables por categoria.",
      order: 2
    });
    const financePageId = addWorkspacePage({
      eventId,
      title: "Finanzas y pagos",
      icon: "WalletCards",
      description: "Pagos programados, avisos financieros y compromisos por proveedor.",
      order: 3
    });
    const productionPageId = addWorkspacePage({
      eventId,
      title: "Produccion final",
      icon: "ClipboardList",
      description: "Invitados, seating, runbook, plan B y semana de la boda.",
      order: 4
    });

    addWorkspaceBlock({
      pageId: kickoffPageId,
      eventId,
      type: "milestone",
      title: "Briefing de pareja validado",
      body: `Confirmar estilo, presupuesto, prioridades y limites operativos para ${eventName || coupleName}.`,
      owner: "Nomad",
      dueDate: operationalDate(date, 240, 7),
      reminderDate: operationalDate(date, 247, 3),
      priority: "alta",
      status: "pendiente",
      createdAt: new Date().toISOString()
    });
    addWorkspaceBlock({
      pageId: vendorPageId,
      eventId,
      type: "vendor",
      title: "Shortlist de espacio y catering",
      body: "Preparar 3 opciones por categoria, validar disponibilidad y condiciones de reserva.",
      owner: "Nomad",
      dueDate: operationalDate(date, 210, 14),
      reminderDate: operationalDate(date, 217, 10),
      priority: "alta",
      status: "pendiente",
      createdAt: new Date().toISOString()
    });
    addWorkspaceBlock({
      pageId: vendorPageId,
      eventId,
      type: "vendor",
      title: "Fotografia, musica y decoracion",
      body: "Solicitar propuestas, revisar estilo y bloquear proveedores prioritarios.",
      owner: "Nomad",
      dueDate: operationalDate(date, 150, 21),
      reminderDate: operationalDate(date, 157, 17),
      priority: "media",
      status: "pendiente",
      createdAt: new Date().toISOString()
    });
    addWorkspaceBlock({
      pageId: financePageId,
      eventId,
      type: "payment",
      title: "Reserva inicial Nomad",
      body: "Primer pago para activar planificacion, proveedores y agenda operativa.",
      owner: "Pareja",
      dueDate: operationalDate(date, 230, 10),
      reminderDate: operationalDate(date, 237, 6),
      priority: "alta",
      status: "programado",
      amount: Math.max(1200, Math.round(estimatedBudget * 0.12)),
      createdAt: new Date().toISOString()
    });
    addWorkspaceBlock({
      pageId: financePageId,
      eventId,
      type: "payment",
      title: "Segundo pago de proveedores",
      body: "Bloquear pagos de espacio, catering y proveedores confirmados.",
      owner: "Nomad",
      dueDate: operationalDate(date, 45, 30),
      reminderDate: operationalDate(date, 52, 23),
      priority: "alta",
      status: "programado",
      amount: Math.max(3000, Math.round(estimatedBudget * 0.35)),
      createdAt: new Date().toISOString()
    });
    addWorkspaceBlock({
      pageId: productionPageId,
      eventId,
      type: "task",
      title: "Primer seating y necesidades especiales",
      body: "Recoger alergias, movilidad, transporte y prioridades familiares antes de cerrar plano.",
      owner: "Pareja",
      dueDate: operationalDate(date, 60, 35),
      reminderDate: operationalDate(date, 67, 28),
      priority: "media",
      status: "pendiente",
      createdAt: new Date().toISOString()
    });
    addWorkspaceBlock({
      pageId: productionPageId,
      eventId,
      type: "milestone",
      title: "Runbook de dia B aprobado",
      body: "Cerrar cronograma, responsables, telefonos, plan B y checklist de montaje.",
      owner: "Nomad",
      dueDate: operationalDate(date, 14, 45),
      reminderDate: operationalDate(date, 21, 38),
      priority: "alta",
      status: "pendiente",
      createdAt: new Date().toISOString()
    });

    const kickoffDate = operationalDate(date, 238, 5);
    const visitDate = operationalDate(date, 120, 20);
    const finalMeetingDate = operationalDate(date, 21, 40);
    addCalendarItem({
      eventId,
      title: "Kickoff con pareja",
      kind: "reunion",
      ...calendarRange(kickoffDate, "10:00"),
      owner: "Nomad"
    });
    addCalendarItem({
      eventId,
      title: "Visita tecnica espacio",
      kind: "visita-tecnica",
      ...calendarRange(visitDate, "11:00"),
      owner: "Nomad"
    });
    addCalendarItem({
      eventId,
      title: "Reunion final de produccion",
      kind: "deadline",
      ...calendarRange(finalMeetingDate, "17:00"),
      owner: "Nomad"
    });

    setIsFormOpen(false);
    onSelectEvent(eventId); // select newly created wedding
  };

  const handleMovePhase = (event: Event, direction: "next" | "prev") => {
    const currentIndex = PHASES.findIndex((p) => p.id === event.phase);
    let nextIndex = currentIndex;
    if (direction === "next" && currentIndex < PHASES.length - 1) {
      nextIndex += 1;
    } else if (direction === "prev" && currentIndex > 0) {
      nextIndex -= 1;
    }
    
    if (nextIndex !== currentIndex) {
      updateEvent({
        ...event,
        phase: PHASES[nextIndex].id
      });
    }
  };

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      {/* Top controls bar */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "10px", background: "var(--pure-white)", padding: "16px", borderRadius: "8px", border: "1px solid var(--line)" }}>
        <div style={{ display: "flex", flex: 1, minWidth: "260px", gap: "8px", position: "relative" }}>
          <input
            type="text"
            placeholder="Buscar boda por nombre o lugar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "36px" }}
            aria-label="Buscar boda"
          />
          <Search size={18} style={{ position: "absolute", left: "12px", top: "11px", color: "var(--slate-grey)" }} />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: "8px", overflow: "hidden" }}>
            <button
              onClick={() => setViewMode("kanban")}
              style={{
                border: 0,
                background: viewMode === "kanban" ? "var(--primary)" : "transparent",
                color: viewMode === "kanban" ? "white" : "var(--ink)",
                padding: "8px 12px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer"
              }}
            >
              <Kanban size={16} /> Kanban
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                border: 0,
                background: viewMode === "list" ? "var(--primary)" : "transparent",
                color: viewMode === "list" ? "white" : "var(--ink)",
                padding: "8px 12px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer"
              }}
            >
              <Calendar size={16} /> Lista
            </button>
          </div>

          <button
            className="primary-button"
            onClick={() => setIsFormOpen(true)}
            style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}
          >
            <Plus size={16} /> Crear Nueva Boda
          </button>
        </div>
      </div>

      {/* Main content according to view mode */}
      {viewMode === "kanban" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", overflowX: "auto", minHeight: "500px", paddingBottom: "10px" }}>
          {PHASES.map((phase) => {
            const phaseEvents = filteredEvents.filter((e) => e.phase === phase.id);
            return (
              <div
                key={phase.id}
                style={{
                  background: "var(--surface-low)",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid var(--line)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  minWidth: "220px"
                }}
              >
                <div style={{ paddingBottom: "6px", borderBottom: "1px solid var(--outline-variant)" }}>
                  <h3 style={{ margin: 0, fontSize: "15px", color: "var(--primary)", fontFamily: '"Source Serif 4", Georgia, serif' }}>
                    {phase.label}
                  </h3>
                  <span style={{ fontSize: "11px", color: "var(--slate-grey)" }}>
                    {phaseEvents.length} {phaseEvents.length === 1 ? "boda" : "bodas"}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, overflowY: "auto" }}>
                  {phaseEvents.map((event) => (
                    <div
                      key={event.id}
                      style={{
                        background: "var(--pure-white)",
                        padding: "12px",
                        borderRadius: "8px",
                        border: event.id === activeEventId ? "2px solid var(--primary)" : "1px solid var(--line)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        cursor: "pointer",
                        display: "grid",
                        gap: "6px"
                      }}
                      onClick={() => onSelectEvent(event.id)}
                    >
                      <strong style={{ fontSize: "14px", color: "var(--primary)" }}>{event.name}</strong>
                      <p style={{ margin: 0, fontSize: "11px", color: "var(--slate-grey)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <MapPin size={10} /> {event.location}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--slate-grey)", marginTop: "4px" }}>
                        <span>{new Date(event.date).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}</span>
                        <span style={{ marginLeft: "auto" }}>{event.guests} inv.</span>
                      </div>
                      
                      <div style={{ display: "flex", gap: "4px", marginTop: "8px", borderTop: "1px dashed var(--line)", paddingTop: "8px" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMovePhase(event, "prev");
                          }}
                          disabled={event.phase === "descubrimiento"}
                          style={{
                            border: 0,
                            background: "var(--surface-low)",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            cursor: "pointer"
                          }}
                        >
                          &lt;
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectEvent(event.id);
                          }}
                          style={{
                            border: 0,
                            background: "var(--primary-soft)",
                            color: "var(--primary)",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            cursor: "pointer",
                            flex: 1
                          }}
                        >
                          Ver Ficha
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMovePhase(event, "next");
                          }}
                          disabled={event.phase === "semana-boda"}
                          style={{
                            border: 0,
                            background: "var(--surface-low)",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            cursor: "pointer"
                          }}
                        >
                          &gt;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="panel full" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre Boda</th>
                  <th>Fecha</th>
                  <th>Ubicación</th>
                  <th>Invitados</th>
                  <th>Presupuesto</th>
                  <th>Fase actual</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    onClick={() => onSelectEvent(event.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td style={{ fontWeight: "bold" }}>{event.name}</td>
                    <td>{new Date(event.date).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}</td>
                    <td>{event.location} ({event.region})</td>
                    <td>{event.guests}</td>
                    <td style={{ fontWeight: "bold" }}>
                      {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(event.totalBudget)}
                    </td>
                    <td>
                      <span className="pill">
                        {PHASES.find((p) => p.id === event.phase)?.label || event.phase}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Creation Modal Form */}
      {isFormOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1100, display: "grid", placeItems: "center", padding: "16px", background: "rgba(38, 63, 56, 0.4)", backdropFilter: "blur(4px)" }}>
          <div style={{ width: "100%", maxWidth: "550px", background: "var(--surface)", border: "1px solid var(--outline-variant)", borderRadius: "12px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", padding: "24px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "20px", fontFamily: '"Source Serif 4", Georgia, serif', color: "var(--primary)" }}>
              Nueva Boda y Cuenta de Clientes
            </h3>
            
            <form onSubmit={handleCreateBoda} style={{ display: "grid", gap: "12px" }}>
              <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
                Pareja (Nombres) *
                <input
                  required
                  placeholder="Ej. Ana & Borja"
                  value={coupleName}
                  onChange={(e) => setCoupleName(e.target.value)}
                />
              </label>

              <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
                Identificador de la boda (Nombre clave)
                <input
                  placeholder="Ej. Boda A&B"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
                  Fecha de la Boda *
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </label>
                <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
                  Zona de Operación
                  <select value={region} onChange={(e) => setRegion(e.target.value)}>
                    <option value="Pais Vasco">País Vasco / Gipuzkoa</option>
                    <option value="Canarias">Canarias / Gran Canaria</option>
                  </select>
                </label>
              </div>

              <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
                Lugar de Celebración (Finca / Espacio)
                <input
                  placeholder="Ej. Bodega Lur, Rioja"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
                  Nº Estimado de Invitados
                  <input
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    min={10}
                  />
                </label>
                <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
                  Presupuesto Estimado (€)
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    min={1000}
                  />
                </label>
              </div>

              <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
                Estilo y Concepto General
                <input
                  placeholder="Ej. Rústico elegante, mesas infinitas, fiesta exterior"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                />
              </label>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancelar
                </button>
                <button className="primary-button" type="submit">
                  Crear Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
