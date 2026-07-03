"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ArrowRight, Search, Plus, User, Phone, Mail, CheckCircle, ShieldAlert, Heart, Calendar, FileText } from "lucide-react";
import { Modal } from "../UI/Modal";
import type { Client } from "@/lib/types";
import { type TabId } from "../Layout/Sidebar";
import { createWeddingProject } from "@/lib/wedding-project";

interface ClientesPageProps {
  onSelectEvent: (id: string) => void;
  setActiveTab: (tab: TabId) => void;
}

export default function ClientesPage({ onSelectEvent, setActiveTab }: ClientesPageProps) {
  const {
    clients,
    events,
    addClient,
    updateClient,
    deleteClient,
    addEvent,
    addParejaProfile,
    addEventService,
    addWorkspacePage,
    addWorkspaceBlock,
    addCalendarItem
  } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeClient, setActiveClient] = useState<Client | undefined>(undefined);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [weddingClient, setWeddingClient] = useState<Client | undefined>(undefined);
  const [isWeddingFormOpen, setIsWeddingFormOpen] = useState(false);

  // Form states
  const [coupleName, setCoupleName] = useState("");
  const [p1Name, setP1Name] = useState("");
  const [p1Role, setP1Role] = useState("novia");
  const [p1Phone, setP1Phone] = useState("");
  const [p1Email, setP1Email] = useState("");
  const [p2Name, setP2Name] = useState("");
  const [p2Role, setP2Role] = useState("novio");
  const [p2Phone, setP2Phone] = useState("");
  const [p2Email, setP2Email] = useState("");
  const [preferencesInput, setPreferencesInput] = useState("");
  const [notes, setNotes] = useState("");
  const [rgpdConsent, setRgpdConsent] = useState(true);

  // Wedding project states
  const [weddingEventName, setWeddingEventName] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [weddingLocation, setWeddingLocation] = useState("");
  const [weddingRegion, setWeddingRegion] = useState("Pais Vasco");
  const [weddingGuests, setWeddingGuests] = useState(100);
  const [weddingBudget, setWeddingBudget] = useState(30000);
  const [weddingStyle, setWeddingStyle] = useState("");
  const [weddingPriorities, setWeddingPriorities] = useState("");
  const [weddingDietaryNeeds, setWeddingDietaryNeeds] = useState("");
  const [weddingRiskNotes, setWeddingRiskNotes] = useState("");

  const filteredClients = clients.filter((c) =>
    c.coupleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setActiveClient(undefined);
    setCoupleName("");
    setP1Name("");
    setP1Role("novia");
    setP1Phone("");
    setP1Email("");
    setP2Name("");
    setP2Role("novio");
    setP2Phone("");
    setP2Email("");
    setPreferencesInput("");
    setNotes("");
    setRgpdConsent(true);
    setIsFormOpen(true);
  };

  const openEditModal = (client: Client) => {
    setActiveClient(client);
    setCoupleName(client.coupleName);
    const p1 = client.contacts[0] || { name: "", role: "novia", phone: "", email: "" };
    setP1Name(p1.name);
    setP1Role(p1.role);
    setP1Phone(p1.phone);
    setP1Email(p1.email);
    const p2 = client.contacts[1] || { name: "", role: "novio", phone: "", email: "" };
    setP2Name(p2.name);
    setP2Role(p2.role);
    setP2Phone(p2.phone);
    setP2Email(p2.email);
    setPreferencesInput(client.preferences.join(", "));
    setNotes(client.notes);
    setRgpdConsent(client.rgpdConsent);
    setIsFormOpen(true);
  };

  const openWeddingModal = (client: Client) => {
    setWeddingClient(client);
    setWeddingEventName(`Boda de ${client.coupleName}`);
    setWeddingDate("");
    setWeddingLocation("");
    setWeddingRegion("Pais Vasco");
    setWeddingGuests(100);
    setWeddingBudget(30000);
    setWeddingStyle(client.preferences.join(", "));
    setWeddingPriorities(client.preferences.join(", "));
    setWeddingDietaryNeeds("");
    setWeddingRiskNotes(client.notes);
    setIsDetailOpen(false);
    setIsWeddingFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contacts = [
      { name: p1Name || coupleName.split("&")[0]?.trim() || "Pareja 1", role: p1Role, phone: p1Phone, email: p1Email },
      { name: p2Name || coupleName.split("&")[1]?.trim() || "Pareja 2", role: p2Role, phone: p2Phone, email: p2Email }
    ].filter((c) => c.name.length > 0);

    const preferences = preferencesInput
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (activeClient) {
      updateClient({
        ...activeClient,
        coupleName,
        contacts,
        preferences,
        notes,
        rgpdConsent
      });
    } else {
      addClient({
        coupleName,
        contacts,
        preferences,
        notes,
        rgpdConsent
      });
    }
    setIsFormOpen(false);
  };

  const handleCreateWeddingFromClient = (submitEvent: React.FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    if (!weddingClient) return;

    const contactOne = weddingClient.contacts[0] || { name: "Persona 1", role: "novia", phone: "", email: "" };
    const contactTwo = weddingClient.contacts[1] || { name: "Persona 2", role: "novio", phone: "", email: "" };
    const project = createWeddingProject({
      addClient,
      addEvent,
      addParejaProfile,
      addEventService,
      addWorkspacePage,
      addWorkspaceBlock,
      addCalendarItem
    }, {
      clientId: weddingClient.id,
      coupleName: weddingClient.coupleName,
      eventName: weddingEventName,
      date: weddingDate,
      location: weddingLocation,
      region: weddingRegion,
      guests: weddingGuests,
      budget: weddingBudget,
      style: weddingStyle,
      preferences: weddingPriorities || weddingClient.preferences.join(", "),
      dietaryNeeds: weddingDietaryNeeds,
      riskNotes: weddingRiskNotes,
      clientNotes: weddingClient.notes,
      rgpdConsent: weddingClient.rgpdConsent,
      contactOne: {
        name: contactOne.name,
        role: contactOne.role,
        phone: contactOne.phone,
        email: contactOne.email,
        preferences: weddingClient.preferences.join(", ")
      },
      contactTwo: {
        name: contactTwo.name,
        role: contactTwo.role,
        phone: contactTwo.phone,
        email: contactTwo.email,
        preferences: weddingClient.preferences.join(", ")
      }
    });

    setIsWeddingFormOpen(false);
    setIsDetailOpen(false);
    onSelectEvent(project.eventId);
    setActiveTab("events");
  };

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      {/* Top search/actions bar */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "10px", background: "var(--pure-white)", padding: "16px", borderRadius: "8px", border: "1px solid var(--line)" }}>
        <div style={{ display: "flex", flex: 1, minWidth: "260px", gap: "8px", position: "relative" }}>
          <input
            type="text"
            placeholder="Buscar por nombre de pareja o notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "36px" }}
            aria-label="Buscar cliente"
          />
          <Search size={18} style={{ position: "absolute", left: "12px", top: "11px", color: "var(--slate-grey)" }} />
        </div>

        <button
          className="primary-button"
          onClick={openCreateModal}
          style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}
        >
          <Plus size={16} /> Registrar Pareja / Cliente
        </button>
      </div>

      {/* Grid view of clients */}
      {filteredClients.length === 0 ? (
        <div className="empty-state">No se encontraron clientes registrados.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {filteredClients.map((client) => {
            const clientEvents = events.filter((e) => e.clientId === client.id);
            return (
              <div
                key={client.id}
                style={{
                  background: "var(--pure-white)",
                  border: "1px solid var(--line)",
                  borderRadius: "8px",
                  padding: "16px",
                  display: "grid",
                  gap: "12px",
                  cursor: "pointer",
                  transition: "transform 0.15s"
                }}
                onClick={() => {
                  setActiveClient(client);
                  setIsDetailOpen(true);
                }}
              >
                <div>
                  <span className="eyebrow" style={{ fontSize: "9px" }}>Cuenta Clientes</span>
                  <h3 style={{ margin: "4px 0 2px 0", fontSize: "18px", fontFamily: '"Source Serif 4", Georgia, serif', color: "var(--primary)" }}>
                    {client.coupleName}
                  </h3>
                  <p style={{ margin: 0, fontSize: "12px", color: "var(--slate-grey)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={12} /> {clientEvents.length} {clientEvents.length === 1 ? "evento asociado" : "eventos asociados"}
                  </p>
                </div>

                <div style={{ display: "grid", gap: "6px", fontSize: "13px" }}>
                  {client.contacts.map((contact, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--slate-grey)" }}>
                      <User size={12} />
                      <span>{contact.name} ({contact.role})</span>
                    </div>
                  ))}
                </div>

                {client.preferences.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {client.preferences.slice(0, 3).map((pref) => (
                      <span key={pref} className="pill" style={{ fontSize: "10px", padding: "1px 5px" }}>{pref}</span>
                    ))}
                    {client.preferences.length > 3 && (
                      <span className="pill" style={{ fontSize: "10px", padding: "1px 5px" }}>+{client.preferences.length - 3}</span>
                    )}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed var(--line)", paddingTop: "8px", marginTop: "4px" }}>
                  <span style={{ fontSize: "11px", display: "flex", alignItems: "center", gap: "4px", color: client.rgpdConsent ? "var(--primary)" : "var(--secondary)" }}>
                    <CheckCircle size={10} /> RGPD {client.rgpdConsent ? "Aceptado" : "Pendiente"}
                  </span>
                  
                  <button
                    className="mini-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(client);
                    }}
                    style={{ width: "auto", fontSize: "11px", minHeight: "28px", padding: "4px 8px", marginLeft: "auto" }}
                  >
                    Editar
                  </button>
                  {clientEvents.length > 0 ? (
                    <button
                      className="mini-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(clientEvents[0].id);
                        setActiveTab("events");
                      }}
                      style={{ width: "auto", fontSize: "11px", minHeight: "28px", padding: "4px 8px" }}
                    >
                      Gestionar
                    </button>
                  ) : (
                    <button
                      className="mini-button active"
                      onClick={(e) => {
                        e.stopPropagation();
                        openWeddingModal(client);
                      }}
                      style={{ width: "auto", fontSize: "11px", minHeight: "28px", padding: "4px 8px" }}
                    >
                      Crear boda
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details modal */}
      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title={`Ficha de Clientes: ${activeClient?.coupleName}`}>
        {activeClient && (
          <div style={{ display: "grid", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: '"Source Serif 4", Georgia, serif', color: "var(--primary)", fontSize: "22px" }}>
                  {activeClient.coupleName}
                </h3>
                <p className="eyebrow" style={{ margin: "2px 0 0 0" }}>ID: {activeClient.id}</p>
              </div>
              <div style={{ display: "flex", gap: "6px", marginLeft: "auto" }}>
                <button
                  className="secondary-button"
                  onClick={() => {
                    setIsDetailOpen(false);
                    openEditModal(activeClient);
                  }}
                >
                  Editar Datos
                </button>
                <button
                  className="secondary-button"
                  style={{ color: "var(--error)", borderColor: "var(--error-soft)" }}
                  onClick={() => {
                    deleteClient(activeClient.id);
                    setIsDetailOpen(false);
                  }}
                >
                  Eliminar Cuenta
                </button>
              </div>
            </div>

            <hr style={{ border: 0, borderTop: "1px solid var(--outline-variant)", margin: 0 }} />

            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "var(--primary)" }}>Contactos Directos</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {activeClient.contacts.map((contact, i) => (
                  <div key={i} style={{ padding: "12px", background: "var(--surface-low)", borderRadius: "8px", display: "grid", gap: "6px", fontSize: "13px" }}>
                    <strong style={{ color: "var(--primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <User size={14} /> {contact.name} ({contact.role.toUpperCase()})
                    </strong>
                    {contact.phone && (
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--slate-grey)" }}>
                        <Phone size={12} /> {contact.phone}
                      </span>
                    )}
                    {contact.email && (
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--slate-grey)" }}>
                        <Mail size={12} /> {contact.email}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {activeClient.preferences.length > 0 && (
              <div>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "var(--primary)" }}>Preferencias del Evento</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {activeClient.preferences.map((pref) => (
                    <span key={pref} className="pill" style={{ display: "inline-flex", gap: "4px", alignItems: "center" }}>
                      <Heart size={10} fill="var(--secondary)" color="var(--secondary)" /> {pref}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "var(--primary)" }}>Bodas y Eventos Asociados</h4>
              <div style={{ display: "grid", gap: "8px" }}>
                {events.filter((e) => e.clientId === activeClient.id).map((event) => (
                  <div key={event.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "var(--surface-low)", borderRadius: "8px", border: "1px solid var(--outline-variant)" }}>
                    <div>
                      <strong style={{ fontSize: "14px", color: "var(--primary)" }}>{event.name}</strong>
                      <span style={{ fontSize: "12px", color: "var(--slate-grey)", display: "block", marginTop: "2px" }}>
                        📍 {event.location} · 📅 {event.date} · 👥 {event.guests} invitados
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                          setIsDetailOpen(false);
                          onSelectEvent(event.id);
                          setActiveTab("notion");
                        }}
                        style={{ fontSize: "12px", minHeight: "32px", padding: "6px 12px" }}
                      >
                        <FileText size={14} /> Notion
                      </button>
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() => {
                          setIsDetailOpen(false);
                          onSelectEvent(event.id);
                          setActiveTab("events");
                        }}
                        style={{ fontSize: "12px", minHeight: "32px", padding: "6px 12px" }}
                      >
                        Gestionar Boda
                      </button>
                    </div>
                  </div>
                ))}
                {events.filter((e) => e.clientId === activeClient.id).length === 0 && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "12px", background: "var(--surface-low)", borderRadius: "8px", border: "1px dashed var(--outline-variant)" }}>
                    <p style={{ margin: 0, fontSize: "13px", color: "var(--slate-grey)" }}>No hay eventos asociados. Convierte esta cuenta en una boda para generar ficha, Notion, pagos y agenda.</p>
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => openWeddingModal(activeClient)}
                      style={{ whiteSpace: "nowrap", fontSize: "12px", minHeight: "32px", padding: "6px 12px" }}
                    >
                      Crear boda <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", color: "var(--primary)" }}>Notas Privadas del Wedding Planner</h4>
              <div style={{ padding: "12px", background: "#fff", border: "1px solid var(--outline-variant)", borderRadius: "8px", fontSize: "13px", lineHeight: "1.5", color: "var(--on-surface-variant)" }}>
                {activeClient.notes || "No hay notas adicionales registradas."}
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", background: "var(--surface-low)", padding: "12px", borderRadius: "8px", alignItems: "center", fontSize: "13px" }}>
              <ShieldAlert size={16} style={{ color: activeClient.rgpdConsent ? "var(--primary)" : "var(--secondary)" }} />
              <span>
                <strong>Privacidad y RGPD: </strong>
                {activeClient.rgpdConsent
                  ? "Consentimiento de tratamiento de datos explícito firmado y guardado."
                  : "Falta firma de consentimiento RGPD."}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* Wedding project modal */}
      <Modal isOpen={isWeddingFormOpen} onClose={() => setIsWeddingFormOpen(false)} title={`Crear boda desde CRM${weddingClient ? `: ${weddingClient.coupleName}` : ""}`}>
        <form onSubmit={handleCreateWeddingFromClient} style={{ display: "grid", gap: "12px" }}>
          <div style={{ padding: "12px", background: "var(--surface-low)", borderRadius: "8px", border: "1px solid var(--outline-variant)", display: "grid", gap: "6px" }}>
            <strong style={{ color: "var(--primary)", fontSize: "14px" }}>{weddingClient?.coupleName || "Cuenta cliente"}</strong>
            <p style={{ margin: 0, color: "var(--slate-grey)", fontSize: "13px", lineHeight: 1.45 }}>
              Este paso crea la boda, su ficha operativa, perfiles de pareja, roadmap Notion, pagos iniciales y agenda base.
            </p>
          </div>

          <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
            Nombre del proyecto boda *
            <input required placeholder="Ej. Boda A&B" value={weddingEventName} onChange={(eventInput) => setWeddingEventName(eventInput.target.value)} />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
              Fecha de la boda *
              <input required type="date" value={weddingDate} onChange={(eventInput) => setWeddingDate(eventInput.target.value)} />
            </label>
            <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
              Zona de operacion
              <select value={weddingRegion} onChange={(eventInput) => setWeddingRegion(eventInput.target.value)}>
                <option value="Pais Vasco">Pais Vasco / Gipuzkoa</option>
                <option value="Canarias">Canarias / Gran Canaria</option>
              </select>
            </label>
          </div>

          <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
            Lugar o finca
            <input placeholder="Ej. Bodega, finca, restaurante..." value={weddingLocation} onChange={(eventInput) => setWeddingLocation(eventInput.target.value)} />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
              Invitados estimados
              <input type="number" min={10} value={weddingGuests} onChange={(eventInput) => setWeddingGuests(Number(eventInput.target.value))} />
            </label>
            <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
              Presupuesto estimado
              <input type="number" min={1000} value={weddingBudget} onChange={(eventInput) => setWeddingBudget(Number(eventInput.target.value))} />
            </label>
          </div>

          <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
            Estilo y concepto
            <input placeholder="Ej. ceremonia exterior, fiesta larga, cocina local..." value={weddingStyle} onChange={(eventInput) => setWeddingStyle(eventInput.target.value)} />
          </label>

          <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
            Preferencias clave
            <input placeholder="Ej. musica en directo, flores silvestres, menu vegetariano..." value={weddingPriorities} onChange={(eventInput) => setWeddingPriorities(eventInput.target.value)} />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
              Dietas / alergias
              <input placeholder="Ej. celiacos, veganos, frutos secos" value={weddingDietaryNeeds} onChange={(eventInput) => setWeddingDietaryNeeds(eventInput.target.value)} />
            </label>
            <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
              Riesgos o notas iniciales
              <input placeholder="Ej. lluvia, transporte, familia sensible" value={weddingRiskNotes} onChange={(eventInput) => setWeddingRiskNotes(eventInput.target.value)} />
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <button className="secondary-button" type="button" onClick={() => setIsWeddingFormOpen(false)}>Cancelar</button>
            <button className="primary-button" type="submit">Crear proyecto completo</button>
          </div>
        </form>
      </Modal>

      {/* Form modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={activeClient ? "Editar Cuenta de Clientes" : "Nueva Cuenta de Clientes"}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
          <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
            Nombre de la Pareja (Cuenta de Facturación/Coordinación) *
            <input required placeholder="Ej. Andrea & Oier" value={coupleName} onChange={(e) => setCoupleName(e.target.value)} />
          </label>

          <div style={{ padding: "12px", background: "var(--surface-low)", borderRadius: "8px", display: "grid", gap: "10px" }}>
            <strong style={{ fontSize: "13px", color: "var(--primary)" }}>Contacto Pareja 1</strong>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "8px" }}>
              <input placeholder="Nombre" value={p1Name} onChange={(e) => setP1Name(e.target.value)} />
              <select value={p1Role} onChange={(e) => setP1Role(e.target.value)}>
                <option value="novia">Novia</option>
                <option value="novio">Novio</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <input placeholder="Teléfono" value={p1Phone} onChange={(e) => setP1Phone(e.target.value)} />
              <input placeholder="Email" type="email" value={p1Email} onChange={(e) => setP1Email(e.target.value)} />
            </div>
          </div>

          <div style={{ padding: "12px", background: "var(--surface-low)", borderRadius: "8px", display: "grid", gap: "10px" }}>
            <strong style={{ fontSize: "13px", color: "var(--primary)" }}>Contacto Pareja 2</strong>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "8px" }}>
              <input placeholder="Nombre" value={p2Name} onChange={(e) => setP2Name(e.target.value)} />
              <select value={p2Role} onChange={(e) => setP2Role(e.target.value)}>
                <option value="novio">Novio</option>
                <option value="novia">Novia</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <input placeholder="Teléfono" value={p2Phone} onChange={(e) => setP2Phone(e.target.value)} />
              <input placeholder="Email" type="email" value={p2Email} onChange={(e) => setP2Email(e.target.value)} />
            </div>
          </div>

          <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
            Preferencias (separadas por comas)
            <input placeholder="Ej. boda al aire libre, comida vegana, fiesta larga" value={preferencesInput} onChange={(e) => setPreferencesInput(e.target.value)} />
          </label>

          <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
            Notas privadas
            <textarea
              placeholder="Introduce notas internas del planner..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ minHeight: "60px", padding: "8px", borderRadius: "8px", border: "1px solid var(--line)", fontFamily: "inherit" }}
            />
          </label>

          <label className="check-row" style={{ flexDirection: "row", gap: "8px", alignItems: "center", textTransform: "none" }}>
            <input type="checkbox" checked={rgpdConsent} onChange={(e) => setRgpdConsent(e.target.checked)} />
            <span>Consentimiento RGPD registrado y firmado</span>
          </label>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <button className="secondary-button" type="button" onClick={() => setIsFormOpen(false)}>Cancelar</button>
            <button className="primary-button" type="submit">Guardar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
