"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { Plus, Search, Map, List, Grid, Star } from "lucide-react";
import { categorias } from "@/lib/categorias";
import { zonas } from "@/lib/zonas";
import { ProveedorDetail } from "./ProveedorDetail";
import { ProveedorForm } from "./ProveedorForm";
import { MapaProveedores } from "./MapaProveedores";
import type { Vendor } from "@/lib/types";

export default function ProveedoresPage() {
  const { vendors, vendorPrices, addVendor, updateVendor, deleteVendor } = useApp();
  
  // States
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [selectedRegion, setSelectedRegion] = useState("todas");
  const [minQuality, setMinQuality] = useState(0);
  
  // Details/Form Modals
  const [activeVendor, setActiveVendor] = useState<Vendor | undefined>(undefined);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editVendor, setEditVendor] = useState<Vendor | undefined>(undefined);

  // Filters logic
  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            vendor.styleTags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            vendor.notes.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "todas" || vendor.category === selectedCategory;
      const matchesRegion = selectedRegion === "todas" || vendor.region === selectedRegion;
      const matchesQuality = vendor.qualityScore >= minQuality;
      return matchesSearch && matchesCategory && matchesRegion && matchesQuality;
    });
  }, [vendors, searchTerm, selectedCategory, selectedRegion, minQuality]);

  // Map center logic (based on filtered region or default to Guipúzcoa)
  const mapCenter = useMemo(() => {
    if (selectedRegion !== "todas") {
      const matchedZone = zonas.find((z) => z.label === selectedRegion);
      if (matchedZone) return matchedZone.center;
    }
    return { lat: 43.1853, lng: -2.0928 }; // Guipúzcoa center
  }, [selectedRegion]);

  const handleSaveVendor = (vendorData: Omit<Vendor, "id"> & { id?: string }) => {
    if (vendorData.id) {
      updateVendor(vendorData as Vendor);
    } else {
      addVendor(vendorData);
    }
  };

  const handleEditClick = (vendor: Vendor) => {
    setEditVendor(vendor);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      {/* Toolbar / Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "10px", background: "var(--pure-white)", padding: "16px", borderRadius: "8px", border: "1px solid var(--line)" }}>
        <div style={{ display: "flex", flex: 1, minWidth: "260px", gap: "8px", position: "relative" }}>
          <input
            type="text"
            placeholder="Buscar por nombre, etiquetas, notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "36px" }}
            aria-label="Buscar proveedor"
          />
          <Search size={18} style={{ position: "absolute", left: "12px", top: "11px", color: "var(--slate-grey)" }} />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filtrar por categoría"
            style={{ width: "160px" }}
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            aria-label="Filtrar por región"
            style={{ width: "160px" }}
          >
            <option value="todas">Todas las regiones</option>
            {Array.from(new Set(zonas.map((z) => z.label))).map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>

          <select
            value={minQuality}
            onChange={(e) => setMinQuality(Number(e.target.value))}
            aria-label="Puntuación mínima"
            style={{ width: "130px" }}
          >
            <option value={0}>Cualquier Cal.</option>
            <option value={8}>Calidad 8+</option>
            <option value={9}>Calidad 9+</option>
          </select>

          {/* View Toggles */}
          <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: "8px", overflow: "hidden" }}>
            <button
              onClick={() => setViewMode("grid")}
              className={`mini-button ${viewMode === "grid" ? "active" : ""}`}
              style={{
                border: 0,
                background: viewMode === "grid" ? "var(--primary)" : "transparent",
                color: viewMode === "grid" ? "white" : "var(--ink)",
                borderRadius: 0,
                margin: 0
              }}
              title="Vista cuadrícula"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`mini-button ${viewMode === "list" ? "active" : ""}`}
              style={{
                border: 0,
                background: viewMode === "list" ? "var(--primary)" : "transparent",
                color: viewMode === "list" ? "white" : "var(--ink)",
                borderRadius: 0,
                margin: 0
              }}
              title="Vista lista"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`mini-button ${viewMode === "map" ? "active" : ""}`}
              style={{
                border: 0,
                background: viewMode === "map" ? "var(--primary)" : "transparent",
                color: viewMode === "map" ? "white" : "var(--ink)",
                borderRadius: 0,
                margin: 0
              }}
              title="Vista mapa"
            >
              <Map size={16} />
            </button>
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
      </div>

      {/* Main Content Area */}
      {filteredVendors.length === 0 ? (
        <div className="empty-state">
          No se encontraron proveedores con los filtros actuales.
        </div>
      ) : viewMode === "map" ? (
        <div style={{ height: "550px", border: "1px solid var(--line)", borderRadius: "8px", overflow: "hidden" }}>
          <MapaProveedores
            vendors={filteredVendors.filter((v) => v.lat && v.lng)}
            center={mapCenter}
            zoom={selectedRegion !== "todas" ? 10 : 7}
            onSelectVendor={(id) => {
              const vendor = vendors.find((v) => v.id === id);
              if (vendor) {
                setActiveVendor(vendor);
                setIsDetailOpen(true);
              }
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
                  <th>Ubicación</th>
                  <th>Calidad</th>
                  <th>Fiabilidad</th>
                  <th>Capacidad</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor) => {
                  const catInfo = categorias.find((c) => c.id === vendor.category);
                  return (
                    <tr
                      key={vendor.id}
                      onClick={() => {
                        setActiveVendor(vendor);
                        setIsDetailOpen(true);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <td style={{ fontWeight: "bold" }}>{vendor.name}</td>
                      <td>
                        <span className="pill" style={{ fontSize: "11px" }}>{catInfo?.label || vendor.category}</span>
                      </td>
                      <td>{vendor.region}</td>
                      <td style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Star size={12} fill="var(--soft-apricot)" color="var(--soft-apricot)" /> {vendor.qualityScore}/10
                      </td>
                      <td>{vendor.reliability}/10</td>
                      <td>{vendor.capacity || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="vendor-grid">
          {filteredVendors.map((vendor) => {
            const catInfo = categorias.find((c) => c.id === vendor.category);
            const prices = vendorPrices.filter((p) => p.vendorId === vendor.id);
            const hasPriceRange = prices.length > 0;
            const minPrice = hasPriceRange ? Math.min(...prices.map((p) => p.minPrice)) : 0;
            const maxPrice = hasPriceRange ? Math.max(...prices.map((p) => p.maxPrice)) : 0;

            return (
              <article
                key={vendor.id}
                className="vendor-card"
                onClick={() => {
                  setActiveVendor(vendor);
                  setIsDetailOpen(true);
                }}
                style={{ cursor: "pointer", transition: "all 0.2s" }}
              >
                <div>
                  <p className="eyebrow">{catInfo?.label || vendor.category} · {vendor.region}</p>
                  <h3 style={{ margin: "4px 0" }}>{vendor.name}</h3>
                  <p style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontSize: "12px", height: "35px" }}>
                    {vendor.notes || "Sin descripción."}
                  </p>
                </div>
                <div className="vendor-stats">
                  <span>Cap. {vendor.capacity || "N/A"}</span>
                  <span style={{ display: "inline-flex", gap: "2px", alignItems: "center" }}>
                    Cal. {vendor.qualityScore}/10
                  </span>
                  <span>
                    {hasPriceRange
                      ? minPrice === maxPrice
                        ? `${new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(minPrice)}`
                        : `${new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(minPrice)}-${new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(maxPrice)}`
                      : "Consultar tarifa"}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      <ProveedorDetail
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        vendor={activeVendor}
        prices={vendorPrices.filter((p) => p.vendorId === activeVendor?.id)}
        onEdit={handleEditClick}
        onDelete={deleteVendor}
      />

      {/* Form Modal */}
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
