"use client";

import React, { useState } from "react";
import type { Reunion } from "@/lib/types";
import { Plus, MessageSquare, ListTodo, Video, Phone, Users } from "lucide-react";
import { Modal } from "../UI/Modal";

interface ReunionesPanelProps {
  eventId: string;
  reuniones: Reunion[];
  onSave: (reunion: Omit<Reunion, "id"> & { id?: string }) => void;
  onDelete: (id: string) => void;
}

export function ReunionesPanel({ eventId, reuniones, onSave, onDelete }: ReunionesPanelProps) {
  const eventReuniones = reuniones
    .filter((r) => r.eventId === eventId)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  // Form Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReunion, setEditingReunion] = useState<Reunion | undefined>(undefined);
  
  // Form fields
  const [fecha, setFecha] = useState("");
  const [tipo, setTipo] = useState<"presencial" | "online" | "llamada">("online");
  const [asistentesInput, setAsistentesInput] = useState("");
  const [notas, setNotas] = useState("");
  const [transcripcion, setTranscripcion] = useState("");
  const [acuerdosInput, setAcuerdosInput] = useState("");

  const openCreateModal = () => {
    setEditingReunion(undefined);
    setFecha(new Date().toISOString().substring(0, 16));
    setTipo("online");
    setAsistentesInput("Novio, Novia, Nomad");
    setNotas("");
    setTranscripcion("");
    setAcuerdosInput("");
    setIsFormOpen(true);
  };

  const openEditModal = (r: Reunion) => {
    setEditingReunion(r);
    setFecha(r.fecha.substring(0, 16));
    setTipo(r.tipo);
    setAsistentesInput(r.asistentes.join(", "));
    setNotas(r.notas);
    setTranscripcion(r.transcripcion || "");
    setAcuerdosInput(r.acuerdos.join("\n"));
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const asistentes = asistentesInput.split(",").map((a) => a.trim()).filter((a) => a.length > 0);
    const acuerdos = acuerdosInput.split("\n").map((a) => a.trim()).filter((a) => a.length > 0);

    onSave({
      id: editingReunion?.id,
      eventId,
      fecha,
      tipo,
      asistentes,
      notas,
      transcripcion,
      acuerdos,
      createdAt: editingReunion?.createdAt || new Date().toISOString().substring(0, 10)
    });
    
    setIsFormOpen(false);
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "presencial":
        return <Users size={16} />;
      case "llamada":
        return <Phone size={16} />;
      default:
        return <Video size={16} />;
    }
  };

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ margin: 0, fontSize: "16px", color: "var(--primary)", fontFamily: '"Source Serif 4", Georgia, serif' }}>
          Historial de Reuniones ({eventReuniones.length})
        </h4>
        <button
          className="primary-button"
          onClick={openCreateModal}
          style={{ display: "inline-flex", gap: "6px", alignItems: "center", minHeight: "34px", padding: "4px 10px", fontSize: "12px", marginLeft: "auto" }}
        >
          <Plus size={14} /> Registrar Reunión
        </button>
      </div>

      {eventReuniones.length === 0 ? (
        <div className="empty-state" style={{ minHeight: "180px" }}>
          No hay reuniones registradas para esta boda.
        </div>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {eventReuniones.map((reunion) => (
            <div
              key={reunion.id}
              style={{
                background: "var(--pure-white)",
                border: "1px solid var(--line)",
                borderRadius: "8px",
                padding: "16px",
                display: "grid",
                gap: "10px"
              }}
            >
              {/* Meeting Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      background: "var(--surface-low)",
                      color: "var(--primary)",
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      display: "grid",
                      placeItems: "center"
                    }}
                  >
                    {getTipoIcon(reunion.tipo)}
                  </span>
                  <div>
                    <strong style={{ fontSize: "14px", color: "var(--primary)" }}>
                      Reunión {reunion.tipo.charAt(0).toUpperCase() + reunion.tipo.slice(1)}
                    </strong>
                    <p style={{ margin: 0, fontSize: "11px", color: "var(--slate-grey)" }}>
                      {new Date(reunion.fecha).toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
                
                <div style={{ display: "flex", gap: "6px", marginLeft: "auto" }}>
                  <button
                    className="mini-button"
                    onClick={() => openEditModal(reunion)}
                    title="Editar acta"
                  >
                    Editar
                  </button>
                  <button
                    className="mini-button"
                    style={{ color: "var(--error)", borderColor: "var(--error-soft)" }}
                    onClick={() => onDelete(reunion.id)}
                    title="Eliminar"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {/* Attending */}
              <div style={{ fontSize: "12px", color: "var(--slate-grey)" }}>
                <strong>Asistentes: </strong>
                {reunion.asistentes.join(", ")}
              </div>

              {/* Summary notes */}
              <div>
                <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "var(--slate-grey)", fontWeight: "bold" }}>
                  Resumen y Notas:
                </p>
                <div style={{ fontSize: "13px", lineHeight: "1.4", color: "var(--on-surface)" }}>
                  {reunion.notas}
                </div>
              </div>

              {/* Transcripcion snippet */}
              {reunion.transcripcion && (
                <div style={{ padding: "10px", background: "var(--surface-low)", borderRadius: "6px", fontSize: "12px" }}>
                  <p style={{ margin: "0 0 4px 0", fontWeight: "bold", color: "var(--primary)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <MessageSquare size={12} /> Transcripción de Audio / Conversación:
                  </p>
                  <p style={{ margin: 0, color: "var(--on-surface-variant)", whiteSpace: "pre-wrap", lineHeight: "1.4", fontStyle: "italic" }}>
                    &ldquo;{reunion.transcripcion}&rdquo;
                  </p>
                </div>
              )}

              {/* Action items/decisions */}
              {reunion.acuerdos.length > 0 && (
                <div style={{ borderTop: "1px dashed var(--line)", paddingTop: "8px" }}>
                  <p style={{ margin: "0 0 6px 0", fontSize: "12px", color: "var(--slate-grey)", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}>
                    <ListTodo size={12} /> Acuerdos y Decisiones Tomadas:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", display: "grid", gap: "4px" }}>
                    {reunion.acuerdos.map((acuerdo, i) => (
                      <li key={i} style={{ color: "var(--primary)", fontWeight: "bold" }}>{acuerdo}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingReunion ? "Editar Acta de Reunión" : "Registrar Nueva Reunión"}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
              Fecha y Hora *
              <input type="datetime-local" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
            </label>
            <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
              Tipo de Reunión
              <select value={tipo} onChange={(e) => setTipo(e.target.value as "presencial" | "online" | "llamada")}>
                <option value="online">Videollamada (Online)</option>
                <option value="presencial">Presencial (In-situ)</option>
                <option value="llamada">Llamada telefónica</option>
              </select>
            </label>
          </div>

          <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
            Asistentes (separados por comas)
            <input value={asistentesInput} onChange={(e) => setAsistentesInput(e.target.value)} placeholder="Ej. Irene, Rubén, Soraya" />
          </label>

          <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
            Resumen de la reunión (Acta básica) *
            <textarea
              required
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Introduce un breve resumen de los temas tratados..."
              style={{ minHeight: "80px", padding: "8px", borderRadius: "8px", border: "1px solid var(--line)", fontFamily: "inherit" }}
            />
          </label>

          <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
            Transcripción de notas o dictado de audio
            <textarea
              value={transcripcion}
              onChange={(e) => setTranscripcion(e.target.value)}
              placeholder="Introduce la transcripción textual del audio de la reunión..."
              style={{ minHeight: "80px", padding: "8px", borderRadius: "8px", border: "1px solid var(--line)", fontFamily: "inherit" }}
            />
          </label>

          <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
            Acuerdos y Tareas resultantes (Uno por línea)
            <textarea
              value={acuerdosInput}
              onChange={(e) => setAcuerdosInput(e.target.value)}
              placeholder="Ej. Buscar catering&#10;Reservar flores"
              style={{ minHeight: "60px", padding: "8px", borderRadius: "8px", border: "1px solid var(--line)", fontFamily: "inherit" }}
            />
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
