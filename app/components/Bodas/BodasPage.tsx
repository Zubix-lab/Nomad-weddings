"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { Plus, Calendar, Kanban, Search, MapPin } from "lucide-react";
import type { Event, EventPhase } from "@/lib/types";
import { createWeddingProject } from "@/lib/wedding-project";

interface BodasPageProps {
  onSelectEvent: (id: string) => void;
  onOpenDetail?: (id: string) => void;
  activeEventId: string;
  createRequestId?: number;
}

const PHASES: Array<{ id: EventPhase; label: string; desc: string }> = [
  { id: "descubrimiento", label: "Descubrimiento", desc: "Primeras reuniones y concepto" },
  { id: "diseno", label: "Diseño", desc: "Estilo y boceto de presupuesto" },
  { id: "proveedores", label: "Proveedores", desc: "Shortlist y contrataciones" },
  { id: "produccion", label: "Producción", desc: "Coordinación y runbook" },
  { id: "semana-boda", label: "Semana Boda", desc: "Montaje final y día B" }
];

function parsePositiveNumber(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export default function BodasPage({ onSelectEvent, onOpenDetail, activeEventId, createRequestId = 0 }: BodasPageProps) {
  const {
    events,
    updateEvent,
    addEvent,
    addClient,
    addParejaProfile,
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
  const [region, setRegion] = useState("Pais Vasco");
  const [guests, setGuests] = useState("100");
  const [budget, setBudget] = useState("30000");
  const [style, setStyle] = useState("");
  const [partnerOneName, setPartnerOneName] = useState("");
  const [partnerOnePhone, setPartnerOnePhone] = useState("");
  const [partnerOneEmail, setPartnerOneEmail] = useState("");
  const [partnerOnePreferences, setPartnerOnePreferences] = useState("");
  const [partnerTwoName, setPartnerTwoName] = useState("");
  const [partnerTwoPhone, setPartnerTwoPhone] = useState("");
  const [partnerTwoEmail, setPartnerTwoEmail] = useState("");
  const [partnerTwoPreferences, setPartnerTwoPreferences] = useState("");
  const [weddingPriorities, setWeddingPriorities] = useState("");
  const [dietaryNeeds, setDietaryNeeds] = useState("");
  const [riskNotes, setRiskNotes] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (createRequestId > 0) setIsFormOpen(true);
  }, [createRequestId]);

  const filteredEvents = events.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBoda = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedGuests = parsePositiveNumber(guests);
    const parsedBudget = parsePositiveNumber(budget);
    if (parsedGuests === null || parsedBudget === null) {
      setFormError("Invitados y presupuesto deben tener un numero mayor que 0.");
      return;
    }
    const project = createWeddingProject({
      addClient,
      addEvent,
      addParejaProfile,
      addEventService,
      addWorkspacePage,
      addWorkspaceBlock,
      addCalendarItem
    }, {
      coupleName,
      eventName,
      date,
      location: "",
      region,
      guests: Math.round(parsedGuests),
      budget: parsedBudget,
      style,
      preferences: weddingPriorities,
      dietaryNeeds,
      riskNotes,
      contactOne: {
        name: partnerOneName,
        role: "novia",
        phone: partnerOnePhone,
        email: partnerOneEmail,
        preferences: partnerOnePreferences
      },
      contactTwo: {
        name: partnerTwoName,
        role: "novio",
        phone: partnerTwoPhone,
        email: partnerTwoEmail,
        preferences: partnerTwoPreferences
      }
    });

    setCoupleName("");
    setEventName("");
    setDate("");
    setRegion("Pais Vasco");
    setGuests("100");
    setBudget("30000");
    setStyle("");
    setPartnerOneName("");
    setPartnerOnePhone("");
    setPartnerOneEmail("");
    setPartnerOnePreferences("");
    setPartnerTwoName("");
    setPartnerTwoPhone("");
    setPartnerTwoEmail("");
    setPartnerTwoPreferences("");
    setWeddingPriorities("");
    setDietaryNeeds("");
    setRiskNotes("");
    setFormError("");
    setIsFormOpen(false);
    onSelectEvent(project.eventId); // select newly created wedding
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
            placeholder="Buscar boda por nombre o zona..."
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
                        <MapPin size={10} /> {event.location || event.region || "Lugar por definir"}
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
                            if (onOpenDetail) {
                              onOpenDetail(event.id);
                            } else {
                              onSelectEvent(event.id);
                            }
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
                    <td>{event.location || "Lugar por definir"} ({event.region})</td>
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
          <div style={{ width: "100%", maxWidth: "680px", maxHeight: "90vh", overflowY: "auto", background: "var(--surface)", border: "1px solid var(--outline-variant)", borderRadius: "12px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", padding: "24px" }}>
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <fieldset style={{ display: "grid", gap: "8px", border: "1px solid var(--line)", borderRadius: "8px", padding: "10px" }}>
                  <legend className="eyebrow">Persona 1</legend>
                  <input value={partnerOneName} onChange={(e) => setPartnerOneName(e.target.value)} placeholder="Nombre" aria-label="Nombre persona 1" />
                  <input value={partnerOnePhone} onChange={(e) => setPartnerOnePhone(e.target.value)} placeholder="Telefono" aria-label="Telefono persona 1" />
                  <input type="email" value={partnerOneEmail} onChange={(e) => setPartnerOneEmail(e.target.value)} placeholder="Email" aria-label="Email persona 1" />
                  <textarea
                    value={partnerOnePreferences}
                    onChange={(e) => setPartnerOnePreferences(e.target.value)}
                    placeholder="Gustos, prioridades, estilo personal..."
                    aria-label="Preferencias persona 1"
                    style={{ minHeight: "62px", width: "100%", padding: "8px", border: "1px solid var(--line)", borderRadius: "8px", fontFamily: "inherit", resize: "vertical" }}
                  />
                </fieldset>

                <fieldset style={{ display: "grid", gap: "8px", border: "1px solid var(--line)", borderRadius: "8px", padding: "10px" }}>
                  <legend className="eyebrow">Persona 2</legend>
                  <input value={partnerTwoName} onChange={(e) => setPartnerTwoName(e.target.value)} placeholder="Nombre" aria-label="Nombre persona 2" />
                  <input value={partnerTwoPhone} onChange={(e) => setPartnerTwoPhone(e.target.value)} placeholder="Telefono" aria-label="Telefono persona 2" />
                  <input type="email" value={partnerTwoEmail} onChange={(e) => setPartnerTwoEmail(e.target.value)} placeholder="Email" aria-label="Email persona 2" />
                  <textarea
                    value={partnerTwoPreferences}
                    onChange={(e) => setPartnerTwoPreferences(e.target.value)}
                    placeholder="Gustos, prioridades, estilo personal..."
                    aria-label="Preferencias persona 2"
                    style={{ minHeight: "62px", width: "100%", padding: "8px", border: "1px solid var(--line)", borderRadius: "8px", fontFamily: "inherit", resize: "vertical" }}
                  />
                </fieldset>
              </div>

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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
                  Nº Estimado de Invitados
                  <input
                    inputMode="numeric"
                    value={guests}
                    onChange={(e) => {
                      setGuests(e.target.value);
                      setFormError("");
                    }}
                  />
                </label>
                <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
                  Presupuesto Estimado (€)
                  <input
                    inputMode="decimal"
                    value={budget}
                    onChange={(e) => {
                      setBudget(e.target.value);
                      setFormError("");
                    }}
                  />
                </label>
              </div>
              {formError && <p className="field-error">{formError}</p>}

              <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
                Gustos, estilo y concepto inicial
                <input
                  placeholder="Ej. rustico elegante, cena larga, musica en directo, exterior"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                />
              </label>

              <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
                Preferencias clave de la pareja
                <input
                  placeholder="Ej. comodidad, poca formalidad, experiencia gastronomica"
                  value={weddingPriorities}
                  onChange={(e) => setWeddingPriorities(e.target.value)}
                />
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
                  Dietas / alergias
                  <input
                    placeholder="Ej. vegetarianos, celiacos, frutos secos"
                    value={dietaryNeeds}
                    onChange={(e) => setDietaryNeeds(e.target.value)}
                  />
                </label>
                <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
                  Riesgos o notas iniciales
                  <input
                    placeholder="Ej. lluvia, transporte, familia sensible"
                    value={riskNotes}
                    onChange={(e) => setRiskNotes(e.target.value)}
                  />
                </label>
              </div>

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
