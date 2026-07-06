"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  CalendarDays,
  WalletCards,
  FileText,
  AlertTriangle,
  ClipboardList,
  Plus,
  MapPin
} from "lucide-react";
import { categoriaLabel, categorias, categoriasCompatibles, normalizeCategoriaId } from "@/lib/categorias";
import { ParejaProfilePanel } from "./ParejaProfile";
import { ReunionesPanel } from "./ReunionesPanel";
import { ChecklistPanel } from "./ChecklistPanel";
import type { CalendarKind, EventPhase, EventService, ServiceStatus, Vendor } from "@/lib/types";

interface BodaDetailProps {
  eventId: string;
}

type TabType = "resumen" | "pareja" | "servicios" | "reuniones" | "checklist" | "horario";

export default function BodaDetail({ eventId }: BodaDetailProps) {
  const {
    events,
    clients,
    vendors,
    calendarItems,
    eventServices,
    workspaceBlocks,
    checklistItems,
    documents,
    parejaProfiles,
    reuniones,
    updateEvent,
    updateClient,
    addParejaProfile,
    addReunion,
    deleteReunion,
    addChecklistItem,
    deleteChecklistItem,
    addCalendarItem,
    addEventService,
    updateEventService,
    deleteEventService
  } = useApp();

  const [activeTab, setActiveTab] = useState<TabType>("resumen");
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [serviceCategory, setServiceCategory] = useState("localizacion");
  const [serviceVendorId, setServiceVendorId] = useState("");
  const [serviceCost, setServiceCost] = useState("1000");
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>("pendiente");
  const [eventNameDraft, setEventNameDraft] = useState("");
  const [eventDateDraft, setEventDateDraft] = useState("");
  const [eventLocationDraft, setEventLocationDraft] = useState("");
  const [eventRegionDraft, setEventRegionDraft] = useState("");
  const [eventGuestsDraft, setEventGuestsDraft] = useState("");
  const [eventBudgetDraft, setEventBudgetDraft] = useState("");
  const [eventStyleDraft, setEventStyleDraft] = useState("");
  const [eventPhaseDraft, setEventPhaseDraft] = useState<EventPhase>("descubrimiento");
  const [eventRisksDraft, setEventRisksDraft] = useState("");
  const [eventDietsDraft, setEventDietsDraft] = useState("");
  const [eventAccommodationDraft, setEventAccommodationDraft] = useState("");
  const [clientPrefsDraft, setClientPrefsDraft] = useState("");
  const [clientNotesDraft, setClientNotesDraft] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [serviceFormError, setServiceFormError] = useState("");
  const [serviceCostDrafts, setServiceCostDrafts] = useState<Record<string, string>>({});
  const [serviceCostErrors, setServiceCostErrors] = useState<Record<string, string>>({});
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleStart, setScheduleStart] = useState("");
  const [scheduleEnd, setScheduleEnd] = useState("");
  const [scheduleOwner, setScheduleOwner] = useState("Nomad");
  const [scheduleKind, setScheduleKind] = useState<CalendarKind>("reunion");
  const [scheduleError, setScheduleError] = useState("");

  // Get active wedding/event
  const event = events.find((e) => e.id === eventId) ?? events[0];
  const client = event ? clients.find((c) => c.id === event.clientId) : undefined;

  useEffect(() => {
    if (!event) return;
    setEventNameDraft(event.name);
    setEventDateDraft(event.date);
    setEventLocationDraft(event.location);
    setEventRegionDraft(event.region);
    setEventGuestsDraft(String(event.guests || ""));
    setEventBudgetDraft(String(event.totalBudget || ""));
    setEventStyleDraft(event.style);
    setEventPhaseDraft(event.phase);
    setEventRisksDraft(event.risks.join(", "));
    setEventDietsDraft(event.dietaryNeeds.join(", "));
    setEventAccommodationDraft(event.accommodationNeeds);
    setClientPrefsDraft(client?.preferences.join(", ") || "");
    setClientNotesDraft(client?.notes || "");
  }, [event, client]);

  if (!event) {
    return <div className="empty-state">Selecciona una boda para ver los detalles.</div>;
  }
  
  // Tasks calculations
  const eventTasks = checklistItems.filter((t) => t.eventId === event.id);
  const openTasks = eventTasks.filter((t) => !t.completada);
  const eventWorkspaceBlocks = workspaceBlocks.filter((block) => block.eventId === event.id);
  const openWorkspaceBlocks = eventWorkspaceBlocks.filter((block) => ["task", "milestone", "vendor"].includes(block.type) && !["hecha", "contratado"].includes(String(block.status)));
  const activeWorkspacePayments = eventWorkspaceBlocks.filter((block) => block.type === "payment" && block.status !== "pagado");
  
  // Services calculations
  const eventServicesList = eventServices.filter((s) => s.eventId === event.id);
  const missingServices = eventServicesList.filter((s) => !s.vendorId);
  const totalSpend = eventServicesList.reduce((sum, s) => sum + Number(s.estimatedCost), 0);
  const eventSchedule = calendarItems
    .filter((item) => item.eventId === event.id)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  // Documents
  const eventDocs = documents.filter((d) => d.eventId === event.id);


  const parsePositiveNumber = (value: string): number | null => {
    const normalized = value.trim().replace(",", ".");
    if (!normalized) return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCost = parsePositiveNumber(serviceCost);
    if (parsedCost === null) {
      setServiceFormError("Introduce un coste estimado mayor que 0 antes de guardar.");
      return;
    }
    addEventService({
      eventId: event.id,
      category: serviceCategory,
      vendorId: serviceVendorId || undefined,
      estimatedCost: parsedCost,
      margin: 0,
      status: serviceStatus
    });
    setServiceFormError("");
    setIsServiceFormOpen(false);
  };

  const splitList = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);

  const handleSaveSummary = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedGuests = parsePositiveNumber(eventGuestsDraft);
    const parsedBudget = parsePositiveNumber(eventBudgetDraft);
    if (parsedGuests === null || parsedBudget === null) {
      setSummaryError("Invitados y presupuesto deben tener un numero mayor que 0.");
      return;
    }
    updateEvent({
      ...event,
      name: eventNameDraft.trim() || event.name,
      date: eventDateDraft,
      location: eventLocationDraft,
      region: eventRegionDraft,
      guests: Math.round(parsedGuests),
      totalBudget: parsedBudget,
      style: eventStyleDraft,
      phase: eventPhaseDraft,
      risks: splitList(eventRisksDraft),
      dietaryNeeds: splitList(eventDietsDraft),
      accommodationNeeds: eventAccommodationDraft,
    });

    if (client) {
      updateClient({
        ...client,
        preferences: splitList(clientPrefsDraft),
        notes: clientNotesDraft,
      });
    }
    setSummaryError("");
  };

  const handleUpdateServiceVendor = (service: EventService, vendorId: string) => {
    updateEventService({
      ...service,
      vendorId: vendorId || undefined
    });
  };

  const handleUpdateServiceStatus = (service: EventService, status: ServiceStatus) => {
    updateEventService({
      ...service,
      status
    });
  };

  const handleUpdateServiceCost = (service: EventService, value: string, input?: HTMLInputElement) => {
    const parsedCost = parsePositiveNumber(value);
    if (parsedCost === null) {
      setServiceCostErrors((current) => ({ ...current, [service.id]: "Introduce un coste mayor que 0." }));
      window.setTimeout(() => input?.focus(), 0);
      return;
    }
    updateEventService({
      ...service,
      estimatedCost: parsedCost
    });
    setServiceCostDrafts((current) => ({ ...current, [service.id]: String(parsedCost) }));
    setServiceCostErrors((current) => {
      const next = { ...current };
      delete next[service.id];
      return next;
    });
  };

  const serviceCategoryLabel = (category: string) => categoriaLabel(category);

  const getCompatibleVendors = (category: string): Vendor[] => {
    const compatibleCategories = categoriasCompatibles(category).map(normalizeCategoriaId);
    const matches = vendors.filter((vendor) => compatibleCategories.includes(normalizeCategoriaId(vendor.category)));
    return matches.length > 0 ? matches : vendors;
  };

  const handleAddScheduleItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleTitle.trim() || !scheduleDate || !scheduleStart) {
      setScheduleError("Titulo, fecha y hora de inicio son obligatorios.");
      return;
    }
    const end = scheduleEnd || scheduleStart;
    addCalendarItem({
      eventId: event.id,
      title: scheduleTitle.trim(),
      kind: scheduleKind,
      startsAt: `${scheduleDate}T${scheduleStart}:00`,
      endsAt: `${scheduleDate}T${end}:00`,
      owner: scheduleOwner.trim() || "Nomad"
    });
    setScheduleTitle("");
    setScheduleDate("");
    setScheduleStart("");
    setScheduleEnd("");
    setScheduleOwner("Nomad");
    setScheduleKind("reunion");
    setScheduleError("");
  };

  const currency = (val: number) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      {/* Wedding Header Panel */}
      <div className="panel full" style={{ padding: "20px" }}>
        <div className="boda-detail-header">
          <div>
            <span className="pill">{event.phase.toUpperCase()}</span>
            <h3 style={{ margin: "6px 0 2px 0", fontSize: "28px", fontFamily: '"Source Serif 4", Georgia, serif', color: "var(--primary)" }}>
              {event.name} — {client?.coupleName || "Pareja"}
            </h3>
            <p style={{ margin: 0, color: "var(--slate-grey)", fontSize: "14px", display: "flex", alignItems: "center", gap: "4px" }}>
              <MapPin size={14} /> {event.location ? `${event.location} (${event.region})` : `Zona aproximada: ${event.region || "por definir"}`}
            </p>
          </div>
          
          <dl className="boda-detail-kpis">
            <div>
              <dt style={{ color: "var(--slate-grey)", fontSize: "11px", textTransform: "uppercase" }}>Fecha Boda</dt>
              <dd style={{ margin: "2px 0 0 0", fontSize: "16px", fontWeight: "bold", color: "var(--primary)" }}>
                {new Date(event.date).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
              </dd>
            </div>
            <div>
              <dt style={{ color: "var(--slate-grey)", fontSize: "11px", textTransform: "uppercase" }}>Invitados</dt>
              <dd style={{ margin: "2px 0 0 0", fontSize: "16px", fontWeight: "bold", color: "var(--primary)" }}>
                {event.guests}
              </dd>
            </div>
            <div>
              <dt style={{ color: "var(--slate-grey)", fontSize: "11px", textTransform: "uppercase" }}>Presupuesto</dt>
              <dd style={{ margin: "2px 0 0 0", fontSize: "16px", fontWeight: "bold", color: "var(--primary)" }}>
                {currency(event.totalBudget)}
              </dd>
            </div>
            <div>
              <dt style={{ color: "var(--slate-grey)", fontSize: "11px", textTransform: "uppercase" }}>Gasto Estimado</dt>
              <dd style={{ margin: "2px 0 0 0", fontSize: "16px", fontWeight: "bold", color: "var(--primary)" }}>
                {currency(totalSpend)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Tabs navigation */}
        <div className="boda-detail-tabs">
          {(["resumen", "pareja", "servicios", "reuniones", "checklist", "horario"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                border: 0,
                background: "transparent",
                padding: "8px 4px 12px 4px",
                fontSize: "14px",
                fontWeight: "bold",
                color: activeTab === tab ? "var(--primary)" : "var(--slate-grey)",
                borderBottom: activeTab === tab ? "3px solid var(--primary)" : "3px solid transparent",
                cursor: "pointer",
                textTransform: "capitalize"
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === "resumen" && (
        <div className="screen-grid">
          <section className="panel full" style={{ gridColumn: "span 4" }}>
            <div className="panel-header">
              <div>
                <p className="eyebrow">Ficha editable</p>
                <h3>Datos de boda y cuenta cliente</h3>
              </div>
              <div className="panel-action"><FileText size={18} /></div>
            </div>
            <form className="boda-summary-form" onSubmit={handleSaveSummary}>
              <input value={eventNameDraft} onChange={(e) => setEventNameDraft(e.target.value)} placeholder="Nombre de la boda" aria-label="Nombre de la boda" />
              <input type="date" value={eventDateDraft} onChange={(e) => setEventDateDraft(e.target.value)} aria-label="Fecha de la boda" />
              <input value={eventLocationDraft} onChange={(e) => setEventLocationDraft(e.target.value)} placeholder="Lugar definitivo (opcional, cuando este decidido)" aria-label="Lugar definitivo opcional" />
              <select value={eventPhaseDraft} onChange={(e) => setEventPhaseDraft(e.target.value as EventPhase)} aria-label="Fase">
                <option value="descubrimiento">Descubrimiento</option>
                <option value="diseno">Diseno</option>
                <option value="proveedores">Proveedores</option>
                <option value="produccion">Produccion</option>
                <option value="semana-boda">Semana boda</option>
              </select>
              <input value={eventRegionDraft} onChange={(e) => setEventRegionDraft(e.target.value)} placeholder="Region" aria-label="Region" />
              <input
                inputMode="numeric"
                value={eventGuestsDraft}
                onChange={(e) => {
                  setEventGuestsDraft(e.target.value);
                  setSummaryError("");
                }}
                placeholder="Invitados"
                aria-label="Invitados"
              />
              <input
                inputMode="decimal"
                value={eventBudgetDraft}
                onChange={(e) => {
                  setEventBudgetDraft(e.target.value);
                  setSummaryError("");
                }}
                placeholder="Presupuesto"
                aria-label="Presupuesto"
              />
              <input value={eventStyleDraft} onChange={(e) => setEventStyleDraft(e.target.value)} placeholder="Estilo y concepto" aria-label="Estilo y concepto" />
              <input value={clientPrefsDraft} onChange={(e) => setClientPrefsDraft(e.target.value)} placeholder="Preferencias de pareja" aria-label="Preferencias de pareja" />
              <input value={eventDietsDraft} onChange={(e) => setEventDietsDraft(e.target.value)} placeholder="Dietas y alergias" aria-label="Dietas y alergias" />
              <input value={eventRisksDraft} onChange={(e) => setEventRisksDraft(e.target.value)} placeholder="Riesgos y plan B" aria-label="Riesgos y plan B" />
              <input value={eventAccommodationDraft} onChange={(e) => setEventAccommodationDraft(e.target.value)} placeholder="Alojamiento" aria-label="Alojamiento" />
              <textarea value={clientNotesDraft} onChange={(e) => setClientNotesDraft(e.target.value)} placeholder="Notas internas de la cuenta cliente" aria-label="Notas internas de la cuenta cliente" />
              <button className="primary-button" type="submit">Guardar ficha</button>
              {summaryError && <p className="field-error">{summaryError}</p>}
            </form>
          </section>

          {/* Card stats */}
          <div style={{ gridColumn: "span 2", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            <div className="metric" style={{ background: "var(--pure-white)", border: "1px solid var(--line)" }}>
              <div className="metric-icon"><ClipboardList size={18} /></div>
              <p>Pendientes Notion</p>
              <strong>{openWorkspaceBlocks.length}</strong>
              <span>{openTasks.length} checklist interno</span>
            </div>
            <div className="metric" style={{ background: "var(--pure-white)", border: "1px solid var(--line)" }}>
              <div className="metric-icon"><WalletCards size={18} /></div>
              <p>Pagos y servicios</p>
              <strong style={{ color: missingServices.length > 0 || activeWorkspacePayments.length > 0 ? "var(--secondary)" : "var(--primary)" }}>
                {activeWorkspacePayments.length}
              </strong>
              <span>{missingServices.length} servicios sin proveedor</span>
            </div>
          </div>

          <section className="panel wide" style={{ gridColumn: "span 2" }}>
            <div className="panel-header">
              <h3>Riesgos y Plan B</h3>
              <div className="panel-action"><AlertTriangle size={18} /></div>
            </div>
            <div style={{ display: "grid", gap: "8px" }}>
              {event.risks.length === 0 ? (
                <p style={{ margin: 0, fontSize: "13px", color: "var(--slate-grey)", fontStyle: "italic" }}>
                  No hay riesgos operativos señalados para esta boda.
                </p>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {event.risks.map((risk) => (
                    <span
                      key={risk}
                      style={{
                        padding: "8px 12px",
                        background: "var(--error-soft)",
                        color: "var(--error)",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "bold"
                      }}
                    >
                      {risk}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ marginTop: "16px", padding: "12px", background: "var(--surface-low)", borderRadius: "8px" }}>
                <strong>Alojamiento Invitados:</strong>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--slate-grey)" }}>
                  {event.accommodationNeeds || "No se ha definido información hotelera."}
                </p>
              </div>
            </div>
          </section>

          {/* Documents panel */}
          <section className="panel" style={{ gridColumn: "span 1" }}>
            <div className="panel-header">
              <h3>Documentos Firmados</h3>
              <div className="panel-action"><FileText size={18} /></div>
            </div>
            <div style={{ display: "grid", gap: "8px" }}>
              {eventDocs.length === 0 ? (
                <div className="empty-state" style={{ minHeight: "100px", fontSize: "12px" }}>
                  Sin documentos subidos.
                </div>
              ) : (
                eventDocs.map((doc) => (
                  <div key={doc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "var(--surface-low)", borderRadius: "6px", fontSize: "12px" }}>
                    <div>
                      <strong>{doc.title}</strong>
                      <p style={{ margin: 0, fontSize: "10px", color: "var(--slate-grey)" }}>
                        {doc.type.toUpperCase()} · Actualizado {new Date(doc.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="pill" style={{ marginLeft: "auto", fontSize: "10px" }}>{doc.status}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}

      {activeTab === "pareja" && (
        <ParejaProfilePanel
          eventId={event.id}
          profiles={parejaProfiles}
          onSave={addParejaProfile}
        />
      )}

      {activeTab === "reuniones" && (
        <ReunionesPanel
          eventId={event.id}
          reuniones={reuniones}
          onSave={addReunion}
          onDelete={deleteReunion}
        />
      )}

      {activeTab === "checklist" && (
        <ChecklistPanel
          eventId={event.id}
          checklistItems={checklistItems}
          onSave={addChecklistItem}
          onDelete={deleteChecklistItem}
        />
      )}

      {activeTab === "servicios" && (
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0, fontSize: "16px", color: "var(--primary)", fontFamily: '"Source Serif 4", Georgia, serif' }}>
              Servicios Requeridos y Presupuesto
            </h4>
            <button
              className="primary-button"
              onClick={() => {
                setServiceCategory("localizacion");
                setServiceVendorId("");
                setServiceCost("1000");
                setServiceStatus("pendiente");
                setServiceFormError("");
                setIsServiceFormOpen(true);
              }}
              style={{ display: "inline-flex", gap: "6px", alignItems: "center", minHeight: "34px", padding: "4px 10px", fontSize: "12px", marginLeft: "auto" }}
            >
              <Plus size={14} /> Añadir Servicio
            </button>
          </div>

          <div className="panel full" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Categoría del servicio</th>
                    <th>Proveedor asignado</th>
                    <th>Costo estimado / real</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {eventServicesList.map((service) => {
                    const catVendors = getCompatibleVendors(service.category);

                    return (
                      <tr key={service.id}>
                        <td style={{ fontWeight: "bold" }}>
                          {serviceCategoryLabel(service.category)}
                        </td>
                        <td>
                          <select
                            value={service.vendorId || ""}
                            onChange={(e) => handleUpdateServiceVendor(service, e.target.value)}
                            style={{ minHeight: "34px", padding: "4px" }}
                            aria-label="Proveedor asignado"
                          >
                            <option value="">-- Pendiente de asignar --</option>
                            {catVendors.map((v) => (
                              <option key={v.id} value={v.id}>{v.name} ({serviceCategoryLabel(v.category)} · {v.region})</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            inputMode="decimal"
                            value={serviceCostDrafts[service.id] ?? String(service.estimatedCost || "")}
                            onChange={(e) => {
                              const value = e.target.value;
                              setServiceCostDrafts((current) => ({ ...current, [service.id]: value }));
                              setServiceCostErrors((current) => {
                                const next = { ...current };
                                delete next[service.id];
                                return next;
                              });
                            }}
                            onBlur={(e) => handleUpdateServiceCost(service, e.target.value, e.currentTarget)}
                            style={{ minHeight: "34px", width: "100px", padding: "4px" }}
                            aria-label="Costo estimado"
                          />
                          {serviceCostErrors[service.id] && <p className="field-error compact">{serviceCostErrors[service.id]}</p>}
                        </td>
                        <td>
                          <select
                            value={service.status}
                            onChange={(e) => handleUpdateServiceStatus(service, e.target.value as ServiceStatus)}
                            style={{ minHeight: "34px", padding: "4px" }}
                            aria-label="Estado del servicio"
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="propuesto">Propuesto</option>
                            <option value="reservado">Reservado</option>
                            <option value="contratado">Contratado</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className="mini-button"
                            style={{ color: "var(--error)", borderColor: "var(--error-soft)" }}
                            onClick={() => deleteEventService(service.id)}
                            title="Eliminar"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Service form Modal */}
          {isServiceFormOpen && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1100, display: "grid", placeItems: "center", padding: "16px", background: "rgba(38, 63, 56, 0.4)", backdropFilter: "blur(4px)" }}>
              <div style={{ width: "100%", maxWidth: "450px", background: "var(--surface)", border: "1px solid var(--outline-variant)", borderRadius: "12px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", padding: "24px" }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontFamily: '"Source Serif 4", Georgia, serif', color: "var(--primary)" }}>
                  Añadir Módulo / Servicio Requerido
                </h3>
                <form onSubmit={handleAddService} style={{ display: "grid", gap: "12px" }}>
                  <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
                    Categoría del Servicio
                    <select value={serviceCategory} onChange={(e) => setServiceCategory(e.target.value)}>
                      {categorias.map((category) => (
                        <option key={category.id} value={category.id}>{category.label}</option>
                      ))}
                    </select>
                  </label>

                  <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
                    Proveedor Recomendado (Opcional)
                    <select value={serviceVendorId} onChange={(e) => setServiceVendorId(e.target.value)}>
                      <option value="">-- Selecciona un proveedor --</option>
                      {getCompatibleVendors(serviceCategory).map((v) => (
                        <option key={v.id} value={v.id}>{v.name} ({serviceCategoryLabel(v.category)} · {v.region})</option>
                      ))}
                    </select>
                  </label>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
                      Costo Estimado (€)
                      <input
                        inputMode="decimal"
                        value={serviceCost}
                        onChange={(e) => {
                          setServiceCost(e.target.value);
                          setServiceFormError("");
                        }}
                        onBlur={(e) => {
                          if (parsePositiveNumber(e.target.value) === null) {
                            setServiceFormError("Introduce un coste estimado mayor que 0.");
                          }
                        }}
                      />
                      {serviceFormError && <p className="field-error compact">{serviceFormError}</p>}
                    </label>
                    <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
                      Estado
                      <select value={serviceStatus} onChange={(e) => setServiceStatus(e.target.value as ServiceStatus)}>
                        <option value="pendiente">Pendiente</option>
                        <option value="propuesto">Propuesto</option>
                        <option value="reservado">Reservado</option>
                        <option value="contratado">Contratado</option>
                      </select>
                    </label>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => setIsServiceFormOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button className="primary-button" type="submit">
                      Guardar Servicio
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
      {activeTab === "horario" && (
        <section className="panel full">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Cronograma desde cero</p>
              <h3>Runbook del día B</h3>
            </div>
            <div className="panel-action"><CalendarDays size={18} /></div>
          </div>
          <div style={{ display: "grid", gap: "16px" }}>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--slate-grey)" }}>
              Empieza vacío. Añade cada momento cuando exista una decisión real: preparativos, ceremonia, cóctel, banquete, baile, desmontaje o reuniones previas.
            </p>

            <form onSubmit={handleAddScheduleItem} className="boda-schedule-form">
              <input value={scheduleTitle} onChange={(e) => { setScheduleTitle(e.target.value); setScheduleError(""); }} placeholder="Momento o tarea" aria-label="Momento del cronograma" />
              <input type="date" value={scheduleDate} onChange={(e) => { setScheduleDate(e.target.value); setScheduleError(""); }} aria-label="Fecha" />
              <input type="time" value={scheduleStart} onChange={(e) => { setScheduleStart(e.target.value); setScheduleError(""); }} aria-label="Hora inicio" />
              <input type="time" value={scheduleEnd} onChange={(e) => setScheduleEnd(e.target.value)} aria-label="Hora fin" />
              <select value={scheduleKind} onChange={(e) => setScheduleKind(e.target.value as CalendarKind)} aria-label="Tipo de momento">
                <option value="reunion">Reunión</option>
                <option value="visita-tecnica">Visita técnica</option>
                <option value="pago">Pago</option>
                <option value="deadline">Deadline</option>
                <option value="dia-b">Día B</option>
              </select>
              <input value={scheduleOwner} onChange={(e) => setScheduleOwner(e.target.value)} placeholder="Responsable" aria-label="Responsable" />
              <button className="primary-button" type="submit">Añadir momento</button>
              {scheduleError && <p className="field-error">{scheduleError}</p>}
            </form>

            {eventSchedule.length === 0 ? (
              <div className="empty-state" style={{ minHeight: "180px" }}>
                Todavia no hay cronograma para esta boda. Crea el primer momento cuando tengais decisiones cerradas.
              </div>
            ) : (
              <div className="boda-schedule-list">
                {eventSchedule.map((item) => {
                  const start = new Date(item.startsAt);
                  const end = new Date(item.endsAt);
                  return (
                    <article key={item.id} className="boda-schedule-row">
                      <span className="time-badge">{start.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</span>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{start.toLocaleDateString("es-ES")} · {end.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })} · {item.owner}</p>
                      </div>
                      <small>{item.kind}</small>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
