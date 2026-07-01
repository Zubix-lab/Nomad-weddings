"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../UI/Modal";
import type { Vendor, VendorPrice } from "@/lib/types";
import { categorias } from "@/lib/categorias";
import { Mail, Phone, Globe, ShieldAlert, Edit, Trash, Plus, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { MapaProveedores } from "./MapaProveedores";

interface ProveedorDetailProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | undefined;
  prices: VendorPrice[];
  onEdit: (vendor: Vendor) => void;
  onDelete: (id: string) => void;
  onAddPrice?: (vendorId: string) => void;
}

export function ProveedorDetail({
  isOpen,
  onClose,
  vendor,
  prices,
  onEdit,
  onDelete,
  onAddPrice
}: ProveedorDetailProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    setCurrentImgIndex(0);
  }, [vendor]);

  if (!vendor) return null;

  const catInfo = categorias.find((c) => c.id === vendor.category);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detalle de Proveedor: ${vendor.name}`}>
      {showDeleteConfirm ? (
        <div style={{ display: "grid", gap: "16px", padding: "10px 0" }}>
          <p style={{ margin: 0, color: "var(--slate-grey)" }}>
            ¿Estás seguro de que quieres eliminar a <strong>{vendor.name}</strong>? Esta acción no se puede deshacer.
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button className="secondary-button" onClick={() => setShowDeleteConfirm(false)}>
              Cancelar
            </button>
            <button
              className="primary-button"
              style={{ background: "var(--error, #ba1a1a)" }}
              onClick={() => {
                onDelete(vendor.id);
                setShowDeleteConfirm(false);
                onClose();
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {/* Header info */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <span
                style={{
                  background: catInfo?.color || "var(--surface-container)",
                  color: catInfo?.color ? "white" : "var(--ink)",
                  padding: "4px 8px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: "bold"
                }}
              >
                {catInfo?.label || vendor.category}
              </span>
              <h3 style={{ margin: "8px 0 2px 0", fontSize: "24px", fontFamily: '"Source Serif 4", Georgia, serif', color: "var(--primary)" }}>
                {vendor.name}
              </h3>
              <p className="eyebrow" style={{ margin: 0 }}>{vendor.region}</p>
            </div>
            
            <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
              <button
                className="secondary-button"
                onClick={() => onEdit(vendor)}
                style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}
              >
                <Edit size={16} /> Editar
              </button>
              <button
                className="secondary-button"
                onClick={() => setShowDeleteConfirm(true)}
                style={{ color: "var(--error)", borderColor: "var(--error-soft)", display: "inline-flex", gap: "6px", alignItems: "center" }}
              >
                <Trash size={16} /> Eliminar
              </button>
            </div>
          </div>

          {/* Image Carousel */}
          {(() => {
            const images = vendor.images || [];
            const slides = [
              ...images.map((img, idx) => ({ type: "image", value: img, label: `Galería (${idx + 1}/${images.length})` })),
              ...(vendor.lat && vendor.lng ? [
                { type: "satellite", value: `https://maps.google.com/maps?q=${vendor.lat},${vendor.lng}&t=k&z=19&output=embed`, label: "Google Maps Satélite" },
                { type: "card", value: `https://maps.google.com/maps?q=${encodeURIComponent(vendor.name)}&output=embed`, label: "Google Maps Ficha" }
              ] : [])
            ];
            if (slides.length === 0) return null;
            
            // Safety guard for currentImgIndex bounds
            const safeIndex = currentImgIndex >= slides.length ? 0 : currentImgIndex;
            const currentSlide = slides[safeIndex];

            return (
              <div style={{ position: "relative", width: "100%", height: "220px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--outline-variant)", background: "var(--surface-low)" }}>
                {currentSlide.type === "image" ? (
                  <img
                    src={currentSlide.value}
                    alt={`${vendor.name} - ${safeIndex + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <iframe
                    src={currentSlide.value}
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: "block" }}
                    allowFullScreen
                    loading="lazy"
                  />
                )}

                {/* Top overlay label */}
                <div style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  background: "rgba(0, 0, 0, 0.65)",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontWeight: 500,
                  backdropFilter: "blur(2px)",
                  zIndex: 2
                }}>
                  {currentSlide.label}
                </div>
                
                {/* Arrows */}
                {slides.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImgIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "10px",
                        transform: "translateY(-50%)",
                        background: "rgba(255, 255, 255, 0.85)",
                        border: 0,
                        borderRadius: "50%",
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        color: "var(--ink)",
                        padding: 0,
                        zIndex: 2
                      }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setCurrentImgIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1))}
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        background: "rgba(255, 255, 255, 0.85)",
                        border: 0,
                        borderRadius: "50%",
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        color: "var(--ink)",
                        padding: 0,
                        zIndex: 2
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}

                {/* Dots */}
                {slides.length > 1 && (
                  <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "5px", zIndex: 2 }}>
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImgIndex(idx)}
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          border: 0,
                          background: idx === safeIndex ? "white" : "rgba(255, 255, 255, 0.4)",
                          cursor: "pointer",
                          padding: 0
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          <hr style={{ border: 0, borderTop: "1px solid var(--outline-variant)", margin: 0 }} />

          {/* Quick stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            <div style={{ padding: "10px", background: "var(--surface-low)", borderRadius: "8px", textAlign: "center" }}>
              <span className="eyebrow" style={{ fontSize: "10px" }}>Valoración</span>
              <strong style={{ display: "block", fontSize: "18px", color: "var(--primary)", marginTop: "4px" }}>
                {vendor.qualityScore}/10
              </strong>
            </div>
            <div style={{ padding: "10px", background: "var(--surface-low)", borderRadius: "8px", textAlign: "center" }}>
              <span className="eyebrow" style={{ fontSize: "10px" }}>Fiabilidad</span>
              <strong style={{ display: "block", fontSize: "18px", color: "var(--primary)", marginTop: "4px" }}>
                {vendor.reliability}/10
              </strong>
            </div>
            <div style={{ padding: "10px", background: "var(--surface-low)", borderRadius: "8px", textAlign: "center" }}>
              <span className="eyebrow" style={{ fontSize: "10px" }}>Capacidad</span>
              <strong style={{ display: "block", fontSize: "18px", color: "var(--primary)", marginTop: "4px" }}>
                {vendor.capacity || "N/A"}
              </strong>
            </div>
            <div style={{ padding: "10px", background: "var(--surface-low)", borderRadius: "8px", textAlign: "center" }}>
              <span className="eyebrow" style={{ fontSize: "10px" }}>Respuesta</span>
              <strong style={{ display: "block", fontSize: "18px", color: "var(--primary)", marginTop: "4px" }}>
                {vendor.responseTimeHours}h
              </strong>
            </div>
          </div>

          {/* Contact Details */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "15px", fontFamily: '"Source Serif 4", Georgia, serif', color: "var(--primary)" }}>
                Contacto y Canales
              </h4>
              <div style={{ display: "grid", gap: "8px" }}>
                {vendor.phone ? (
                  <a href={`tel:${vendor.phone}`} style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--slate-grey)", textDecoration: "none", fontSize: "13px" }}>
                    <Phone size={14} /> {vendor.phone}
                  </a>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--slate-grey)", fontSize: "13px", opacity: 0.6 }}>
                    <Phone size={14} /> Teléfono: No disponible
                  </div>
                )}
                {vendor.email ? (
                  <a href={`mailto:${vendor.email}`} style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--slate-grey)", textDecoration: "none", fontSize: "13px" }}>
                    <Mail size={14} /> {vendor.email}
                  </a>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--slate-grey)", fontSize: "13px", opacity: 0.6 }}>
                    <Mail size={14} /> Email: No disponible
                  </div>
                )}
                {vendor.website ? (
                  <a
                    href={vendor.website}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "var(--primary)",
                      textDecoration: "underline",
                      fontSize: "13px",
                      fontWeight: 500
                    }}
                  >
                    <Globe size={14} /> Sitio Web Oficial
                  </a>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--slate-grey)", fontSize: "13px", opacity: 0.6 }}>
                    <Globe size={14} /> Sitio Web: No disponible
                  </div>
                )}
                {vendor.lat && vendor.lng ? (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vendor.name)}+${vendor.lat},${vendor.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "var(--primary)",
                      textDecoration: "underline",
                      fontSize: "13px",
                      fontWeight: 500
                    }}
                  >
                    <MapPin size={14} /> Ver en Google Maps
                  </a>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--slate-grey)", fontSize: "13px", opacity: 0.6 }}>
                    <MapPin size={14} /> Google Maps: No disponible
                  </div>
                )}
              </div>

              {vendor.styleTags.length > 0 && (
                <div style={{ marginTop: "16px" }}>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "var(--primary)" }}>Etiquetas de Estilo</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {vendor.styleTags.map((tag) => (
                      <span key={tag} className="pill" style={{ fontSize: "10px", padding: "2px 6px" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "15px", fontFamily: '"Source Serif 4", Georgia, serif', color: "var(--primary)" }}>
                Condiciones Especiales
              </h4>
              <div style={{ padding: "12px", background: "var(--surface-low)", borderRadius: "8px", fontSize: "13px", lineHeight: "1.4" }}>
                <p style={{ margin: "0 0 8px 0" }}>
                  <strong>Comisión:</strong> {vendor.commissionFree ? "Libre de comisión (100% neto para pareja)" : "Sujeto a comisiones comerciales."}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Experiencia en Nomad:</strong> {vendor.previousExperience} bodas organizadas con éxito.
                </p>
              </div>
            </div>
          </div>

          {/* Private Planner Notes */}
          <div>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", fontFamily: '"Source Serif 4", Georgia, serif', color: "var(--primary)" }}>
              Notas y Valoración del Wedding Planner
            </h4>
            <div style={{ padding: "12px", background: "#fff", border: "1px solid var(--outline-variant)", borderRadius: "8px", fontSize: "13px", lineHeight: "1.5", color: "var(--on-surface-variant)" }}>
              {vendor.notes || "No hay notas adicionales registradas sobre este proveedor."}
            </div>
          </div>

          {/* Pricing Section */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h4 style={{ margin: 0, fontSize: "15px", fontFamily: '"Source Serif 4", Georgia, serif', color: "var(--primary)" }}>
                Precios e Historial de Tarifas
              </h4>
              {onAddPrice && (
                <button
                  onClick={() => onAddPrice(vendor.id)}
                  style={{
                    border: 0,
                    background: "transparent",
                    color: "var(--primary)",
                    fontSize: "12px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    cursor: "pointer",
                    marginLeft: "auto"
                  }}
                >
                  <Plus size={14} /> Añadir tarifa
                </button>
              )}
            </div>
            {prices.length === 0 ? (
              <div className="empty-state" style={{ minHeight: "80px", fontSize: "12px" }}>
                No hay tarifas registradas. Añade una para usar este proveedor en el presupuesto.
              </div>
            ) : (
              <div style={{ display: "grid", gap: "8px" }}>
                {prices.map((price) => (
                  <div
                    key={price.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 12px",
                      background: "var(--surface-low)",
                      borderRadius: "6px",
                      fontSize: "13px"
                    }}
                  >
                    <div>
                      <strong>{price.serviceName}</strong>
                      <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "var(--slate-grey)" }}>
                        Temporada: {price.season.toUpperCase()} · Zona: {price.region}
                      </p>
                      {price.conditions && (
                        <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "var(--slate-grey)", fontStyle: "italic" }}>
                          Condiciones: {price.conditions}
                        </p>
                      )}
                    </div>
                    <span style={{ fontWeight: "bold", fontSize: "15px", color: "var(--primary)", marginLeft: "auto" }}>
                      {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(price.minPrice)} 
                      {price.maxPrice > price.minPrice && ` - ${new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(price.maxPrice)}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Map view for individual vendor */}
          {vendor.lat && vendor.lng && (
            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", fontFamily: '"Source Serif 4", Georgia, serif', color: "var(--primary)" }}>
                Geolocalización
              </h4>
              <div style={{ height: "180px", borderRadius: "8px", overflow: "hidden" }}>
                <MapaProveedores vendors={[vendor]} center={{ lat: vendor.lat, lng: vendor.lng }} zoom={12} />
              </div>
              <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "var(--slate-grey)", textAlign: "right" }}>
                Coordenadas GPS: {vendor.lat.toFixed(5)}, {vendor.lng.toFixed(5)}
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
