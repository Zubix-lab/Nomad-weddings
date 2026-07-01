"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { emailTemplates } from "@/lib/emailTemplates";
import { Mail, Copy, Check, ExternalLink } from "lucide-react";

export default function EmailTemplatesPage() {
  const { events, vendors } = useApp();
  const [selectedTemplateId, setSelectedTemplateId] = useState(emailTemplates[0].id);
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || "");
  const [selectedVendorId, setSelectedVendorId] = useState(vendors[0]?.id || "");
  const [copied, setCopied] = useState(false);

  // Custom text fields if they want to override
  const [serviciosInteres, setServiciosInteres] = useState("Decoración floral del altar y centros de mesa");
  const [nombrePlanner, setNombrePlanner] = useState("Soraya");

  const template = useMemo(() => {
    return emailTemplates.find((t) => t.id === selectedTemplateId) || emailTemplates[0];
  }, [selectedTemplateId]);

  const activeEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0];
  }, [events, selectedEventId]);

  const activeVendor = useMemo(() => {
    return vendors.find((v) => v.id === selectedVendorId) || vendors[0];
  }, [vendors, selectedVendorId]);

  // Fill templates logic
  const filledTemplate = useMemo(() => {
    if (!template) return { subject: "", body: "" };
    if (!activeEvent || !activeVendor) {
      return { subject: template.asunto, body: template.cuerpo };
    }

    let subject = template.asunto;
    let body = template.cuerpo;

    // Replace variables
    const replacements: Record<string, string> = {
      "{{nombre_proveedor}}": activeVendor.name,
      "{{nombre_pareja}}": activeEvent.name.replace("Boda ", ""),
      "{{fecha_boda}}": new Date(activeEvent.date).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" }),
      "{{ubicacion_boda}}": activeEvent.location,
      "{{num_invitados}}": activeEvent.guests.toString(),
      "{{servicios_interes}}": serviciosInteres,
      "{{nombre_planner}}": nombrePlanner
    };

    Object.entries(replacements).forEach(([key, val]) => {
      subject = subject.replaceAll(key, val);
      body = body.replaceAll(key, val);
    });

    return { subject, body };
  }, [template, activeEvent, activeVendor, serviciosInteres, nombrePlanner]);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Asunto: ${filledTemplate.subject}\n\n${filledTemplate.body}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenEmail = () => {
    if (!activeVendor) return;
    const mailto = `mailto:${activeVendor.email}?subject=${encodeURIComponent(filledTemplate.subject)}&body=${encodeURIComponent(filledTemplate.body)}`;
    window.open(mailto);
  };

  return (
    <div className="split-layout">
      {/* Settings Selector */}
      <section className="panel" style={{ display: "grid", gap: "16px", height: "fit-content" }}>
        <div className="panel-header">
          <h3>Configurar Envío</h3>
          <div className="panel-action"><Mail size={18} /></div>
        </div>

        <label className="check-row" style={{ flexDirection: "column", alignItems: "stretch", textTransform: "none", fontWeight: "bold" }}>
          Plantilla de Email
          <select value={selectedTemplateId} onChange={(e) => setSelectedTemplateId(e.target.value)}>
            {emailTemplates.map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </label>

        <label className="check-row" style={{ flexDirection: "column", alignItems: "stretch", textTransform: "none", fontWeight: "bold" }}>
          Boda / Evento Referencia
          <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.name} ({e.location})</option>
            ))}
          </select>
        </label>

        <label className="check-row" style={{ flexDirection: "column", alignItems: "stretch", textTransform: "none", fontWeight: "bold" }}>
          Proveedor Destinatario
          <select value={selectedVendorId} onChange={(e) => setSelectedVendorId(e.target.value)}>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>{v.name} ({v.category} · {v.region})</option>
            ))}
          </select>
        </label>

        {template.variables.includes("servicios_interes") && (
          <label className="check-row" style={{ flexDirection: "column", alignItems: "stretch", textTransform: "none", fontWeight: "bold" }}>
            Servicio(s) de Interés
            <input value={serviciosInteres} onChange={(e) => setServiciosInteres(e.target.value)} />
          </label>
        )}

        <label className="check-row" style={{ flexDirection: "column", alignItems: "stretch", textTransform: "none", fontWeight: "bold" }}>
          Tu Nombre (Planner)
          <input value={nombrePlanner} onChange={(e) => setNombrePlanner(e.target.value)} />
        </label>

        <div style={{ marginTop: "10px", padding: "10px", background: "var(--surface-low)", borderRadius: "8px", fontSize: "11px", color: "var(--slate-grey)", lineHeight: "1.4" }}>
          <strong>Email Destinatario: </strong>
          {activeVendor?.email ? (
            <a href={`mailto:${activeVendor.email}`} style={{ color: "var(--primary)", fontWeight: "bold" }}>
              {activeVendor.email}
            </a>
          ) : (
            "Sin email configurado en proveedor"
          )}
        </div>
      </section>

      {/* Preview Section */}
      <section className="panel wide" style={{ display: "grid", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontFamily: '"Source Serif 4", Georgia, serif', color: "var(--primary)", fontSize: "20px" }}>
            Vista Previa del Mensaje
          </h3>
          
          <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
            <button
              className="secondary-button"
              onClick={handleCopy}
              style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}
            >
              {copied ? <Check size={16} style={{ color: "var(--primary)" }} /> : <Copy size={16} />}
              {copied ? "¡Copiado!" : "Copiar plantilla"}
            </button>
            <button
              className="primary-button"
              onClick={handleOpenEmail}
              disabled={!activeVendor?.email}
              style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}
            >
              <ExternalLink size={16} /> Abrir en Gestor de Correo
            </button>
          </div>
        </div>

        <div style={{ background: "var(--surface-low)", padding: "20px", borderRadius: "8px", border: "1px solid var(--outline-variant)" }}>
          <div style={{ paddingBottom: "12px", borderBottom: "1px solid var(--outline-variant)", marginBottom: "16px" }}>
            <span className="eyebrow" style={{ fontSize: "9px" }}>Asunto</span>
            <strong style={{ display: "block", fontSize: "16px", color: "var(--primary)", marginTop: "4px" }}>
              {filledTemplate.subject}
            </strong>
          </div>
          <div>
            <span className="eyebrow" style={{ fontSize: "9px" }}>Cuerpo</span>
            <pre
              style={{
                margin: "8px 0 0 0",
                whiteSpace: "pre-wrap",
                fontFamily: "inherit",
                fontSize: "14px",
                lineHeight: "1.6",
                color: "var(--on-surface-variant)"
              }}
            >
              {filledTemplate.body}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
