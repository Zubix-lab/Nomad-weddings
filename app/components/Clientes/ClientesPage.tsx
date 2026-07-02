"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Search, Plus, User, Phone, Mail, CheckCircle, ShieldAlert, Heart, Calendar } from "lucide-react";
import { Modal } from "../UI/Modal";
import type { Client } from "@/lib/types";

export default function ClientesPage() {
  const { clients, events, addClient, updateClient, deleteClient } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeClient, setActiveClient] = useState<Client | undefined>(undefined);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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
                    style={{ fontSize: "11px", minHeight: "28px", padding: "4px 8px", marginLeft: "auto" }}
                  >
                    Editar
                  </button>
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
