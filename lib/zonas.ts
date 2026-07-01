export interface ZonaInfo {
  id: string;
  label: string;
  provincia: string;
  comunidad: string;
  center: { lat: number; lng: number };
}

export const zonas: ZonaInfo[] = [
  { id: "guipuzcoa", label: "Guipúzcoa", provincia: "Gipuzkoa", comunidad: "País Vasco", center: { lat: 43.1853, lng: -2.0928 } },
  { id: "vizcaya", label: "Vizcaya", provincia: "Bizkaia", comunidad: "País Vasco", center: { lat: 43.2630, lng: -2.9350 } },
  { id: "alava", label: "Álava", provincia: "Álava", comunidad: "País Vasco", center: { lat: 42.8469, lng: -2.6727 } },
  { id: "navarra", label: "Navarra", provincia: "Navarra", comunidad: "Navarra", center: { lat: 42.8169, lng: -1.6432 } },
  { id: "gran-canaria", label: "Gran Canaria", provincia: "Las Palmas", comunidad: "Canarias", center: { lat: 28.1235, lng: -15.4363 } },
  { id: "tenerife", label: "Tenerife", provincia: "S.C. de Tenerife", comunidad: "Canarias", center: { lat: 28.4636, lng: -16.2518 } },
  { id: "lanzarote", label: "Lanzarote", provincia: "Las Palmas", comunidad: "Canarias", center: { lat: 29.0469, lng: -13.5899 } },
  { id: "fuerteventura", label: "Fuerteventura", provincia: "Las Palmas", comunidad: "Canarias", center: { lat: 28.3587, lng: -14.0537 } },
  { id: "la-palma", label: "La Palma", provincia: "S.C. de Tenerife", comunidad: "Canarias", center: { lat: 28.6835, lng: -17.7642 } },
  { id: "la-gomera", label: "La Gomera", provincia: "S.C. de Tenerife", comunidad: "Canarias", center: { lat: 28.0916, lng: -17.1133 } },
  { id: "el-hierro", label: "El Hierro", provincia: "S.C. de Tenerife", comunidad: "Canarias", center: { lat: 27.7406, lng: -17.9855 } }
];
