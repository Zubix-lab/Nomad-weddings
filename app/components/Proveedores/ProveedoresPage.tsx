"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { CheckCircle2, Globe, Grid, ImageIcon, List, Mail, Map, MapPin, Phone, Plus, Search, Star, StickyNote } from "lucide-react";
import { categorias } from "@/lib/categorias";
import { zonas } from "@/lib/zonas";
import { ProveedorDetail } from "./ProveedorDetail";
import { ProveedorForm } from "./ProveedorForm";
import { MapaProveedores } from "./MapaProveedores";
import type { Vendor, VendorAvailabilityType, VendorPriceConfidence, VendorStatus } from "@/lib/types";
import {
  getVendorAvailability,
  getVendorMapsUrl,
  getVendorPriceConfidence,
  getVendorPriceFrom,
  getVendorPriceRange,
  getVendorPrimaryImage,
  getVendorProvince,
  getVendorQualityBadges,
  getVendorSourceUrl,
  getVendorStatus,
  hasVendorActionableContact,
  hasVendorImage,
  isVendorOutdated,
  priceConfidenceLabels,
  vendorAvailabilityLabels,
  vendorStatusLabels
} from "@/lib/vendor-profile";

const TARGETS = {
  total: 1000,
  verified: 100,
  priceConfirmed: 50
};

function VendorCardImage({ vendor, imageUrl, priority }: { vendor: Vendor; imageUrl: string; priority?: boolean }) {
  const [hasFailed, setHasFailed] = useState(false);

  return (
    <div className="vendor-card-media">
      {imageUrl && !hasFailed ? (
        <Image
          src={imageUrl}
          alt={`${vendor.name} imagen real`}
          fill
          unoptimized
          priority={priority}
          sizes="(max-width: 768px) 100vw, 360px"
          style={{ objectFit: "cover" }}
          onError={() => setHasFailed(true)}
        />
      ) : (
        <div className="vendor-image-placeholder">
          <ImageIcon size={22} />
          <span>Imagen pendiente</span>
        </div>
      )}
    </div>
  );
}

export default function ProveedoresPage() {
  const { vendors, vendorPrices, addVendor, updateVendor, deleteVendor, uploadVendorImages, persistenceMode, persistenceStatus, persistenceError } = useApp();

  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [selectedRegion, setSelectedRegion] = useState("todas");
  const [selectedProvince, setSelectedProvince] = useState("todas");
  const [selectedStyle, setSelectedStyle] = useState("todos");
  const [selectedStatus, setSelectedStatus] = useState<"todos" | VendorStatus>("todos");
  const [selectedAvailability, setSelectedAvailability] = useState<"todas" | VendorAvailabilityType>("todas");
  const [selectedPriceConfidence, setSelectedPriceConfidence] = useState<"todas" | VendorPriceConfidence>("todas");
  const [maxBudget, setMaxBudget] = useState(0);
  const [minQuality, setMinQuality] = useState(0);

  const [activeVendor, setActiveVendor] = useState<Vendor | undefined>(undefined);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editVendor, setEditVendor] = useState<Vendor | undefined>(undefined);
  const [uploadStatus, setUploadStatus] = useState("");

  const provinceOptions = useMemo(
    () => Array.from(new Set(vendors.map(getVendorProvince))).sort((a, b) => a.localeCompare(b, "es")),
    [vendors]
  );

  const styleOptions = useMemo(
    () => Array.from(new Set(vendors.flatMap((vendor) => vendor.styleTags))).sort((a, b) => a.localeCompare(b, "es")),
    [vendors]
  );

  const basqueVendors = useMemo(
    () => vendors.filter((vendor) => ["Gipuzkoa", "Bizkaia", "Alava", "Álava"].includes(getVendorProvince(vendor))),
    [vendors]
  );

  const reviewedCount = useMemo(
    () => vendors.filter((vendor) => ["reviewed", "verified"].includes(getVendorStatus(vendor))).length,
    [vendors]
  );

  const verifiedCount = useMemo(
    () => vendors.filter((vendor) => getVendorStatus(vendor) === "verified").length,
    [vendors]
  );

  const confirmedPriceCount = useMemo(
    () => vendors.filter((vendor) => getVendorPriceConfidence(vendor, vendorPrices) === "alta").length,
    [vendors, vendorPrices]
  );

  const outdatedCount = useMemo(
    () => vendors.filter((vendor) => isVendorOutdated(vendor)).length,
    [vendors]
  );

  const imageCount = useMemo(
    () => vendors.filter((vendor) => hasVendorImage(vendor)).length,
    [vendors]
  );

  const contactableCount = useMemo(
    () => vendors.filter((vendor) => hasVendorActionableContact(vendor)).length,
    [vendors]
  );

  const internalNoteCount = useMemo(
    () => vendors.filter((vendor) => Boolean(vendor.notesInternal?.trim())).length,
    [vendors]
  );

  const filteredVendors = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return vendors.filter((vendor) => {
      const province = getVendorProvince(vendor);
      const sourceUrl = getVendorSourceUrl(vendor);
      const priceFrom = getVendorPriceFrom(vendor, vendorPrices);
      const status = getVendorStatus(vendor);
      const availability = getVendorAvailability(vendor);
      const priceConfidence = getVendorPriceConfidence(vendor, vendorPrices);
      const languages = vendor.languages || [];

      const matchesSearch =
        normalizedSearch.length === 0 ||
        vendor.name.toLowerCase().includes(normalizedSearch) ||
        (vendor.city || "").toLowerCase().includes(normalizedSearch) ||
        province.toLowerCase().includes(normalizedSearch) ||
        sourceUrl.toLowerCase().includes(normalizedSearch) ||
        vendor.styleTags.some((tag) => tag.toLowerCase().includes(normalizedSearch)) ||
        languages.some((language) => language.toLowerCase().includes(normalizedSearch)) ||
        vendor.notes.toLowerCase().includes(normalizedSearch);

      const matchesCategory = selectedCategory === "todas" || vendor.category === selectedCategory;
      const matchesRegion = selectedRegion === "todas" || vendor.region === selectedRegion;
      const matchesProvince = selectedProvince === "todas" || province === selectedProvince;
      const matchesStyle = selectedStyle === "todos" || vendor.styleTags.includes(selectedStyle);
      const matchesStatus = selectedStatus === "todos" || status === selectedStatus;
      const matchesAvailability = selectedAvailability === "todas" || availability === selectedAvailability;
      const matchesPriceConfidence = selectedPriceConfidence === "todas" || priceConfidence === selectedPriceConfidence;
      const matchesBudget = maxBudget === 0 || (typeof priceFrom === "number" && priceFrom <= maxBudget);
      const matchesQuality = vendor.qualityScore >= minQuality;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesRegion &&
        matchesProvince &&
        matchesStyle &&
        matchesStatus &&
        matchesAvailability &&
        matchesPriceConfidence &&
        matchesBudget &&
        matchesQuality
      );
    });
  }, [
    vendors,
    vendorPrices,
    searchTerm,
    selectedCategory,
    selectedRegion,
    selectedProvince,
    selectedStyle,
    selectedStatus,
    selectedAvailability,
    selectedPriceConfidence,
    maxBudget,
    minQuality
  ]);

  const mapCenter = useMemo(() => {
    if (selectedRegion !== "todas") {
      const matchedZone = zonas.find((z) => z.label === selectedRegion);
      if (matchedZone) return matchedZone.center;
    }
    return { lat: 43.1853, lng: -2.0928 };
  }, [selectedRegion]);

  const handleSaveVendor = (vendorData: Omit<Vendor, "id"> & { id?: string }, imageFiles: File[]) => {
    const vendorId = vendorData.id || addVendor(vendorData);
    if (vendorData.id) {
      updateVendor(vendorData as Vendor);
    }

    if (imageFiles.length > 0) {
      setUploadStatus("Subiendo imagenes a Firebase Storage...");
      uploadVendorImages(vendorId, imageFiles)
        .then((urls) => setUploadStatus(`${urls.length} imagenes subidas y vinculadas al proveedor.`))
        .catch((error) => setUploadStatus(error instanceof Error ? error.message : "No se pudieron subir las imagenes."))
        .finally(() => window.setTimeout(() => setUploadStatus(""), 5000));
    }
  };

  const openVendor = (vendor: Vendor) => {
    setActiveVendor(vendor);
    setIsDetailOpen(true);
  };

  const handleEditClick = (vendor: Vendor) => {
    setEditVendor(vendor);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  const handleUpdateVendor = (vendor: Vendor) => {
    updateVendor(vendor);
    setActiveVendor(vendor);
  };

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "12px" }}>
        {[
          { label: "Base total", value: vendors.length, note: `${basqueVendors.length}/${TARGETS.total} objetivo Pais Vasco` },
          { label: "Revisadas", value: reviewedCount, note: `${verifiedCount}/${TARGETS.verified} verificadas` },
          { label: "Con imagen", value: imageCount, note: `${vendors.length - imageCount} pendientes` },
          { label: "Contactables", value: contactableCount, note: "web, maps, telefono o email" },
          { label: "Notas internas", value: internalNoteCount, note: "editables por usuario" },
          { label: "Precio confirmado", value: confirmedPriceCount, note: `${TARGETS.priceConfirmed} objetivo inicial` },
          { label: "A revisar", value: outdatedCount, note: "mensual/trimestral" }
        ].map((item) => (
          <div key={item.label} className="panel" style={{ padding: "14px" }}>
            <p className="eyebrow" style={{ margin: 0 }}>{item.label}</p>
            <strong style={{ display: "block", fontSize: "28px", color: "var(--primary)", marginTop: "5px" }}>{item.value}</strong>
            <span style={{ color: "var(--slate-grey)", fontSize: "12px" }}>{item.note}</span>
          </div>
        ))}
      </section>

      <div className="vendor-filter-panel">
        <div className={persistenceMode === "firestore" ? "data-source-banner connected" : "data-source-banner"}>
          <strong>{persistenceMode === "firestore" ? "Firestore conectado" : "Modo local sin Firebase"}</strong>
          <span>
            {persistenceMode === "firestore"
              ? persistenceStatus === "ready"
                ? "Datos sincronizados en tiempo real."
                : persistenceStatus === "connecting"
                  ? "Conectando con Firestore..."
                  : persistenceError || "Firestore ha devuelto un error."
              : "Configura NEXT_PUBLIC_FIREBASE_* para usar la base oficial."}
          </span>
        </div>
        {uploadStatus && <div className="data-source-banner connected"><strong>Imagenes</strong><span>{uploadStatus}</span></div>}

        <div className="vendor-search-row">
          <div className="vendor-search-box">
            <input
              type="text"
              placeholder="Buscar por nombre, ciudad, estilo, idioma, fuente..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              style={{ paddingLeft: "36px" }}
              aria-label="Buscar proveedor"
            />
            <Search size={18} style={{ position: "absolute", left: "12px", top: "11px", color: "var(--slate-grey)" }} />
          </div>

          <div className="vendor-view-toggle">
            {([
              ["grid", Grid, "Vista cuadrícula"],
              ["list", List, "Vista lista"],
              ["map", Map, "Vista mapa"]
            ] as const).map(([mode, Icon, title]) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`mini-button ${viewMode === mode ? "active" : ""}`}
                style={{
                  border: 0,
                  background: viewMode === mode ? "var(--primary)" : "transparent",
                  color: viewMode === mode ? "white" : "var(--ink)",
                  borderRadius: 0,
                  margin: 0
                }}
                title={title}
                aria-label={title}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>

          <button
            className="primary-button"
            onClick={() => {
              setEditVendor(undefined);
              setIsFormOpen(true);
            }}
            style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}
          >
            <Plus size={16} /> Nuevo Proveedor
          </button>
        </div>

        <div className="vendor-filter-row">
          <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} aria-label="Filtrar por categoría" style={{ width: "160px" }}>
            <option value="todas">Todas las categorías</option>
            {categorias.map((category) => (
              <option key={category.id} value={category.id}>{category.label}</option>
            ))}
          </select>

          <select value={selectedProvince} onChange={(event) => setSelectedProvince(event.target.value)} aria-label="Filtrar por provincia" style={{ width: "150px" }}>
            <option value="todas">Todas las provincias</option>
            {provinceOptions.map((province) => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>

          <select value={selectedRegion} onChange={(event) => setSelectedRegion(event.target.value)} aria-label="Filtrar por región" style={{ width: "145px" }}>
            <option value="todas">Todas las regiones</option>
            {Array.from(new Set(zonas.map((zone) => zone.label))).map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>

          <select value={selectedStyle} onChange={(event) => setSelectedStyle(event.target.value)} aria-label="Filtrar por estilo" style={{ width: "145px" }}>
            <option value="todos">Todos los estilos</option>
            {styleOptions.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>

          <select value={minQuality} onChange={(event) => setMinQuality(Number(event.target.value))} aria-label="Puntuación mínima" style={{ width: "130px" }}>
            <option value={0}>Cualquier Cal.</option>
            <option value={8}>Calidad 8+</option>
            <option value={9}>Calidad 9+</option>
          </select>

          <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value as "todos" | VendorStatus)} aria-label="Estado de revisión" style={{ width: "145px" }}>
            <option value="todos">Cualquier estado</option>
            {(Object.keys(vendorStatusLabels) as VendorStatus[]).map((status) => (
              <option key={status} value={status}>{vendorStatusLabels[status]}</option>
            ))}
          </select>

          <select value={selectedAvailability} onChange={(event) => setSelectedAvailability(event.target.value as "todas" | VendorAvailabilityType)} aria-label="Disponibilidad" style={{ width: "140px" }}>
            <option value="todas">Disponibilidad</option>
            {(Object.keys(vendorAvailabilityLabels) as VendorAvailabilityType[]).map((availability) => (
              <option key={availability} value={availability}>{vendorAvailabilityLabels[availability]}</option>
            ))}
          </select>

          <select value={selectedPriceConfidence} onChange={(event) => setSelectedPriceConfidence(event.target.value as "todas" | VendorPriceConfidence)} aria-label="Confianza de precio" style={{ width: "155px" }}>
            <option value="todas">Cualquier precio</option>
            {(Object.keys(priceConfidenceLabels) as VendorPriceConfidence[]).map((confidence) => (
              <option key={confidence} value={confidence}>{priceConfidenceLabels[confidence]}</option>
            ))}
          </select>

          <select value={maxBudget} onChange={(event) => setMaxBudget(Number(event.target.value))} aria-label="Presupuesto máximo desde" style={{ width: "145px" }}>
            <option value={0}>Sin límite €</option>
            <option value={1000}>Hasta 1.000 €</option>
            <option value={2500}>Hasta 2.500 €</option>
            <option value={5000}>Hasta 5.000 €</option>
            <option value={10000}>Hasta 10.000 €</option>
          </select>
        </div>
      </div>

      {filteredVendors.length === 0 ? (
        <div className="empty-state">No se encontraron proveedores con los filtros actuales.</div>
      ) : viewMode === "map" ? (
        <div style={{ height: "550px", border: "1px solid var(--line)", borderRadius: "8px", overflow: "hidden" }}>
          <MapaProveedores
            vendors={filteredVendors.filter((vendor) => vendor.lat && vendor.lng)}
            center={mapCenter}
            zoom={selectedRegion !== "todas" ? 10 : 7}
            onSelectVendor={(id) => {
              const vendor = vendors.find((item) => item.id === id);
              if (vendor) openVendor(vendor);
            }}
          />
        </div>
      ) : viewMode === "list" ? (
        <div className="panel full" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Proveedor</th>
                  <th>Categoría</th>
                  <th>Provincia</th>
                  <th>Estado</th>
                  <th>Precio desde</th>
                  <th>Calidad</th>
                  <th>Fuente</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor) => {
                  const category = categorias.find((item) => item.id === vendor.category);
                  return (
                    <tr key={vendor.id} onClick={() => openVendor(vendor)} style={{ cursor: "pointer" }}>
                      <td style={{ fontWeight: "bold" }}>{vendor.name}</td>
                      <td><span className="pill" style={{ fontSize: "11px" }}>{category?.label || vendor.category}</span></td>
                      <td>{getVendorProvince(vendor)}</td>
                      <td>{vendorStatusLabels[getVendorStatus(vendor)]}</td>
                      <td>{getVendorPriceRange(vendor, vendorPrices)}</td>
                      <td>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <Star size={12} fill="var(--soft-apricot)" color="var(--soft-apricot)" /> {vendor.qualityScore}/10
                        </div>
                      </td>
                      <td>{getVendorSourceUrl(vendor) ? "Trazada" : "Pendiente"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="vendor-grid">
          {filteredVendors.map((vendor, index) => {
            const category = categorias.find((item) => item.id === vendor.category);
            const status = getVendorStatus(vendor);
            const badges = getVendorQualityBadges(vendor, vendorPrices)
              .filter((badge) => badge !== vendorStatusLabels[status])
              .slice(0, 3);
            const primaryImage = getVendorPrimaryImage(vendor);
            const mapsUrl = getVendorMapsUrl(vendor);

            return (
              <article key={vendor.id} className="vendor-card" onClick={() => openVendor(vendor)} style={{ cursor: "pointer", transition: "all 0.2s" }}>
                <VendorCardImage vendor={vendor} imageUrl={primaryImage} priority={index < 3} />

                <div>
                  <p className="eyebrow">{category?.label || vendor.category} · {getVendorProvince(vendor)}{vendor.city ? ` · ${vendor.city}` : ""}</p>
                  <h3 style={{ margin: "4px 0" }}>{vendor.name}</h3>
                  <p style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontSize: "12px", height: "35px" }}>
                    {vendor.notes || "Sin descripción."}
                  </p>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  <span className="pill" style={{ fontSize: "10px", padding: "2px 6px" }}>
                    <CheckCircle2 size={10} /> {vendorStatusLabels[status]}
                  </span>
                  {badges.map((badge) => (
                    <span key={badge} className="pill" style={{ fontSize: "10px", padding: "2px 6px" }}>{badge}</span>
                  ))}
                </div>

                <div className="vendor-card-contact-row" onClick={(event) => event.stopPropagation()}>
                  {vendor.website && (
                    <a href={vendor.website} target="_blank" rel="noreferrer" title="Abrir web" aria-label={`Abrir web de ${vendor.name}`}>
                      <Globe size={14} />
                    </a>
                  )}
                  {mapsUrl && (
                    <a href={mapsUrl} target="_blank" rel="noreferrer" title="Abrir Google Maps" aria-label={`Abrir Google Maps de ${vendor.name}`}>
                      <MapPin size={14} />
                    </a>
                  )}
                  {vendor.phone && (
                    <a href={`tel:${vendor.phone}`} title="Llamar" aria-label={`Llamar a ${vendor.name}`}>
                      <Phone size={14} />
                    </a>
                  )}
                  {vendor.email && (
                    <a href={`mailto:${vendor.email}`} title="Enviar email" aria-label={`Enviar email a ${vendor.name}`}>
                      <Mail size={14} />
                    </a>
                  )}
                  {vendor.notesInternal && (
                    <span className="vendor-card-note" title="Tiene nota interna">
                      <StickyNote size={14} />
                    </span>
                  )}
                </div>

                <div className="vendor-stats">
                  <span>Cap. {vendor.capacity || "N/A"}</span>
                  <span>Cal. {vendor.qualityScore}/10</span>
                  <span>{getVendorPriceRange(vendor, vendorPrices)}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ProveedorDetail
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        vendor={activeVendor}
        prices={vendorPrices.filter((price) => price.vendorId === activeVendor?.id)}
        onEdit={handleEditClick}
        onUpdate={handleUpdateVendor}
        onDelete={deleteVendor}
      />

      <ProveedorForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditVendor(undefined);
        }}
        onSave={handleSaveVendor}
        vendor={editVendor}
      />
    </div>
  );
}
