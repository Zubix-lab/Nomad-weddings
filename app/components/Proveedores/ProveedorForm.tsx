"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "../UI/Modal";
import type { Vendor, VendorAvailabilityType, VendorPriceConfidence, VendorStatus } from "@/lib/types";
import { categorias } from "@/lib/categorias";
import { zonas } from "@/lib/zonas";
import { priceConfidenceLabels, vendorAvailabilityLabels, vendorStatusLabels } from "@/lib/vendor-profile";

interface ProveedorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vendor: Omit<Vendor, "id"> & { id?: string }) => void;
  vendor?: Vendor;
}

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ProveedorForm({ isOpen, onClose, onSave, vendor }: ProveedorFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categorias[0].id);
  const [zoneId, setZoneId] = useState(zonas[0].id);
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [contactUrl, setContactUrl] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [capacity, setCapacity] = useState(100);
  const [status, setStatus] = useState<VendorStatus>("draft");
  const [lastCheckedAt, setLastCheckedAt] = useState("2026-07-02");
  const [availabilityType, setAvailabilityType] = useState<VendorAvailabilityType>("local");
  const [priceFrom, setPriceFrom] = useState<number | "">("");
  const [priceRange, setPriceRange] = useState("");
  const [priceConfidence, setPriceConfidence] = useState<VendorPriceConfidence>("baja");
  const [languagesInput, setLanguagesInput] = useState("castellano");
  const [packagesInput, setPackagesInput] = useState("");
  const [reliability, setReliability] = useState(8);
  const [qualityScore, setQualityScore] = useState(8);
  const [responseTimeHours, setResponseTimeHours] = useState(12);
  const [previousExperience, setPreviousExperience] = useState(3);
  const [commissionFree, setCommissionFree] = useState(true);
  const [styleTagsInput, setStyleTagsInput] = useState("");
  const [reviewsSummary, setReviewsSummary] = useState("");
  const [notes, setNotes] = useState("");
  const [notesInternal, setNotesInternal] = useState("");
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [googlePlaceId, setGooglePlaceId] = useState("");

  useEffect(() => {
    if (vendor) {
      setName(vendor.name);
      setCategory(vendor.category);
      setPhone(vendor.phone);
      setEmail(vendor.email);
      setWebsite(vendor.website);
      setContactUrl(vendor.contactUrl || "");
      setSourceUrl(vendor.sourceUrl || "");
      setInstagramUrl(vendor.instagramUrl || "");
      setGoogleMapsUrl(vendor.googleMapsUrl || "");
      setCapacity(vendor.capacity);
      setProvince(vendor.province || "");
      setCity(vendor.city || "");
      setServiceArea(vendor.serviceArea || "");
      setStatus(vendor.status || "draft");
      setLastCheckedAt(vendor.lastCheckedAt || "2026-07-02");
      setAvailabilityType(vendor.availabilityType || "local");
      setPriceFrom(vendor.priceFrom || "");
      setPriceRange(vendor.priceRange || "");
      setPriceConfidence(vendor.priceConfidence || "baja");
      setLanguagesInput((vendor.languages || ["castellano"]).join(", "));
      setPackagesInput((vendor.packages || []).map((item) => item.name).join(", "));
      setReliability(vendor.reliability);
      setQualityScore(vendor.qualityScore);
      setResponseTimeHours(vendor.responseTimeHours);
      setPreviousExperience(vendor.previousExperience);
      setCommissionFree(vendor.commissionFree);
      setStyleTagsInput(vendor.styleTags.join(", "));
      setReviewsSummary(vendor.reviewsSummary || "");
      setNotes(vendor.notes);
      setNotesInternal(vendor.notesInternal || "");
      setLat(vendor.lat);
      setLng(vendor.lng);
      setGooglePlaceId(vendor.googlePlaceId || "");

      const matchedZone = zonas.find((zone) => zone.label === vendor.region || zone.provincia === vendor.region || zone.provincia === vendor.province);
      if (matchedZone) setZoneId(matchedZone.id);
    } else {
      const defaultZone = zonas[0];
      setName("");
      setCategory(categorias[0].id);
      setZoneId(defaultZone.id);
      setProvince(defaultZone.provincia);
      setCity("");
      setServiceArea(defaultZone.label);
      setPhone("");
      setEmail("");
      setWebsite("");
      setContactUrl("");
      setSourceUrl("");
      setInstagramUrl("");
      setGoogleMapsUrl("");
      setCapacity(100);
      setStatus("draft");
      setLastCheckedAt("2026-07-02");
      setAvailabilityType("local");
      setPriceFrom("");
      setPriceRange("");
      setPriceConfidence("baja");
      setLanguagesInput("castellano");
      setPackagesInput("");
      setReliability(8);
      setQualityScore(8);
      setResponseTimeHours(12);
      setPreviousExperience(3);
      setCommissionFree(true);
      setStyleTagsInput("");
      setReviewsSummary("");
      setNotes("");
      setNotesInternal("");
      setGooglePlaceId("");
      setLat(defaultZone.center.lat);
      setLng(defaultZone.center.lng);
    }
  }, [vendor, isOpen]);

  const handleZoneChange = (id: string) => {
    setZoneId(id);
    const selectedZone = zonas.find((zone) => zone.id === id);
    if (selectedZone) {
      setProvince(selectedZone.provincia);
      setServiceArea(selectedZone.label);
      setLat(selectedZone.center.lat);
      setLng(selectedZone.center.lng);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const selectedZone = zonas.find((zone) => zone.id === zoneId);
    const region = selectedZone ? selectedZone.label : "País Vasco";
    const styleTags = splitList(styleTagsInput);
    const languages = splitList(languagesInput);
    const packages = splitList(packagesInput).map((packageName) => ({ name: packageName }));

    onSave({
      id: vendor?.id,
      name,
      category,
      region,
      province: province.trim() || selectedZone?.provincia,
      city: city.trim() || undefined,
      serviceArea: serviceArea.trim() || region,
      phone,
      email,
      website,
      contactUrl: contactUrl.trim() || undefined,
      sourceUrl: sourceUrl.trim() || undefined,
      instagramUrl: instagramUrl.trim() || undefined,
      googleMapsUrl: googleMapsUrl.trim() || undefined,
      capacity: Number(capacity),
      status,
      lastCheckedAt,
      availabilityType,
      priceFrom: priceFrom === "" ? undefined : Number(priceFrom),
      priceRange: priceRange.trim() || undefined,
      priceConfidence,
      languages,
      packages,
      reliability: Number(reliability),
      qualityScore: Number(qualityScore),
      responseTimeHours: Number(responseTimeHours),
      previousExperience: Number(previousExperience),
      commissionFree,
      styleTags,
      reviewsSummary: reviewsSummary.trim() || undefined,
      notes,
      notesInternal: notesInternal.trim() || undefined,
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined,
      googlePlaceId: googlePlaceId.trim() || undefined,
      images: vendor?.images
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
            Nombre comercial *
            <input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Ej. Finca Tamaragua" />
          </label>
          <label style={fieldStyle}>
            Categoría *
            <select value={category} onChange={(event) => setCategory(event.target.value)} required>
              {categorias.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
          <label style={fieldStyle}>
            Zona *
            <select value={zoneId} onChange={(event) => handleZoneChange(event.target.value)} required>
              {zonas.map((zone) => (
                <option key={zone.id} value={zone.id}>{zone.label} ({zone.comunidad})</option>
              ))}
            </select>
          </label>
          <label style={fieldStyle}>
            Provincia
            <input value={province} onChange={(event) => setProvince(event.target.value)} placeholder="Ej. Bizkaia" />
          </label>
          <label style={fieldStyle}>
            Ciudad
            <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Ej. Bilbao" />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <label style={fieldStyle}>
            Área de servicio
            <input value={serviceArea} onChange={(event) => setServiceArea(event.target.value)} placeholder="Ej. País Vasco, Navarra y Rioja" />
          </label>
          <label style={fieldStyle}>
            Disponibilidad
            <select value={availabilityType} onChange={(event) => setAvailabilityType(event.target.value as VendorAvailabilityType)}>
              {(Object.keys(vendorAvailabilityLabels) as VendorAvailabilityType[]).map((availability) => (
                <option key={availability} value={availability}>{vendorAvailabilityLabels[availability]}</option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <label style={fieldStyle}>
            Teléfono
            <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Ej. +34 600 000 000" />
          </label>
          <label style={fieldStyle}>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Ej. info@proveedor.com" />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <label style={fieldStyle}>
            Web oficial
            <input value={website} onChange={(event) => setWebsite(event.target.value)} placeholder="https://proveedor.com" />
          </label>
          <label style={fieldStyle}>
            Instagram
            <input value={instagramUrl} onChange={(event) => setInstagramUrl(event.target.value)} placeholder="https://instagram.com/..." />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <label style={fieldStyle}>
            URL de contacto / presupuesto
            <input value={contactUrl} onChange={(event) => setContactUrl(event.target.value)} placeholder="Formulario, WhatsApp o email público" />
          </label>
          <label style={fieldStyle}>
            URL fuente
            <input value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="Directorio, web o fuente pública" />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          <label style={fieldStyle}>
            Estado
            <select value={status} onChange={(event) => setStatus(event.target.value as VendorStatus)}>
              {(Object.keys(vendorStatusLabels) as VendorStatus[]).map((item) => (
                <option key={item} value={item}>{vendorStatusLabels[item]}</option>
              ))}
            </select>
          </label>
          <label style={fieldStyle}>
            Última revisión
            <input type="date" value={lastCheckedAt} onChange={(event) => setLastCheckedAt(event.target.value)} />
          </label>
          <label style={fieldStyle}>
            Confianza precio
            <select value={priceConfidence} onChange={(event) => setPriceConfidence(event.target.value as VendorPriceConfidence)}>
              {(Object.keys(priceConfidenceLabels) as VendorPriceConfidence[]).map((item) => (
                <option key={item} value={item}>{priceConfidenceLabels[item]}</option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          <label style={fieldStyle}>
            Precio desde
            <input type="number" value={priceFrom} onChange={(event) => setPriceFrom(event.target.value === "" ? "" : Number(event.target.value))} min={0} />
          </label>
          <label style={fieldStyle}>
            Rango visible
            <input value={priceRange} onChange={(event) => setPriceRange(event.target.value)} placeholder="Ej. 1.200-2.500 €" />
          </label>
          <label style={fieldStyle}>
            Capacidad máxima
            <input type="number" value={capacity} onChange={(event) => setCapacity(Number(event.target.value))} min={0} />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          <label style={fieldStyle}>
            Puntuación (1-10)
            <input type="number" value={qualityScore} onChange={(event) => setQualityScore(Number(event.target.value))} min={1} max={10} />
          </label>
          <label style={fieldStyle}>
            Fiabilidad (1-10)
            <input type="number" value={reliability} onChange={(event) => setReliability(Number(event.target.value))} min={1} max={10} />
          </label>
          <label style={fieldStyle}>
            Respuesta estimada (h)
            <input type="number" value={responseTimeHours} onChange={(event) => setResponseTimeHours(Number(event.target.value))} min={0} />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <label style={fieldStyle}>
            Estilos / etiquetas
            <input value={styleTagsInput} onChange={(event) => setStyleTagsInput(event.target.value)} placeholder="editorial, natural, lujo" />
          </label>
          <label style={fieldStyle}>
            Idiomas
            <input value={languagesInput} onChange={(event) => setLanguagesInput(event.target.value)} placeholder="castellano, euskera, inglés" />
          </label>
        </div>

        <div>
          <label style={fieldStyle}>
            Packs
            <input value={packagesInput} onChange={(event) => setPackagesInput(event.target.value)} placeholder="basico, estandar, premium" />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <label style={fieldStyle}>
            Latitud GPS
            <input type="number" step="any" value={lat || ""} onChange={(event) => setLat(Number(event.target.value) || undefined)} />
          </label>
          <label style={fieldStyle}>
            Longitud GPS
            <input type="number" step="any" value={lng || ""} onChange={(event) => setLng(Number(event.target.value) || undefined)} />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <label style={fieldStyle}>
            Google Place ID
            <input value={googlePlaceId} onChange={(event) => setGooglePlaceId(event.target.value)} placeholder="Ej. ChIJ..." />
          </label>
          <label style={fieldStyle}>
            Google Maps URL
            <input value={googleMapsUrl} onChange={(event) => setGoogleMapsUrl(event.target.value)} placeholder="https://maps.google.com/..." />
          </label>
        </div>

        <label className="check-row" style={{ flexDirection: "row", gap: "10px", alignItems: "center", textTransform: "none" }}>
          <input type="checkbox" checked={commissionFree} onChange={(event) => setCommissionFree(event.target.checked)} />
          <span>Proveedor libre de comisión externa</span>
        </label>

        <label style={fieldStyle}>
          Descripción pública breve
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Resumen corto, comparable y sin copiar textos largos de directorios."
            style={{ width: "100%", minHeight: "72px", padding: "8px 10px", border: "1px solid var(--line)", borderRadius: "8px", fontFamily: "inherit", resize: "vertical" }}
          />
        </label>

        <label style={fieldStyle}>
          Resumen de reseñas
          <textarea
            value={reviewsSummary}
            onChange={(event) => setReviewsSummary(event.target.value)}
            placeholder="Síntesis propia: puntos fuertes, riesgos y señales de confianza."
            style={{ width: "100%", minHeight: "60px", padding: "8px 10px", border: "1px solid var(--line)", borderRadius: "8px", fontFamily: "inherit", resize: "vertical" }}
          />
        </label>

        <label style={fieldStyle}>
          Notas internas
          <textarea
            value={notesInternal}
            onChange={(event) => setNotesInternal(event.target.value)}
            placeholder="Validación humana, incidencias, llamadas, dudas legales o de precio."
            style={{ width: "100%", minHeight: "70px", padding: "8px 10px", border: "1px solid var(--line)", borderRadius: "8px", fontFamily: "inherit", resize: "vertical" }}
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
