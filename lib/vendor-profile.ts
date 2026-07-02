import type { Vendor, VendorPrice, VendorStatus, VendorAvailabilityType, VendorPriceConfidence } from "./types";

export const vendorStatusLabels: Record<VendorStatus, string> = {
  draft: "Borrador",
  reviewed: "Ficha revisada",
  verified: "Verificado",
  outdated: "Revisar"
};

export const vendorAvailabilityLabels: Record<VendorAvailabilityType, string> = {
  local: "Local",
  "se-desplaza": "Se desplaza",
  remoto: "Remoto"
};

export const priceConfidenceLabels: Record<VendorPriceConfidence, string> = {
  alta: "Precio confirmado",
  media: "Precio orientativo",
  baja: "Precio estimado"
};

const provinceAliases: Record<string, string> = {
  "Guipuzcoa": "Gipuzkoa",
  "Guipúzcoa": "Gipuzkoa",
  "Vizcaya": "Bizkaia",
  "Álava": "Álava",
  "Alava": "Álava",
  "Gran Canaria": "Las Palmas",
  "Lanzarote": "Las Palmas",
  "Fuerteventura": "Las Palmas",
  "Tenerife": "Santa Cruz de Tenerife",
  "La Palma": "Santa Cruz de Tenerife",
  "La Gomera": "Santa Cruz de Tenerife",
  "El Hierro": "Santa Cruz de Tenerife"
};

export function getVendorProvince(vendor: Vendor): string {
  return vendor.province || provinceAliases[vendor.region] || vendor.region;
}

export function getVendorContactUrl(vendor: Vendor): string {
  return vendor.contactUrl || vendor.website || vendor.instagramUrl || vendor.googleMapsUrl || "";
}

export function getVendorSourceUrl(vendor: Vendor): string {
  return vendor.sourceUrl || vendor.website || vendor.googleMapsUrl || vendor.instagramUrl || "";
}

export function getVendorStatus(vendor: Vendor): VendorStatus {
  if (vendor.status) return vendor.status;
  if (vendor.sourceUrl || vendor.googlePlaceId || vendor.images?.length) return "reviewed";
  return "draft";
}

export function getVendorAvailability(vendor: Vendor): VendorAvailabilityType {
  return vendor.availabilityType || "local";
}

export function getVendorLastCheckedAt(vendor: Vendor): string {
  return vendor.lastCheckedAt || "2026-07-02";
}

export function getVendorPriceFrom(vendor: Vendor, prices: VendorPrice[]): number | undefined {
  if (typeof vendor.priceFrom === "number" && vendor.priceFrom > 0) return vendor.priceFrom;
  const vendorPrices = prices.filter((price) => price.vendorId === vendor.id);
  if (vendorPrices.length === 0) return undefined;
  return Math.min(...vendorPrices.map((price) => price.minPrice));
}

export function getVendorPriceRange(vendor: Vendor, prices: VendorPrice[]): string {
  if (vendor.priceRange) return vendor.priceRange;
  const vendorPrices = prices.filter((price) => price.vendorId === vendor.id);
  if (vendorPrices.length === 0) return "Consultar";
  const minPrice = Math.min(...vendorPrices.map((price) => price.minPrice));
  const maxPrice = Math.max(...vendorPrices.map((price) => price.maxPrice));
  const formatter = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  return minPrice === maxPrice ? formatter.format(minPrice) : `${formatter.format(minPrice)}-${formatter.format(maxPrice)}`;
}

export function getVendorPriceConfidence(vendor: Vendor, prices: VendorPrice[]): VendorPriceConfidence {
  if (vendor.priceConfidence) return vendor.priceConfidence;
  return prices.some((price) => price.vendorId === vendor.id) ? "media" : "baja";
}

export function isVendorOutdated(vendor: Vendor, now = new Date("2026-07-02")): boolean {
  const lastCheckedAt = getVendorLastCheckedAt(vendor);
  const checkedDate = new Date(`${lastCheckedAt}T00:00:00`);
  if (Number.isNaN(checkedDate.getTime())) return true;
  const daysSinceCheck = Math.floor((now.getTime() - checkedDate.getTime()) / 86_400_000);
  return daysSinceCheck > 90 || getVendorStatus(vendor) === "outdated";
}

export function getVendorQualityBadges(vendor: Vendor, prices: VendorPrice[]): string[] {
  const badges: string[] = [];
  const status = getVendorStatus(vendor);
  const priceConfidence = getVendorPriceConfidence(vendor, prices);

  if (status === "verified") badges.push(vendorStatusLabels.verified);
  if (status === "reviewed") badges.push(vendorStatusLabels.reviewed);
  if (priceConfidence === "alta") badges.push(priceConfidenceLabels.alta);
  if (getVendorAvailability(vendor) === "se-desplaza") badges.push(vendorAvailabilityLabels["se-desplaza"]);
  if (vendor.responseTimeHours <= 8) badges.push("Respuesta rápida");
  if (vendor.qualityScore >= 9 && vendor.previousExperience >= 8) badges.push("Popular en País Vasco");
  if (isVendorOutdated(vendor)) badges.push("Actualizar datos");

  return badges;
}
