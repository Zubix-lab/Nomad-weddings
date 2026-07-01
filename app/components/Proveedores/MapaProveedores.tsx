"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { Vendor } from "@/lib/types";

const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "100%",
        width: "100%",
        minHeight: "400px",
        background: "var(--surface-low)",
        borderRadius: "8px",
        display: "grid",
        placeItems: "center",
        color: "var(--slate-grey)"
      }}
    >
      Cargando mapa interactivo...
    </div>
  )
});

interface MapaProveedoresProps {
  vendors: Vendor[];
  center: { lat: number; lng: number };
  zoom?: number;
  onSelectVendor?: (id: string) => void;
}

export function MapaProveedores({ vendors, center, zoom, onSelectVendor }: MapaProveedoresProps) {
  return <MapInner vendors={vendors} center={center} zoom={zoom} onSelectVendor={onSelectVendor} />;
}
