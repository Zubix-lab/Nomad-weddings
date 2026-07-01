"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../UI/Modal";
import type { Vendor } from "@/lib/types";
import { categorias } from "@/lib/categorias";
import { zonas } from "@/lib/zonas";

interface ProveedorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vendor: Omit<Vendor, "id"> & { id?: string }) => void;
  vendor?: Vendor;
}

export function ProveedorForm({ isOpen, onClose, onSave, vendor }: ProveedorFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categorias[0].id);
  const [zoneId, setZoneId] = useState(zonas[0].id);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [capacity, setCapacity] = useState(100);
  const [reliability, setReliability] = useState(8);
  const [qualityScore, setQualityScore] = useState(8);
  const [responseTimeHours, setResponseTimeHours] = useState(12);
  const [previousExperience, setPreviousExperience] = useState(3);
  const [commissionFree, setCommissionFree] = useState(true);
  const [styleTagsInput, setStyleTagsInput] = useState("");
  const [notes, setNotes] = useState("");
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);

  // Sync state with edit vendor
  useEffect(() => {
    if (vendor) {
      setName(vendor.name);
      setCategory(vendor.category);
      setPhone(vendor.phone);
      setEmail(vendor.email);
      setWebsite(vendor.website);
      setCapacity(vendor.capacity);
      setReliability(vendor.reliability);
      setQualityScore(vendor.qualityScore);
      setResponseTimeHours(vendor.responseTimeHours);
      setPreviousExperience(vendor.previousExperience);
      setCommissionFree(vendor.commissionFree);
      setStyleTagsInput(vendor.styleTags.join(", "));
      setNotes(vendor.notes);
      setLat(vendor.lat);
      setLng(vendor.lng);
      
      // Try to find matching zone
      const matchedZone = zonas.find(
        (z) => z.label === vendor.region || z.provincia === vendor.region
      );
      if (matchedZone) {
        setZoneId(matchedZone.id);
      }
    } else {
      // Defaults
      setName("");
      setCategory(categorias[0].id);
      setZoneId(zonas[0].id);
      setPhone("");
      setEmail("");
      setWebsite("");
      setCapacity(100);
      setReliability(8);
      setQualityScore(8);
      setResponseTimeHours(12);
      setPreviousExperience(3);
      setCommissionFree(true);
      setStyleTagsInput("");
      setNotes("");
      
      const defaultZone = zonas[0];
      setLat(defaultZone.center.lat);
      setLng(defaultZone.center.lng);
    }
  }, [vendor, isOpen]);

  // Adjust coordinates when zone changes
  const handleZoneChange = (id: string) => {
    setZoneId(id);
    const selectedZone = zonas.find((z) => z.id === id);
    if (selectedZone) {
      setLat(selectedZone.center.lat);
      setLng(selectedZone.center.lng);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedZone = zonas.find((z) => z.id === zoneId);
    const region = selectedZone ? selectedZone.label : "País Vasco";
    const styleTags = styleTagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSave({
      id: vendor?.id,
      name,
      category,
      region,
      phone,
      email,
      website,
      capacity: Number(capacity),
      reliability: Number(reliability),
      qualityScore: Number(qualityScore),
      responseTimeHours: Number(responseTimeHours),
      previousExperience: Number(previousExperience),
      commissionFree,
      styleTags,
      notes,
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined
    });
    onClose();
  };

  const fieldStyle = {
    display: "grid",
    gap: "6px",
    color: "var(--muted)",
    fontSize: "13px",
    fontWeight: "700"
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={vendor ? "Editar Proveedor" : "Nuevo Proveedor"}>
      <form onSubmit={handleSubmit} className="lead-form" style={{ display: "grid", gap: "12px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <label style={fieldStyle}>
            Nombre Comercial *
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ej. Finca Tamaragua" />
          </label>
          <label style={fieldStyle}>
            Categoría *
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <label style={fieldStyle}>
            Zona / Ubicación *
            <select value={zoneId} onChange={(e) => handleZoneChange(e.target.value)} required>
              {zonas.map((z) => (
                <option key={z.id} value={z.id}>{z.label} ({z.comunidad})</option>
              ))}
            </select>
          </label>
          <label style={fieldStyle}>
            Capacidad Máxima (invitados)
            <input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} min={0} />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <label style={fieldStyle}>
            Teléfono de Contacto
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ej. +34 600 000 000" />
          </label>
          <label style={fieldStyle}>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ej. info@proveedor.com" />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <label style={fieldStyle}>
            Web / Instagram URL
            <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Ej. https://proveedor.com" />
          </label>
          <label style={fieldStyle}>
            Estilo / Etiquetas (separadas por comas)
            <input value={styleTagsInput} onChange={(e) => setStyleTagsInput(e.target.value)} placeholder="Ej. rústico, exterior, moderno" />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          <label style={fieldStyle}>
            Puntuación (1-10)
            <input type="number" value={qualityScore} onChange={(e) => setQualityScore(Number(e.target.value))} min={1} max={10} />
          </label>
          <label style={fieldStyle}>
            Fiabilidad (1-10)
            <input type="number" value={reliability} onChange={(e) => setReliability(Number(e.target.value))} min={1} max={10} />
          </label>
          <label style={fieldStyle}>
            Exp. Previa (Bodas)
            <input type="number" value={previousExperience} onChange={(e) => setPreviousExperience(Number(e.target.value))} min={0} />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <label style={fieldStyle}>
            Latitud GPS (Mapa)
            <input type="number" step="any" value={lat || ""} onChange={(e) => setLat(Number(e.target.value) || undefined)} />
          </label>
          <label style={fieldStyle}>
            Longitud GPS (Mapa)
            <input type="number" step="any" value={lng || ""} onChange={(e) => setLng(Number(e.target.value) || undefined)} />
          </label>
        </div>

        <label className="check-row" style={{ flexDirection: "row", gap: "10px", alignItems: "center", textTransform: "none" }}>
          <input type="checkbox" checked={commissionFree} onChange={(e) => setCommissionFree(e.target.checked)} />
          <span>Proveedor libre de comisión externa</span>
        </label>

        <label style={fieldStyle}>
          Notas internas y valoración
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Introduce notas privadas sobre su servicio, puntualidad, incidencias..."
            style={{
              width: "100%",
              minHeight: "80px",
              padding: "8px 10px",
              border: "1px solid var(--line)",
              borderRadius: "8px",
              fontFamily: "inherit",
              resize: "vertical"
            }}
          />
        </label>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
          <button className="secondary-button" type="button" onClick={onClose}>Cancelar</button>
          <button className="primary-button" type="submit">Guardar</button>
        </div>
      </form>
    </Modal>
  );
}
