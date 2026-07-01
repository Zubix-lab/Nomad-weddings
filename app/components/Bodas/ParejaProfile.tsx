"use client";

import React, { useState, useEffect } from "react";
import type { ParejaProfile } from "@/lib/types";
import { User, Phone, Mail, Edit2, Check, X } from "lucide-react";

interface ParejaProfileProps {
  eventId: string;
  profiles: ParejaProfile[];
  onSave: (profile: Omit<ParejaProfile, "id"> & { id?: string }) => void;
}

export function ParejaProfilePanel({ eventId, profiles, onSave }: ParejaProfileProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState<"novio" | "novia" | "otro">("novio");
  const [edad, setEdad] = useState<number | undefined>(undefined);
  const [profesion, setProfesion] = useState("");
  const [gustos, setGustos] = useState("");
  const [alergias, setAlergias] = useState("");
  const [talla, setTalla] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [notas, setNotas] = useState("");

  // Get profiles for this event (up to 2, or create default slots if empty)
  const eventProfiles = profiles.filter((p) => p.eventId === eventId);
  
  // Enforce exactly two profiles for comparison display (e.g., Novia & Novio, or any 2 partners)
  const defaultProfiles: Array<Partial<ParejaProfile> & { rol: "novia" | "novio" | "otro" }> = [
    { rol: "novia", nombre: "Novia (Pendiente)" },
    { rol: "novio", nombre: "Novio (Pendiente)" }
  ];

  const displayProfiles = [0, 1].map((index) => {
    return eventProfiles[index] || {
      id: `temp-profile-${index}`,
      eventId,
      rol: defaultProfiles[index].rol,
      nombre: defaultProfiles[index].nombre,
      contacto: { telefono: "", email: "" }
    };
  });

  const startEdit = (profile: ParejaProfile) => {
    setEditingId(profile.id);
    setNombre(profile.nombre.includes("(Pendiente)") ? "" : profile.nombre);
    setRol(profile.rol);
    setEdad(profile.edad);
    setProfesion(profile.profesion || "");
    setGustos(profile.gustos || "");
    setAlergias(profile.alergias || "");
    setTalla(profile.talla || "");
    setTelefono(profile.contacto.telefono || "");
    setEmail(profile.contacto.email || "");
    setNotas(profile.notas || "");
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = (id: string) => {
    const isTemp = id.startsWith("temp-profile");
    onSave({
      id: isTemp ? undefined : id,
      eventId,
      nombre: nombre || (rol === "novia" ? "Novia" : "Novio"),
      rol,
      edad: edad ? Number(edad) : undefined,
      profesion,
      gustos,
      alergias,
      talla,
      contacto: {
        telefono,
        email
      },
      notas
    });
    setEditingId(null);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
      {displayProfiles.map((profile) => {
        const isEditing = editingId === profile.id;
        const isPlaceholder = profile.nombre?.includes("(Pendiente)");

        return (
          <div
            key={profile.id}
            style={{
              background: "var(--pure-white)",
              border: isEditing ? "2px solid var(--primary)" : "1px solid var(--line)",
              borderRadius: "8px",
              padding: "20px",
              position: "relative"
            }}
          >
            {isEditing ? (
              <div style={{ display: "grid", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "between", alignItems: "center", marginBottom: "4px" }}>
                  <h4 style={{ margin: 0, fontSize: "14px", color: "var(--slate-grey)" }}>Editar Perfil</h4>
                  <div style={{ display: "flex", gap: "6px", marginLeft: "auto" }}>
                    <button
                      className="mini-button"
                      onClick={() => handleSave(profile.id!)}
                      style={{ background: "var(--primary)", color: "white" }}
                      title="Guardar"
                    >
                      <Check size={14} />
                    </button>
                    <button className="mini-button" onClick={handleCancel} title="Cancelar">
                      <X size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "8px" }}>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre"
                    aria-label="Nombre"
                  />
                  <select value={rol} onChange={(e) => setRol(e.target.value as "novio" | "novia" | "otro")} aria-label="Rol">
                    <option value="novia">Novia</option>
                    <option value="novio">Novio</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "8px" }}>
                  <input
                    type="number"
                    value={edad || ""}
                    onChange={(e) => setEdad(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Edad"
                    aria-label="Edad"
                  />
                  <input
                    value={profesion}
                    onChange={(e) => setProfesion(e.target.value)}
                    placeholder="Profesión"
                    aria-label="Profesión"
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <input
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Teléfono"
                    aria-label="Teléfono"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    aria-label="Email"
                  />
                </div>

                <input
                  value={talla}
                  onChange={(e) => setTalla(e.target.value)}
                  placeholder="Talla / Medidas vestido o traje"
                  aria-label="Tallas y medidas"
                />

                <input
                  value={alergias}
                  onChange={(e) => setAlergias(e.target.value)}
                  placeholder="Alergias / Dietas especiales"
                  aria-label="Alergias y dietas"
                />

                <input
                  value={gustos}
                  onChange={(e) => setGustos(e.target.value)}
                  placeholder="Intereses y gustos personales"
                  aria-label="Gustos e intereses"
                />

                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Notas adicionales y detalles privados..."
                  aria-label="Notas adicionales"
                  style={{
                    minHeight: "60px",
                    width: "100%",
                    padding: "8px",
                    border: "1px solid var(--line)",
                    borderRadius: "8px",
                    fontFamily: "inherit",
                    fontSize: "12px"
                  }}
                />
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "between", alignItems: "start", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "var(--surface-low)",
                        display: "grid",
                        placeItems: "center",
                        color: "var(--primary)"
                      }}
                    >
                      <User size={20} />
                    </div>
                    <div>
                      <span className="eyebrow" style={{ fontSize: "9px" }}>
                        {profile.rol?.toUpperCase() || "PAREJA"}
                      </span>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "18px",
                          fontFamily: '"Source Serif 4", Georgia, serif',
                          color: isPlaceholder ? "var(--slate-grey)" : "var(--primary)"
                        }}
                      >
                        {profile.nombre}
                      </h4>
                    </div>
                  </div>
                  
                  <button
                    className="mini-button"
                    onClick={() => startEdit(profile as ParejaProfile)}
                    style={{ marginLeft: "auto" }}
                    title="Editar perfil"
                  >
                    <Edit2 size={12} />
                  </button>
                </div>

                {!isPlaceholder && (
                  <div style={{ display: "grid", gap: "12px", fontSize: "13px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div>
                        <span className="eyebrow" style={{ fontSize: "9px" }}>Edad</span>
                        <p style={{ margin: "2px 0 0 0", fontWeight: "bold" }}>{profile.edad || "N/A"} años</p>
                      </div>
                      <div>
                        <span className="eyebrow" style={{ fontSize: "9px" }}>Profesión</span>
                        <p style={{ margin: "2px 0 0 0", fontWeight: "bold" }}>{profile.profesion || "N/A"}</p>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", borderTop: "1px dashed var(--line)", paddingTop: "8px" }}>
                      <div>
                        <span className="eyebrow" style={{ fontSize: "9px" }}>Contacto</span>
                        <p style={{ margin: "2px 0 0 0", color: "var(--slate-grey)", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Phone size={10} /> {profile.contacto?.telefono || "N/A"}
                        </p>
                        <p style={{ margin: "2px 0 0 0", color: "var(--slate-grey)", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Mail size={10} /> {profile.contacto?.email || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="eyebrow" style={{ fontSize: "9px" }}>Talla / Medidas</span>
                        <p style={{ margin: "2px 0 0 0", fontWeight: "bold" }}>{profile.talla || "No registrada"}</p>
                      </div>
                    </div>

                    <div style={{ borderTop: "1px dashed var(--line)", paddingTop: "8px" }}>
                      <span className="eyebrow" style={{ fontSize: "9px" }}>Alergias / Dietas especiales</span>
                      <p style={{ margin: "2px 0 0 0", color: profile.alergias ? "var(--error)" : "var(--slate-grey)", fontWeight: profile.alergias ? "bold" : "normal" }}>
                        {profile.alergias || "Ninguna registrada"}
                      </p>
                    </div>

                    <div>
                      <span className="eyebrow" style={{ fontSize: "9px" }}>Intereses y Gustos</span>
                      <p style={{ margin: "2px 0 0 0", color: "var(--slate-grey)" }}>
                        {profile.gustos || "Ninguno registrado"}
                      </p>
                    </div>

                    <div style={{ background: "var(--surface-low)", padding: "10px", borderRadius: "6px" }}>
                      <span className="eyebrow" style={{ fontSize: "9px" }}>Notas internas del planner</span>
                      <p style={{ margin: "2px 0 0 0", fontSize: "12px", fontStyle: "italic", color: "var(--on-surface-variant)" }}>
                        {profile.notas || "Sin anotaciones."}
                      </p>
                    </div>
                  </div>
                )}
                {isPlaceholder && (
                  <div style={{ display: "grid", placeItems: "center", minHeight: "150px", border: "1px dashed var(--line)", borderRadius: "8px", color: "var(--slate-grey)" }}>
                    Haz clic en el lápiz superior para rellenar el perfil de esta persona.
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
