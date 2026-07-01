"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Vendor } from "@/lib/types";
import { categorias } from "@/lib/categorias";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

interface MapInnerProps {
  vendors: Vendor[];
  center: { lat: number; lng: number };
  zoom?: number;
  onSelectVendor?: (id: string) => void;
}

// Helper component to center map dynamically when center prop changes
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapInner({ vendors, center, zoom = 8, onSelectVendor }: MapInnerProps) {
  const mapCenter: [number, number] = [center.lat, center.lng];

  return (
    <div style={{ height: "100%", width: "100%", borderRadius: "8px", overflow: "hidden", minHeight: "400px" }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <ChangeView center={mapCenter} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {vendors.map((vendor) => {
          if (!vendor.lat || !vendor.lng) return null;
          
          const catInfo = categorias.find((c) => c.id === vendor.category);
          
          // Custom colored circle icon using Leaflet DivIcon
          const customIcon = L.divIcon({
            className: "custom-div-icon",
            html: `<div style="
              background-color: ${catInfo?.color || "var(--primary)"};
              width: 24px;
              height: 24px;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 10px;
              font-weight: bold;
            ">${vendor.name.charAt(0)}</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          return (
            <Marker key={vendor.id} position={[vendor.lat, vendor.lng]} icon={customIcon}>
              <Popup>
                <div style={{ padding: "4px" }}>
                  <p className="eyebrow" style={{ margin: "0 0 2px 0", fontSize: "9px" }}>
                    {catInfo?.label || vendor.category}
                  </p>
                  <strong style={{ display: "block", fontSize: "14px", color: "var(--primary)" }}>
                    {vendor.name}
                  </strong>
                  <span style={{ fontSize: "12px", color: "var(--slate-grey)" }}>
                    {vendor.region}
                  </span>
                  <p style={{ margin: "6px 0 0 0", fontSize: "11px", lineHeight: "1.3" }}>
                    {vendor.notes.substring(0, 80)}...
                  </p>
                  {onSelectVendor && (
                    <button
                      className="primary-button"
                      onClick={() => onSelectVendor(vendor.id)}
                      style={{
                        marginTop: "8px",
                        width: "100%",
                        minHeight: "28px",
                        fontSize: "11px",
                        padding: "4px 8px"
                      }}
                    >
                      Ver ficha completa
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
