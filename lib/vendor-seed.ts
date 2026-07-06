import type { Vendor, VendorPrice } from "@/lib/types";

export const officialVendorSeed: Vendor[] = [
  {
    id: "vendor-convent-garden-donostia",
    name: "Convent Garden",
    category: "localizacion",
    region: "Gipuzkoa",
    province: "Gipuzkoa",
    city: "Donostia-San Sebastian",
    serviceArea: "Gipuzkoa y Pais Vasco",
    phone: "+34 843 68 70 20",
    email: "info@conventgardensansebastian.com",
    website: "https://conventgardensansebastian.com/",
    contactUrl: "https://conventgardensansebastian.com/contacto/",
    sourceUrl: "https://conventgardensansebastian.com/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Convent%20Garden%20Donostia",
    capacity: 180,
    styleTags: [
      "urbano",
      "historico",
      "jardin",
      "industrial"
    ],
    languages: [
      "castellano",
      "euskera"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "espacio"
      },
      {
        name: "evento completo"
      }
    ],
    priceFrom: 3000,
    priceRange: "Consultar",
    priceConfidence: "baja",
    reliability: 8,
    responseTimeHours: 24,
    previousExperience: 6,
    qualityScore: 8.7,
    commissionFree: true,
    notes: "Multiespacio real en el centro de Donostia con alquiler de espacios para eventos y bodas.",
    reviewsSummary: "Verificado por web propia en julio de 2026.",
    notesInternal: "Validar capacidad, exclusividad, condiciones de montaje y horarios.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06",
    lat: 43.321,
    lng: -1.982
  },
  {
    id: "vendor-restaurante-arraiz-bilbao",
    name: "Restaurante Arraiz",
    category: "localizacion",
    region: "Vizcaya",
    province: "Bizkaia",
    city: "Bilbao",
    serviceArea: "Bilbao y Bizkaia",
    phone: "",
    email: "",
    website: "https://restaurantearraiz.com/eventos-bodas/",
    contactUrl: "https://restaurantearraiz.com/eventos-bodas/",
    sourceUrl: "https://restaurantearraiz.com/eventos-bodas/",
    instagramUrl: "https://www.instagram.com/restaurantearraiz/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Restaurante%20Arraiz%20Bilbao",
    capacity: 160,
    styleTags: [
      "naturaleza",
      "montana",
      "gastronomico",
      "jardin"
    ],
    languages: [
      "castellano",
      "euskera"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "banquete"
      },
      {
        name: "ceremonia"
      },
      {
        name: "espacio"
      }
    ],
    priceFrom: 165,
    priceRange: "Menu desde 165 EUR aprox.",
    priceConfidence: "media",
    reliability: 8.5,
    responseTimeHours: 24,
    previousExperience: 8,
    qualityScore: 8.8,
    commissionFree: true,
    notes: "Restaurante y espacio de boda en entorno natural cerca de Bilbao, con jardin y banquete.",
    reviewsSummary: "Revisar opiniones actuales antes de proponerlo a pareja.",
    notesInternal: "Puede encajar para parejas que buscan naturaleza sin salir del entorno Bilbao.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06",
    lat: 43.246,
    lng: -2.983
  },
  {
    id: "vendor-palacio-horkasitas-bizkaia",
    name: "Palacio Horkasitas",
    category: "localizacion",
    region: "Vizcaya",
    province: "Bizkaia",
    city: "Artzentales",
    serviceArea: "Bizkaia, Cantabria oriental y Pais Vasco",
    phone: "686372210",
    email: "info@palaciohorkasitas.com",
    website: "https://palaciohorkasitas.com/",
    contactUrl: "https://palaciohorkasitas.com/",
    sourceUrl: "https://palaciohorkasitas.com/",
    instagramUrl: "https://www.instagram.com/palaciohorkasitas/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Palacio%20Horkasitas%20Artzentales",
    capacity: 200,
    styleTags: [
      "palacio",
      "historico",
      "jardin",
      "exclusivo"
    ],
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "alquiler espacio"
      },
      {
        name: "evento"
      }
    ],
    priceFrom: 3000,
    priceRange: "3.000-3.200 EUR espacio aprox.",
    priceConfidence: "media",
    reliability: 8.6,
    responseTimeHours: 24,
    previousExperience: 7,
    qualityScore: 8.9,
    commissionFree: true,
    notes: "Palacete historico en Bizkaia orientado a bodas y eventos.",
    reviewsSummary: "Pendiente de comprobar disponibilidad y condiciones actualizadas.",
    notesInternal: "Buen candidato para bodas con estetica palacio/campo. Confirmar proveedores obligatorios.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06",
    lat: 43.252,
    lng: -3.233
  },
  {
    id: "vendor-hotel-luze-san-sebastian",
    name: "Hotel Luze San Sebastian",
    category: "alojamiento",
    region: "Gipuzkoa",
    province: "Gipuzkoa",
    city: "Donostia-San Sebastian",
    serviceArea: "Donostia-San Sebastian",
    phone: "",
    email: "",
    website: "https://hotelluzesansebastian.es/",
    contactUrl: "https://hotelluzesansebastian.es/",
    sourceUrl: "https://hotelluzesansebastian.es/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Hotel%20Luze%20San%20Sebastian",
    capacity: 120,
    styleTags: [
      "hotel",
      "belle epoque",
      "alojamiento",
      "urbano"
    ],
    languages: [
      "castellano",
      "ingles"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "alojamiento"
      },
      {
        name: "habitaciones bloqueadas"
      }
    ],
    priceFrom: 160,
    priceRange: "Consultar habitaciones",
    priceConfidence: "baja",
    reliability: 8.2,
    responseTimeHours: 24,
    previousExperience: 4,
    qualityScore: 8.4,
    commissionFree: true,
    notes: "Hotel en San Sebastian util para alojamiento de invitados y logistica urbana.",
    reviewsSummary: "Pendiente de revisar tarifas de grupo y politica de cancelacion.",
    notesInternal: "No asignar como lugar de celebracion inicial; usar como alojamiento cuando el proyecto avance.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06",
    lat: 43.318,
    lng: -2.002
  },
  {
    id: "vendor-gaizka-corta-fotografia",
    name: "Gaizka Corta Fotografia",
    category: "fotografia",
    region: "Gipuzkoa",
    province: "Gipuzkoa",
    city: "Donostia-San Sebastian",
    serviceArea: "Gipuzkoa y desplazamientos",
    phone: "",
    email: "",
    website: "https://gcfotografia.es/",
    contactUrl: "https://gcfotografia.es/",
    sourceUrl: "https://gcfotografia.es/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Gaizka%20Corta%20Fotografia%20San%20Sebastian",
    capacity: 250,
    styleTags: [
      "natural",
      "artistico",
      "documental",
      "pareja"
    ],
    languages: [
      "castellano"
    ],
    availabilityType: "se-desplaza",
    packages: [
      {
        name: "reportaje completo"
      },
      {
        name: "sesion pareja"
      }
    ],
    priceFrom: 1800,
    priceRange: "Consultar reportaje",
    priceConfidence: "baja",
    reliability: 8.4,
    responseTimeHours: 24,
    previousExperience: 8,
    qualityScore: 8.7,
    commissionFree: true,
    notes: "Fotografo de bodas en San Sebastian con enfoque natural y artistico.",
    reviewsSummary: "Pendiente de revisar portfolio completo y disponibilidad.",
    notesInternal: "Solicitar galeria completa reciente antes de recomendar.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06",
    lat: 43.318,
    lng: -1.981
  },
  {
    id: "vendor-larrea-prestatuak-catering",
    name: "Larrea Prestatuak",
    category: "restauracion",
    region: "Gipuzkoa",
    province: "Gipuzkoa",
    city: "",
    serviceArea: "Gipuzkoa",
    phone: "",
    email: "",
    website: "https://www.larreaprestatuak.com/catering-gipuzkoa.html",
    contactUrl: "https://www.larreaprestatuak.com/catering-gipuzkoa.html",
    sourceUrl: "https://www.larreaprestatuak.com/catering-gipuzkoa.html",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Larrea%20Prestatuak%20Gipuzkoa",
    capacity: 250,
    styleTags: [
      "catering",
      "familiar",
      "popular",
      "local"
    ],
    languages: [
      "castellano",
      "euskera"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "catering evento"
      },
      {
        name: "celebracion familiar"
      }
    ],
    priceFrom: 98,
    priceRange: "Consultar menu",
    priceConfidence: "baja",
    reliability: 8,
    responseTimeHours: 24,
    previousExperience: 5,
    qualityScore: 8,
    commissionFree: true,
    notes: "Catering para eventos y celebraciones en Gipuzkoa.",
    reviewsSummary: "Pendiente de validar menus de boda y condiciones de desplazamiento.",
    notesInternal: "Pedir dossier actualizado si se usa para boda formal.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06",
    lat: 43.185,
    lng: -2.092
  },
  {
    id: "vendor-ona-catering",
    name: "Ona Catering",
    category: "restauracion",
    region: "Pais Vasco",
    province: "Gipuzkoa",
    city: "",
    serviceArea: "Pais Vasco",
    phone: "",
    email: "",
    website: "https://ona.catering/",
    contactUrl: "https://ona.catering/",
    sourceUrl: "https://ona.catering/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Ona%20Catering%20Pais%20Vasco",
    capacity: 300,
    styleTags: [
      "catering",
      "gastronomico",
      "elegante",
      "evento"
    ],
    languages: [
      "castellano",
      "euskera"
    ],
    availabilityType: "se-desplaza",
    packages: [
      {
        name: "boda"
      },
      {
        name: "evento empresa"
      }
    ],
    priceFrom: 120,
    priceRange: "Consultar menu",
    priceConfidence: "baja",
    reliability: 8,
    responseTimeHours: 24,
    previousExperience: 5,
    qualityScore: 8.2,
    commissionFree: true,
    notes: "Catering con servicio de bodas y eventos.",
    reviewsSummary: "Pendiente de contraste con resenas y propuesta actual.",
    notesInternal: "Validar radio de servicio y logistica de cocina in situ.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06",
    lat: 43.22,
    lng: -2.12
  },
  {
    id: "vendor-mimiku-floristeria",
    name: "Mimiku",
    category: "floristeria",
    region: "Gipuzkoa",
    province: "Gipuzkoa",
    city: "Donostia-San Sebastian",
    serviceArea: "Donostia-San Sebastian y alrededores",
    phone: "",
    email: "",
    website: "https://www.mimiku.eus/",
    contactUrl: "https://www.mimiku.eus/",
    sourceUrl: "https://www.mimiku.eus/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Mimiku%20Floristeria%20Donostia",
    capacity: 180,
    styleTags: [
      "floral",
      "mimo",
      "natural",
      "decoracion"
    ],
    languages: [
      "castellano",
      "euskera"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "ramos"
      },
      {
        name: "decoracion floral"
      },
      {
        name: "bodas"
      }
    ],
    priceFrom: 800,
    priceRange: "800-1.500 EUR aprox.",
    priceConfidence: "media",
    reliability: 8.3,
    responseTimeHours: 24,
    previousExperience: 6,
    qualityScore: 8.5,
    commissionFree: true,
    notes: "Floristeria de Donostia especializada en ramos, arreglos para bodas y decoracion para eventos.",
    reviewsSummary: "Pendiente de revision de portfolio de bodas reciente.",
    notesInternal: "Buena opcion para estetica natural y cercana. Confirmar montaje y desmontaje.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06",
    lat: 43.314,
    lng: -1.982
  },
  {
    id: "vendor-villa-maria-luisa-floristeria",
    name: "Floristeria Villa Maria Luisa",
    category: "floristeria",
    region: "Gipuzkoa",
    province: "Gipuzkoa",
    city: "Donostia-San Sebastian",
    serviceArea: "Donostia-San Sebastian",
    phone: "943420658",
    email: "",
    website: "",
    contactUrl: "https://www.instagram.com/floristeriavillamarialuisa/",
    sourceUrl: "https://www.instagram.com/floristeriavillamarialuisa/",
    instagramUrl: "https://www.instagram.com/floristeriavillamarialuisa/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Floristeria%20Villa%20Maria%20Luisa%20San%20Sebastian",
    capacity: 160,
    styleTags: [
      "floral",
      "clasico",
      "eventos",
      "decoracion"
    ],
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "ramos"
      },
      {
        name: "decoracion bodas"
      }
    ],
    priceFrom: 800,
    priceRange: "Consultar decoracion",
    priceConfidence: "baja",
    reliability: 8.1,
    responseTimeHours: 24,
    previousExperience: 6,
    qualityScore: 8.3,
    commissionFree: true,
    notes: "Floristeria historica de San Sebastian con trabajo en decoracion de bodas y eventos.",
    reviewsSummary: "Pendiente de contraste con resenas actuales.",
    notesInternal: "Validar disponibilidad de montaje de boda completa.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06",
    lat: 43.318,
    lng: -1.981
  },
  {
    id: "vendor-001",
    name: "Palacio de Miramar",
    category: "localizacion",
    region: "Gipuzkoa",
    phone: "+34 943 21 90 22",
    email: "miramar@miramar.eus",
    website: "https://www.miramar.eus/",
    capacity: 250,
    styleTags: [
      "palacio",
      "histórico",
      "vistas-mar",
      "jardines"
    ],
    reliability: 10,
    responseTimeHours: 6,
    previousExperience: 12,
    qualityScore: 10,
    commissionFree: true,
    notes: "Palacio Miramar / Miramar Jauregia, espacio real de eventos en Donostia.",
    lat: 43.3146,
    lng: -1.9972,
    images: [
      "https://www.destinoseuskadi.com/wp-content/uploads/2016/11/xmiramar.jpg.pagespeed.ic.aHw1PbJVlg.webp",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://www.miramar.eus/",
    sourceUrl: "https://www.miramar.eus/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Palacio%20de%20Miramar%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "espacio"
      },
      {
        name: "banquete"
      },
      {
        name: "evento completo"
      }
    ],
    priceFrom: 4000,
    priceRange: "4000-12.000 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-002",
    name: "Hotel Maria Cristina",
    category: "localizacion",
    region: "Gipuzkoa",
    phone: "+34 943 437 600",
    email: "events@hotelmariacristina.com",
    website: "https://www.marriott.com/en-us/hotels/easlc-hotel-maria-cristina-a-luxury-collection-hotel-san-sebastian/events/",
    capacity: 250,
    styleTags: [
      "hotel",
      "lujo",
      "salones",
      "belle-epoque"
    ],
    reliability: 10,
    responseTimeHours: 4,
    previousExperience: 15,
    qualityScore: 10,
    commissionFree: false,
    notes: "Hotel Maria Cristina confirmado como hotel con servicios de bodas y eventos.",
    lat: 43.3224,
    lng: -1.9796,
    images: [
      "https://cache.marriott.com/content/dam/marriott-renditions/EASLC/easlc-exterior-4353-hor-wide.jpg",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://www.marriott.com/en-us/hotels/easlc-hotel-maria-cristina-a-luxury-collection-hotel-san-sebastian/events/",
    sourceUrl: "https://www.marriott.com/en-us/hotels/easlc-hotel-maria-cristina-a-luxury-collection-hotel-san-sebastian/events/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Hotel%20Maria%20Cristina%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "espacio"
      },
      {
        name: "banquete"
      },
      {
        name: "evento completo"
      }
    ],
    priceFrom: 4000,
    priceRange: "4000-12.000 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-003",
    name: "Bodega Katxiña",
    category: "localizacion",
    region: "Gipuzkoa",
    phone: "+34 943 580 160",
    email: "bodega@katxina.com",
    website: "https://bodegakatxina.com/",
    capacity: 300,
    styleTags: [
      "bodega",
      "viñedos",
      "parrilla",
      "moderno"
    ],
    reliability: 9,
    responseTimeHours: 8,
    previousExperience: 9,
    qualityScore: 9,
    commissionFree: true,
    notes: "Moderno viñedo y espacio de eventos rodeado de naturaleza sobre el río Oria en Orio.",
    lat: 43.275,
    lng: -2.1285,
    images: [
      "https://bodegakatxina.com/wp-content/uploads/2024/01/bodega-katxina-bodas-003-2-1024x683.jpg",
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1528254847117-67891fa133b8?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://bodegakatxina.com/",
    sourceUrl: "https://bodegakatxina.com/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Bodega%20Katxi%C3%B1a%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "espacio"
      },
      {
        name: "banquete"
      },
      {
        name: "evento completo"
      }
    ],
    priceFrom: 4000,
    priceRange: "4000-12.000 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-004",
    name: "Hotel Iturregi",
    category: "localizacion",
    region: "Gipuzkoa",
    phone: "+34 943 896 162",
    email: "info@hoteliturregi.com",
    website: "https://hoteliturregi.com/",
    capacity: 50,
    styleTags: [
      "hotel-boutique",
      "exclusivo",
      "viñedos",
      "íntimo"
    ],
    reliability: 10,
    responseTimeHours: 12,
    previousExperience: 6,
    qualityScore: 10,
    commissionFree: true,
    notes: "Hotel boutique de gran lujo ubicado entre viñedos de txakoli en Getaria.",
    lat: 43.2922,
    lng: -2.2155,
    images: [
      "https://www.hoteliturregi.com/wp-content/uploads/2024/01/piscina_01.jpg",
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://hoteliturregi.com/",
    sourceUrl: "https://hoteliturregi.com/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Hotel%20Iturregi%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "espacio"
      },
      {
        name: "banquete"
      },
      {
        name: "evento completo"
      }
    ],
    priceFrom: 4000,
    priceRange: "4000-12.000 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-005",
    name: "Parador de Hondarribia",
    category: "localizacion",
    region: "Gipuzkoa",
    phone: "+34 943 645 500",
    email: "hondarribia@parador.es",
    website: "https://paradores.es/es/parador-de-hondarribia",
    capacity: 150,
    styleTags: [
      "castillo",
      "histórico",
      "medieval",
      "vistas-mar"
    ],
    reliability: 9,
    responseTimeHours: 8,
    previousExperience: 8,
    qualityScore: 9,
    commissionFree: true,
    notes: "Imponente castillo del siglo X restaurado como hotel histórico sobre la bahía de Txingudi.",
    lat: 43.3636,
    lng: -1.7914,
    images: [
      "https://paradores.es/sites/default/files/images/hondarribia-slide-1_4.jpg",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://paradores.es/es/parador-de-hondarribia",
    sourceUrl: "https://paradores.es/es/parador-de-hondarribia",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Parador%20de%20Hondarribia%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "espacio"
      },
      {
        name: "banquete"
      },
      {
        name: "evento completo"
      }
    ],
    priceFrom: 4000,
    priceRange: "4000-12.000 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-006",
    name: "Hotel Restaurante Usategieta",
    category: "localizacion",
    region: "Gipuzkoa",
    phone: "+34 943 490 200",
    email: "usategieta@usategieta.com",
    website: "https://usategieta.com/",
    capacity: 180,
    styleTags: [
      "rústico",
      "naturaleza",
      "caserío",
      "jardines"
    ],
    reliability: 8,
    responseTimeHours: 14,
    previousExperience: 5,
    qualityScore: 8,
    commissionFree: true,
    notes: "Hotel rural de arquitectura tradicional vasca rodeado de verdes prados en Oiartzun.",
    lat: 43.3224,
    lng: -1.8517,
    images: [
      "https://usategieta.com/wp-content/uploads/2021/10/Natural-Summer-0042-Usateguieta-2048x1365.jpg",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://usategieta.com/",
    sourceUrl: "https://usategieta.com/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Hotel%20Restaurante%20Usategieta%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "espacio"
      },
      {
        name: "banquete"
      },
      {
        name: "evento completo"
      }
    ],
    priceFrom: 4000,
    priceRange: "4000-12.000 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-007",
    name: "Hotel Urdanibia Park",
    category: "localizacion",
    region: "Gipuzkoa",
    phone: "+34 943 630 440",
    email: "recepcion@hotelurdanibiapark.com",
    website: "https://www.hotelurdanibia.com/es/eventos",
    capacity: 450,
    styleTags: [
      "hotel",
      "salones-grandes",
      "golf",
      "banquete"
    ],
    reliability: 9,
    responseTimeHours: 12,
    previousExperience: 14,
    qualityScore: 8,
    commissionFree: true,
    notes: "Hotel Urdanibia Park confirmado para bodas, bautizos, comuniones y eventos en Irun.",
    lat: 43.334,
    lng: -1.8197,
    images: [
      "https://www.hotelurdanibia.com/idb/17052/hotel-001-1200x800.jpg",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://www.hotelurdanibia.com/es/eventos",
    sourceUrl: "https://www.hotelurdanibia.com/es/eventos",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Hotel%20Urdanibia%20Park%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "espacio"
      },
      {
        name: "banquete"
      },
      {
        name: "evento completo"
      }
    ],
    priceFrom: 4000,
    priceRange: "4000-12.000 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-008",
    name: "Hotel Dolarea",
    category: "localizacion",
    region: "Gipuzkoa",
    phone: "+34 943 089 808",
    email: "info@hoteldolarea.com",
    website: "https://www.hoteldolarea.com/en/events",
    capacity: 140,
    styleTags: [
      "caserío",
      "histórico",
      "monumento",
      "íntimo"
    ],
    reliability: 9,
    responseTimeHours: 10,
    previousExperience: 7,
    qualityScore: 9,
    commissionFree: true,
    notes: "Hotel Dolarea confirmado para eventos, bodas y celebraciones familiares.",
    lat: 43.0477,
    lng: -2.2082,
    images: [
      "https://turismo.euskadi.eus/contenidos/a_alojamiento/0000041521_a1_rec_turismo/es_41521/images/FP_dolarea.jpg",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://www.hoteldolarea.com/en/events",
    sourceUrl: "https://www.hoteldolarea.com/en/events",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Hotel%20Dolarea%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "espacio"
      },
      {
        name: "banquete"
      },
      {
        name: "evento completo"
      }
    ],
    priceFrom: 4000,
    priceRange: "4000-12.000 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-009",
    name: "EtxeAundi Hotel Boutique",
    category: "localizacion",
    region: "Gipuzkoa",
    phone: "+34 943 781 912",
    email: "info@etxeaundi.com",
    website: "https://etxeaundi.com/",
    capacity: 220,
    styleTags: [
      "casa-torre",
      "histórico",
      "jardín",
      "exclusivo"
    ],
    reliability: 9,
    responseTimeHours: 12,
    previousExperience: 6,
    qualityScore: 9,
    commissionFree: true,
    notes: "Antigua casa torre de los siglos XIII y XIV convertida en hotel boutique en Oñati.",
    lat: 43.0444,
    lng: -2.4264,
    images: [
      "https://www.etxeaundi.com/wp-content/uploads/2022/03/el-hotel-generalv2-1024x1024.jpg",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://etxeaundi.com/",
    sourceUrl: "https://etxeaundi.com/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=EtxeAundi%20Hotel%20Boutique%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "espacio"
      },
      {
        name: "banquete"
      },
      {
        name: "evento completo"
      }
    ],
    priceFrom: 4000,
    priceRange: "4000-12.000 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-010",
    name: "Hotel Talasoterapia Zelai",
    category: "localizacion",
    region: "Gipuzkoa",
    phone: "+34 943 865 100",
    email: "info@hotelzelai.com",
    website: "https://www.talasoterapiazelai.com/es-ES/index.aspx",
    capacity: 130,
    styleTags: [
      "acantilado",
      "flysch",
      "vistas-mar",
      "talaso"
    ],
    reliability: 8,
    responseTimeHours: 12,
    previousExperience: 4,
    qualityScore: 8,
    commissionFree: true,
    notes: "Establecimiento de talasoterapia situado sobre la playa de Itzurun en Zumaia.",
    lat: 43.2988,
    lng: -2.2612,
    images: [
      "https://www.talasoterapiazelai.com/images/slides/Talaso-Zelai-Home-Fachada.jpg",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://www.talasoterapiazelai.com/es-ES/index.aspx",
    sourceUrl: "https://www.talasoterapiazelai.com/es-ES/index.aspx",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Hotel%20Talasoterapia%20Zelai%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "espacio"
      },
      {
        name: "banquete"
      },
      {
        name: "evento completo"
      }
    ],
    priceFrom: 4000,
    priceRange: "4000-12.000 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-011",
    name: "Restaurante Lasa - Palacio de Ozaeta",
    category: "localizacion",
    region: "Gipuzkoa",
    phone: "",
    email: "",
    website: "https://restaurantelasa.es/",
    capacity: 240,
    styleTags: [
      "palacio",
      "monumento",
      "histórico",
      "jardines"
    ],
    reliability: 7,
    responseTimeHours: 24,
    previousExperience: 3,
    qualityScore: 8,
    commissionFree: true,
    notes: "Restaurante Lasa opera el Palacio de Ozaeta como espacio de bodas y banquetes en Bergara.",
    lat: 43.118,
    lng: -2.408,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Vergara_%28Guip%C3%BAzcoa%29-Palacio_Ozaeta-1.jpg/1920px-Vergara_%28Guip%C3%BAzcoa%29-Palacio_Ozaeta-1.jpg",
      "https://images.unsplash.com/photo-1541976844346-f18aeac57b06?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://restaurantelasa.es/",
    sourceUrl: "https://restaurantelasa.es/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Restaurante%20Lasa%20Palacio%20de%20Ozaeta%20Bergara",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "espacio"
      },
      {
        name: "banquete"
      },
      {
        name: "evento completo"
      }
    ],
    priceFrom: 4000,
    priceRange: "4000-12.000 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-012",
    name: "Hotel Santa Catalina LHR",
    category: "localizacion",
    region: "Gran Canaria",
    phone: "+34 928 262 244",
    email: "santacatalina@royalhideaway.com",
    website: "https://www.barcelo.com/es-es/santa-catalina-a-royal-hideaway-hotel/",
    capacity: 400,
    styleTags: [
      "hotel",
      "colonial",
      "lujo",
      "histórico"
    ],
    reliability: 10,
    responseTimeHours: 4,
    previousExperience: 14,
    qualityScore: 10,
    commissionFree: false,
    notes: "Santa Catalina, a Royal Hideaway Hotel, confirmado como hotel real con oferta/experiencia de bodas.",
    lat: 28.1205,
    lng: -15.4285,
    images: [
      "https://hotelroyal.com.es/data/Photos/Big/17564/1756401/1756401329/Santa-Catalina-A-Royal-Hideaway-Hotel-Gran-Lujo-Las-Palmas-de-Gran-Canaria-Exterior.JPEG",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gran Canaria",
    serviceArea: "Gran Canaria",
    contactUrl: "https://www.barcelo.com/es-es/santa-catalina-a-royal-hideaway-hotel/",
    sourceUrl: "https://www.barcelo.com/es-es/santa-catalina-a-royal-hideaway-hotel/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Hotel%20Santa%20Catalina%20LHR%20Gran%20Canaria",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "espacio"
      },
      {
        name: "banquete"
      },
      {
        name: "evento completo"
      }
    ],
    priceFrom: 4000,
    priceRange: "4000-12.000 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-013",
    name: "Finca La Gañanía",
    category: "localizacion",
    region: "Tenerife",
    phone: "+34 922 376 204",
    email: "comercial@laganania.com",
    website: "https://laganania.com/bodas/",
    capacity: 250,
    styleTags: [
      "finca",
      "hacienda",
      "patios",
      "platanera"
    ],
    reliability: 9,
    responseTimeHours: 8,
    previousExperience: 9,
    qualityScore: 9,
    commissionFree: true,
    notes: "Finca La Ga?an?a confirmada como finca y catering para bodas civiles en Tenerife.",
    lat: 28.4069,
    lng: -16.5218,
    images: [
      "https://cdn0.bodas.net/vendor/2071/3_2/1280/jpg/dsc-0186_1_2071-175008780016560.jpeg",
      "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1562663474-6cbb3fee4c77?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Tenerife",
    serviceArea: "Tenerife",
    contactUrl: "https://laganania.com/bodas/",
    sourceUrl: "https://laganania.com/bodas/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Finca%20La%20Ga%C3%B1an%C3%ADa%20Tenerife",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "espacio"
      },
      {
        name: "banquete"
      },
      {
        name: "evento completo"
      }
    ],
    priceFrom: 4000,
    priceRange: "4000-12.000 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-015",
    name: "Restaurante Mugaritz",
    category: "restauracion",
    region: "Gipuzkoa",
    phone: "+34 943 522 455",
    email: "info@mugaritz.com",
    website: "https://www.mugaritz.com/",
    capacity: 170,
    styleTags: [
      "michelin",
      "vanguardia",
      "jardín",
      "creative"
    ],
    reliability: 10,
    responseTimeHours: 8,
    previousExperience: 6,
    qualityScore: 10,
    commissionFree: true,
    notes: "Espacio gastronómico con dos estrellas Michelin de Andoni Luis Aduriz en Errenteria.",
    lat: 43.2722,
    lng: -1.9172,
    images: [
      "https://console.listae.com/files/2015/10/restaurante_mugaritz_exteriores.jpg",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://www.mugaritz.com/",
    sourceUrl: "https://www.mugaritz.com/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Restaurante%20Mugaritz%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "catering"
      },
      {
        name: "menu boda"
      },
      {
        name: "cocktail"
      }
    ],
    priceFrom: 80,
    priceRange: "80-220 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-016",
    name: "Restaurante Akelarre",
    category: "restauracion",
    region: "Gipuzkoa",
    phone: "+34 943 311 209",
    email: "akelarre@akelarre.net",
    website: "https://akelarre.net/",
    capacity: 120,
    styleTags: [
      "michelin-3",
      "alta-cocina",
      "vistas-mar",
      "premium"
    ],
    reliability: 10,
    responseTimeHours: 6,
    previousExperience: 8,
    qualityScore: 10,
    commissionFree: true,
    notes: "Restaurante 3 estrellas Michelin de Pedro Subijana situado en el monte Igueldo de San Sebastián.",
    lat: 43.3108,
    lng: -2.0469,
    images: [
      "https://akelarre.net/wp-content/uploads/2021/05/AKELARRE-RESERVAR-RESTUARANTE.jpg",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://akelarre.net/",
    sourceUrl: "https://akelarre.net/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Restaurante%20Akelarre%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "catering"
      },
      {
        name: "menu boda"
      },
      {
        name: "cocktail"
      }
    ],
    priceFrom: 80,
    priceRange: "80-220 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-017",
    name: "Restaurante Elkano",
    category: "restauracion",
    region: "Gipuzkoa",
    phone: "+34 943 896 002",
    email: "elkano@restauranteelkano.com",
    website: "https://www.restauranteelkano.com/",
    capacity: 80,
    styleTags: [
      "parrilla",
      "michelin",
      "marisco",
      "tradicional"
    ],
    reliability: 9,
    responseTimeHours: 12,
    previousExperience: 4,
    qualityScore: 10,
    commissionFree: true,
    notes: "Templo del rodaballo a la parrilla galardonado con estrella Michelin en Getaria.",
    lat: 43.303,
    lng: -2.205,
    images: [
      "https://www.restauranteelkano.com/wp-content/uploads/2026/03/restaurante-elkano-mar-de-brasas.jpg",
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://www.restauranteelkano.com/",
    sourceUrl: "https://www.restauranteelkano.com/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Restaurante%20Elkano%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "catering"
      },
      {
        name: "menu boda"
      },
      {
        name: "cocktail"
      }
    ],
    priceFrom: 80,
    priceRange: "80-220 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-018",
    name: "Restaurante Karlos Arguiñano",
    category: "restauracion",
    region: "Gipuzkoa",
    phone: "+34 943 130 000",
    email: "karlos@hotelka.com",
    website: "https://www.hotelka.com/",
    capacity: 180,
    styleTags: [
      "tradicional",
      "frente-playa",
      "popular",
      "vasco"
    ],
    reliability: 9,
    responseTimeHours: 10,
    previousExperience: 10,
    qualityScore: 9,
    commissionFree: true,
    notes: "Hotel y restaurante de cocina de mercado de la familia Arguiñano en la playa de Zarautz.",
    lat: 43.2882,
    lng: -2.1629,
    images: [
      "https://fotos.hoteles.net/articulos/hotel-restaurante-karlos-arguinano-zarautz-8581-1.jpg",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://www.hotelka.com/",
    sourceUrl: "https://www.hotelka.com/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Restaurante%20Karlos%20Argui%C3%B1ano%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "catering"
      },
      {
        name: "menu boda"
      },
      {
        name: "cocktail"
      }
    ],
    priceFrom: 80,
    priceRange: "80-220 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-019",
    name: "Restaurante Sutan",
    category: "restauracion",
    region: "Gipuzkoa",
    phone: "+34 943 514 276",
    email: "sutan@hiruzta.com",
    website: "https://sutan.eus/bodas/",
    capacity: 200,
    styleTags: [
      "bodega",
      "moderno",
      "jaizkibel",
      "cocina-vasca"
    ],
    reliability: 9,
    responseTimeHours: 10,
    previousExperience: 6,
    qualityScore: 9,
    commissionFree: true,
    notes: "Restaurante Sutan confirmado como espacio de bodas dentro de Hiruzta.",
    lat: 43.3444,
    lng: -1.8124,
    images: [
      "https://www.hiruzta.com/wp-content/uploads/2020/11/Hiruzta-bodega.jpg",
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1528254847117-67891fa133b8?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://sutan.eus/bodas/",
    sourceUrl: "https://sutan.eus/bodas/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Restaurante%20Sutan%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "catering"
      },
      {
        name: "menu boda"
      },
      {
        name: "cocktail"
      }
    ],
    priceFrom: 80,
    priceRange: "80-220 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-020",
    name: "Petritegi Sagardotegia",
    category: "restauracion",
    region: "Gipuzkoa",
    phone: "+34 943 457 188",
    email: "sagardotegia@petritegi.com",
    website: "https://www.petritegi.com/",
    capacity: 400,
    styleTags: [
      "sidrería",
      "tradicional",
      "brasa",
      "popular"
    ],
    reliability: 9,
    responseTimeHours: 8,
    previousExperience: 14,
    qualityScore: 8,
    commissionFree: true,
    notes: "Histórica sidrería con cinco siglos de tradición en Astigarraga.",
    lat: 43.2907,
    lng: -1.941,
    images: [
      "https://www.sagardoa.eus/img/tmp/manufacturer_12_resized.jpg?time=1782986459",
      "https://images.unsplash.com/photo-1528254847117-67891fa133b8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://www.petritegi.com/",
    sourceUrl: "https://www.petritegi.com/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Petritegi%20Sagardotegia%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "catering"
      },
      {
        name: "menu boda"
      },
      {
        name: "cocktail"
      }
    ],
    priceFrom: 80,
    priceRange: "80-220 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-021",
    name: "Restaurante Sansonategi",
    category: "restauracion",
    region: "Gipuzkoa",
    phone: "+34 943 553 454",
    email: "info@sansonategi.com",
    website: "https://www.sansonategi.com/",
    capacity: 180,
    styleTags: [
      "caserío",
      "vistas-monte",
      "jardines",
      "vasco-moderno"
    ],
    reliability: 9,
    responseTimeHours: 10,
    previousExperience: 8,
    qualityScore: 9,
    commissionFree: true,
    notes: "Caserío en un entorno natural montañoso con vistas panorámicas en Hernani.",
    lat: 43.2858,
    lng: -1.9607,
    images: [
      "https://sansonategi.com/wp-content/uploads/2025/02/sanso.jpg",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://www.sansonategi.com/",
    sourceUrl: "https://www.sansonategi.com/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Restaurante%20Sansonategi%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "catering"
      },
      {
        name: "menu boda"
      },
      {
        name: "cocktail"
      }
    ],
    priceFrom: 80,
    priceRange: "80-220 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-022",
    name: "Restaurante Salegi",
    category: "restauracion",
    region: "Gipuzkoa",
    phone: "+34 943 199 036",
    email: "salegi@salegi.com",
    website: "https://salegi.com/",
    capacity: 300,
    styleTags: [
      "banquetes",
      "jardín",
      "clásico",
      "itziar"
    ],
    reliability: 9,
    responseTimeHours: 8,
    previousExperience: 10,
    qualityScore: 9,
    commissionFree: true,
    notes: "Restaurante de banquetes tradicional vasco con amplios comedores y jardines en Itziar (Deba).",
    lat: 43.2762,
    lng: -2.3319,
    images: [
      "https://www.guiarepsol.com/content/dam/repsol-guia/guia-cf/restaurante/imagenes/media-filer_public-d4-25-d42504ca-6d30-4d94-9748-399402f10d4d-23975-salegi-jatetxea-95f2bffea72b447ca5f35c6200bf5360.jpeg",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://salegi.com/",
    sourceUrl: "https://salegi.com/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Restaurante%20Salegi%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "catering"
      },
      {
        name: "menu boda"
      },
      {
        name: "cocktail"
      }
    ],
    priceFrom: 80,
    priceRange: "80-220 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-023",
    name: "Restaurante Botarri",
    category: "restauracion",
    region: "Gipuzkoa",
    phone: "+34 943 654 621",
    email: "botarri@botarri.eus",
    website: "https://www.botarri.com/",
    capacity: 80,
    styleTags: [
      "asador",
      "tolosa",
      "carnes",
      "tradicional"
    ],
    reliability: 8,
    responseTimeHours: 12,
    previousExperience: 4,
    qualityScore: 8,
    commissionFree: true,
    notes: "Restaurante Botarri Jatetxea confirmado para celebraciones y eventos familiares.",
    lat: 43.136,
    lng: -2.077,
    images: [
      "https://www.ondojan.com/images/sobipro/entries/295/img__MG_3969.jpg",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://www.botarri.com/nuestros-menus/",
    sourceUrl: "https://www.botarri.com/nuestros-menus/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Restaurante%20Botarri%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "catering"
      },
      {
        name: "menu boda"
      },
      {
        name: "cocktail"
      }
    ],
    priceFrom: 80,
    priceRange: "80-220 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-024",
    name: "Restaurante Kiruri",
    category: "restauracion",
    region: "Gipuzkoa",
    phone: "+34 943 815 608",
    email: "info@kiruri.com",
    website: "https://kiruri-jatetxea.webnode.es/turismo/",
    capacity: 800,
    styleTags: [
      "grandes-bodas",
      "loyola",
      "banquetes",
      "clásico"
    ],
    reliability: 9,
    responseTimeHours: 10,
    previousExperience: 15,
    qualityScore: 9,
    commissionFree: true,
    notes: "Restaurante Kiruri confirmado en fuentes nupciales y directorios de eventos.",
    lat: 43.1754,
    lng: -2.2858,
    images: [
      "https://www.guide-du-paysbasque.com/_bibli/annonces/8311/hd/kiruri-jatetxea-24-01.png",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://www.bodas.net/restaurantes/restaurante-kiruri--e62724",
    sourceUrl: "https://www.bodas.net/restaurantes/restaurante-kiruri--e62724",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Restaurante%20Kiruri%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "catering"
      },
      {
        name: "menu boda"
      },
      {
        name: "cocktail"
      }
    ],
    priceFrom: 80,
    priceRange: "80-220 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-025",
    name: "Ixua Hotela",
    category: "restauracion",
    region: "Gipuzkoa",
    phone: "+34 943 12 12 72",
    email: "",
    website: "https://ixuahotela.com/en/home/",
    capacity: 50,
    styleTags: [
      "asador-montaña",
      "íntimo",
      "parrilla",
      "rústico"
    ],
    reliability: 8,
    responseTimeHours: 14,
    previousExperience: 3,
    qualityScore: 8,
    commissionFree: true,
    notes: "Ixua Hotela confirmado como hotel y restaurante real en Eibar.",
    lat: 43.2081,
    lng: -2.4767,
    images: [
      "https://ixuahotela.com/wp-content/uploads/entrada-ixua-hotel-1.jpg",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://ixuahotela.com/en/home/",
    sourceUrl: "https://ixuahotela.com/en/home/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Ixua%20Jatetxea%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "catering"
      },
      {
        name: "menu boda"
      },
      {
        name: "cocktail"
      }
    ],
    priceFrom: 80,
    priceRange: "80-220 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-028",
    name: "Restaurante Isla de Lobos",
    category: "restauracion",
    region: "Lanzarote",
    phone: "+34 928 519 222",
    email: "isladelobos@royalhideaway.com",
    website: "https://princesayaiza.com/gastronomia/isla-de-lobos/",
    capacity: 180,
    styleTags: [
      "michelin-reco",
      "slow-food",
      "vistas-mar",
      "lujo"
    ],
    reliability: 9,
    responseTimeHours: 8,
    previousExperience: 5,
    qualityScore: 9,
    commissionFree: true,
    notes: "Cocina gourmet de kilómetro cero frente a Fuerteventura en Playa Blanca (Lanzarote).",
    lat: 28.8596,
    lng: -13.8295,
    images: [
      "https://princesayaiza.com/wp-content/uploads/2025/04/2698-restaurante-isla-de-lobos-hotel-princesa-yaiza-7.jpg",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Lanzarote",
    serviceArea: "Lanzarote",
    contactUrl: "https://princesayaiza.com/gastronomia/isla-de-lobos/",
    sourceUrl: "https://princesayaiza.com/gastronomia/isla-de-lobos/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Restaurante%20Isla%20de%20Lobos%20Lanzarote",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "catering"
      },
      {
        name: "menu boda"
      },
      {
        name: "cocktail"
      }
    ],
    priceFrom: 80,
    priceRange: "80-220 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-029",
    name: "Mesa Presidencial",
    category: "decoracion",
    region: "Gipuzkoa",
    phone: "+34 688 888 111",
    email: "hola@mesapresidencial.com",
    website: "https://mesapresidencial.com/",
    capacity: 0,
    styleTags: [
      "decoración",
      "mobiliario",
      "diseño",
      "elegante"
    ],
    reliability: 10,
    responseTimeHours: 4,
    previousExperience: 11,
    qualityScore: 10,
    commissionFree: true,
    notes: "Estudio de decoración y estilismo nupcial especializado en crear ambientes elegantes y sofisticados en San Sebastián.",
    lat: 43.321,
    lng: -1.983,
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://mesapresidencial.com/",
    sourceUrl: "https://mesapresidencial.com/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Mesa%20Presidencial%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "decoracion"
      },
      {
        name: "ambientacion"
      }
    ],
    priceFrom: 1500,
    priceRange: "1500-5000 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-030",
    name: "Jairom Black",
    category: "decoracion",
    region: "Gipuzkoa",
    phone: "+34 943 505 505",
    email: "info@jairomblack.com",
    website: "https://www.instagram.com/jairomblack/",
    capacity: 0,
    styleTags: [
      "iluminación",
      "letras-luces",
      "stands",
      "retro"
    ],
    reliability: 9,
    responseTimeHours: 6,
    previousExperience: 14,
    qualityScore: 9,
    commissionFree: true,
    notes: "Jairom Black confirmado como m?sica/DJ para bodas; se sustituye web comprometida por fuentes sociales/directorio.",
    lat: 43.138,
    lng: -2.079,
    images: [
      "https://images.unsplash.com/photo-1519225495810-7512ca3df7ee?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://www.bodas.net/musica/jairom-black--e58558",
    sourceUrl: "https://www.bodas.net/musica/jairom-black--e58558",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Jairom%20Black%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "decoracion"
      },
      {
        name: "ambientacion"
      }
    ],
    priceFrom: 1500,
    priceRange: "1500-5000 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-031",
    name: "D-Bodas Decoraciones",
    category: "decoracion",
    region: "Gran Canaria",
    phone: "+34 600 222 333",
    email: "deco@d-bodas.com",
    website: "",
    capacity: 0,
    styleTags: [
      "styling",
      "boho",
      "vintage",
      "altar"
    ],
    reliability: 9,
    responseTimeHours: 5,
    previousExperience: 10,
    qualityScore: 9,
    commissionFree: true,
    notes: "D-bodas aparece en directorios nupciales como wedding planner en Las Palmas; web propia no validada.",
    lat: 28.115,
    lng: -15.43,
    images: [
      "https://images.unsplash.com/photo-1519225495810-7512ca3df7ee?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gran Canaria",
    serviceArea: "Gran Canaria",
    contactUrl: "https://www.todoboda.com/bodas/proveedores/wedding-planners/las-palmas/las-palmas-de-gran-canaria",
    sourceUrl: "https://www.todoboda.com/bodas/proveedores/wedding-planners/las-palmas/las-palmas-de-gran-canaria",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=D-Bodas%20Decoraciones%20Gran%20Canaria",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "decoracion"
      },
      {
        name: "ambientacion"
      }
    ],
    priceFrom: 1500,
    priceRange: "1500-5000 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-034",
    name: "Flowers & Co",
    category: "floristeria",
    region: "Gipuzkoa",
    phone: "+34 943 424 242",
    email: "flores@flowersandco.es",
    website: "https://flowersandco.es/",
    capacity: 0,
    styleTags: [
      "clásico",
      "rosas",
      "iglesias",
      "elegante"
    ],
    reliability: 10,
    responseTimeHours: 6,
    previousExperience: 15,
    qualityScore: 9,
    commissionFree: true,
    notes: "Taller floral clásico en el centro de San Sebastián especializado en arreglos florales nupciales.",
    lat: 43.32,
    lng: -1.978,
    images: [
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://flowersandco.es/",
    sourceUrl: "https://flowersandco.es/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Flowers%20%26%20Co%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "ramo"
      },
      {
        name: "ceremonia"
      },
      {
        name: "centros de mesa"
      }
    ],
    priceFrom: 1500,
    priceRange: "1500-5000 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-038",
    name: "Demode Quartet",
    category: "musica",
    region: "Gipuzkoa",
    phone: "+34 677 888 999",
    email: "contratacion@demodequartet.com",
    website: "https://demodequartet.com/",
    capacity: 0,
    styleTags: [
      "a-capella",
      "humor",
      "show",
      "cóctel"
    ],
    reliability: 9,
    responseTimeHours: 8,
    previousExperience: 15,
    qualityScore: 10,
    commissionFree: true,
    notes: "Espectáculo musical a capella con toques de humor y arreglos de temas pop/rock para el cóctel.",
    lat: 43.312,
    lng: -1.99,
    images: [
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://demodequartet.com/",
    sourceUrl: "https://demodequartet.com/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Demode%20Quartet%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "se-desplaza",
    packages: [
      {
        name: "musica en directo"
      },
      {
        name: "ceremonia"
      },
      {
        name: "cocktail"
      }
    ],
    priceFrom: 500,
    priceRange: "500-1800 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-041",
    name: "Sonido Norte",
    category: "dj",
    region: "Gipuzkoa",
    phone: "+34 944 000 555",
    email: "eventos@sonidonorte.es",
    website: "https://sonidonorte.es/",
    capacity: 0,
    styleTags: [
      "sonido",
      "dj",
      "iluminacion",
      "fiesta"
    ],
    reliability: 9,
    responseTimeHours: 6,
    previousExperience: 15,
    qualityScore: 9,
    commissionFree: true,
    notes: "Empresa líder de sonido profesional, iluminación robótica y DJs en el País Vasco.",
    lat: 43.263,
    lng: -2.935,
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://sonidonorte.es/",
    sourceUrl: "https://sonidonorte.es/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Sonido%20Norte%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "se-desplaza",
    packages: [
      {
        name: "dj boda"
      },
      {
        name: "sonido"
      },
      {
        name: "iluminacion"
      }
    ],
    priceFrom: 500,
    priceRange: "500-1800 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-042",
    name: "Bengoa DJ",
    category: "dj",
    region: "Gipuzkoa",
    phone: "+34 688 999 000",
    email: "hola@bengoadj.com",
    website: "",
    capacity: 0,
    styleTags: [
      "dj-autor",
      "electrónica",
      "fiestón",
      "vinilo"
    ],
    reliability: 10,
    responseTimeHours: 4,
    previousExperience: 12,
    qualityScore: 10,
    commissionFree: true,
    notes: "Bengoa DJ confirmado en reportajes de bodas reales en Gipuzkoa.",
    lat: 43.319,
    lng: -1.984,
    images: [
      "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://fotogoverbodas.com/boda-en-finca-machoenia-leyre-y-boris/",
    sourceUrl: "https://fotogoverbodas.com/boda-en-finca-machoenia-leyre-y-boris/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Bengoa%20DJ%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "se-desplaza",
    packages: [
      {
        name: "dj boda"
      },
      {
        name: "sonido"
      },
      {
        name: "iluminacion"
      }
    ],
    priceFrom: 500,
    priceRange: "500-1800 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-047",
    name: "Luz de Arena Fotografía",
    category: "fotografia",
    region: "Gran Canaria",
    phone: "+34 928 000 666",
    email: "hola@luzdearena.com",
    website: "https://luzdearena.com/",
    capacity: 0,
    styleTags: [
      "fotografía",
      "luz-natural",
      "playa",
      "canarias"
    ],
    reliability: 9,
    responseTimeHours: 6,
    previousExperience: 10,
    qualityScore: 9,
    commissionFree: true,
    notes: "Estudio de fotógrafos de bodas en Las Palmas de Gran Canaria especializados en luz natural.",
    lat: 28.1235,
    lng: -15.4363,
    images: [
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gran Canaria",
    serviceArea: "Gran Canaria",
    contactUrl: "https://luzdearena.com/",
    sourceUrl: "https://luzdearena.com/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Luz%20de%20Arena%20Fotograf%C3%ADa%20Gran%20Canaria",
    languages: [
      "castellano"
    ],
    availabilityType: "se-desplaza",
    packages: [
      {
        name: "reportaje completo"
      },
      {
        name: "preboda"
      },
      {
        name: "album"
      }
    ],
    priceFrom: 1200,
    priceRange: "1200-2800 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-050",
    name: "Reflejos Digitales",
    category: "videografia",
    region: "Gipuzkoa",
    phone: "+34 943 000 111",
    email: "info@reflejosdigitales.com",
    website: "https://reflejosdigitales.com/",
    capacity: 0,
    styleTags: [
      "video",
      "tradicional",
      "entrevistas",
      "boda-vasca"
    ],
    reliability: 9,
    responseTimeHours: 8,
    previousExperience: 16,
    qualityScore: 9,
    commissionFree: true,
    notes: "Reportajes de video tradicionales de gran cobertura en Tolosa y el interior de Gipuzkoa.",
    lat: 43.136,
    lng: -2.076,
    images: [
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://reflejosdigitales.com/",
    sourceUrl: "https://reflejosdigitales.com/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Reflejos%20Digitales%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "se-desplaza",
    packages: [
      {
        name: "video boda"
      },
      {
        name: "trailer"
      },
      {
        name: "documental"
      }
    ],
    priceFrom: 1200,
    priceRange: "1200-2800 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-057",
    name: "Maquillaje Las Palmas",
    category: "peluqueria-maquillaje",
    region: "Gran Canaria",
    phone: "+34 633 999 888",
    email: "estudio@maquillajelaspalmas.com",
    website: "",
    capacity: 0,
    styleTags: [
      "maquillaje-aerógrafo",
      "glam",
      "novia-playa",
      "natural"
    ],
    reliability: 10,
    responseTimeHours: 5,
    previousExperience: 8,
    qualityScore: 10,
    commissionFree: true,
    notes: "Maquillaje Las Palmas confirmado como proveedor de belleza para novias en Las Palmas.",
    lat: 28.116,
    lng: -15.426,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gran Canaria",
    serviceArea: "Gran Canaria",
    contactUrl: "https://www.bodas.net/belleza-novias/maquillaje-las-palmas--e128197",
    sourceUrl: "https://www.bodas.net/belleza-novias/maquillaje-las-palmas--e128197",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Maquillaje%20Las%20Palmas%20Gran%20Canaria",
    languages: [
      "castellano"
    ],
    availabilityType: "se-desplaza",
    packages: [
      {
        name: "maquillaje novia"
      },
      {
        name: "peinado"
      },
      {
        name: "prueba"
      }
    ],
    priceFrom: 300,
    priceRange: "300-800 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-060",
    name: "Autocares David",
    category: "transporte",
    region: "Gipuzkoa",
    phone: "+34 943 361 633",
    email: "info@autocaresdavid.com",
    website: "https://autocaresdavid.com/",
    capacity: 60,
    styleTags: [
      "autobús",
      "mini-bus",
      "aeropuerto",
      "traslados"
    ],
    reliability: 9,
    responseTimeHours: 14,
    previousExperience: 25,
    qualityScore: 9,
    commissionFree: true,
    notes: "Alquiler de autocares de varias capacidades y minibuses VIP en Usurbil.",
    lat: 43.272,
    lng: -2.043,
    images: [
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://autocaresdavid.com/",
    sourceUrl: "https://autocaresdavid.com/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Autocares%20David%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "se-desplaza",
    packages: [
      {
        name: "traslados invitados"
      },
      {
        name: "coche novios"
      }
    ],
    priceFrom: 450,
    priceRange: "450-950 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-062",
    name: "Autobuses Mesa",
    category: "transporte",
    region: "Tenerife",
    phone: "+34 922 474 849",
    email: "reservas@autobusesmesa.es",
    website: "https://www.autobusesmesa.es/",
    capacity: 55,
    styleTags: [
      "transporte-vip",
      "guagua",
      "turismo-nupcial"
    ],
    reliability: 9,
    responseTimeHours: 12,
    previousExperience: 22,
    qualityScore: 9,
    commissionFree: true,
    notes: "Servicio integral de guaguas para bodas y transporte personalizado de invitados en Tenerife.",
    lat: 28.471,
    lng: -16.258,
    images: [
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Tenerife",
    serviceArea: "Tenerife",
    contactUrl: "https://www.autobusesmesa.es/",
    sourceUrl: "https://www.autobusesmesa.es/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Autobuses%20Mesa%20Tenerife",
    languages: [
      "castellano"
    ],
    availabilityType: "se-desplaza",
    packages: [
      {
        name: "traslados invitados"
      },
      {
        name: "coche novios"
      }
    ],
    priceFrom: 450,
    priceRange: "450-950 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-063",
    name: "Estudio Requetebién",
    category: "papeleria",
    region: "Gipuzkoa",
    phone: "+34 644 222 111",
    email: "estudio@requetebien.com",
    website: "https://estudiorequetebien.com/",
    capacity: 0,
    styleTags: [
      "diseño-gráfico",
      "papel-algodón",
      "caligrafía",
      "branding"
    ],
    reliability: 10,
    responseTimeHours: 6,
    previousExperience: 8,
    qualityScore: 10,
    commissionFree: true,
    notes: "Estudio Requetebi?n confirmado como estudio de invitaciones y papeler?a de boda.",
    lat: 43.321,
    lng: -1.979,
    images: [
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://estudiorequetebien.com/",
    sourceUrl: "https://estudiorequetebien.com/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Estudio%20Requetebi%C3%A9n%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "invitaciones"
      },
      {
        name: "minutas"
      },
      {
        name: "seating plan"
      }
    ],
    priceFrom: 350,
    priceRange: "350-1200 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-066",
    name: "Pastelería Otaegui",
    category: "reposteria",
    region: "Gipuzkoa",
    phone: "+34 943 425 416",
    email: "pedidos@pasteleriaotaegui.com",
    website: "https://pasteleriaotaegui.com/",
    capacity: 0,
    styleTags: [
      "tartas-clásicas",
      "hojaldre",
      "tradicional",
      "histórico"
    ],
    reliability: 10,
    responseTimeHours: 12,
    previousExperience: 50,
    qualityScore: 10,
    commissionFree: true,
    notes: "Legendaria pastelería de San Sebastián fundada en 1886 famosa por sus tartas de boda clásicas y hojaldres reales.",
    lat: 43.324,
    lng: -1.984,
    images: [
      "https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://pasteleriaotaegui.com/",
    sourceUrl: "https://pasteleriaotaegui.com/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Pasteler%C3%ADa%20Otaegui%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "tarta boda"
      },
      {
        name: "mesa dulce"
      }
    ],
    priceFrom: 350,
    priceRange: "350-1200 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-067",
    name: "Sweet Lulú Zarautz",
    category: "reposteria",
    region: "Gipuzkoa",
    phone: "+34 600 444 333",
    email: "info@sweetlulu.es",
    website: "https://sweetlulu.es/",
    capacity: 0,
    styleTags: [
      "naked-cake",
      "cupcakes",
      "mesas-dulces",
      "moderno"
    ],
    reliability: 9,
    responseTimeHours: 6,
    previousExperience: 8,
    qualityScore: 9,
    commissionFree: true,
    notes: "Taller de repostería creativa especializado en naked cakes, macarons y mesas dulces rústicas en Zarautz.",
    lat: 43.284,
    lng: -2.169,
    images: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://sweetlulu.es/",
    sourceUrl: "https://sweetlulu.es/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Sweet%20Lul%C3%BA%20Zarautz%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "tarta boda"
      },
      {
        name: "mesa dulce"
      }
    ],
    priceFrom: 350,
    priceRange: "350-1200 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-068",
    name: "Dulce Volcán",
    category: "reposteria",
    region: "Gran Canaria",
    phone: "+34 928 333 444",
    email: "reposteria@dulcevolcan.es",
    website: "https://www.instagram.com/dulcevolcan90/",
    capacity: 0,
    styleTags: [
      "repostería",
      "tartas",
      "diseño",
      "dulces"
    ],
    reliability: 9,
    responseTimeHours: 8,
    previousExperience: 7,
    qualityScore: 9,
    commissionFree: true,
    notes: "Dulce Volc?n localizado en Instagram; mantener como proveedor a validar comercialmente antes de propuesta.",
    lat: 28.105,
    lng: -15.42,
    images: [
      "https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gran Canaria",
    serviceArea: "Gran Canaria",
    contactUrl: "https://www.instagram.com/dulcevolcan90/",
    sourceUrl: "https://www.instagram.com/dulcevolcan90/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Dulce%20Volc%C3%A1n%20Gran%20Canaria",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "tarta boda"
      },
      {
        name: "mesa dulce"
      }
    ],
    priceFrom: 350,
    priceRange: "350-1200 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-074",
    name: "Ceremonias Maite Mor?n",
    category: "oficial-ceremonia",
    region: "Gipuzkoa",
    phone: "+34 611 888 222",
    email: "maite@ceremoniasmaite.com",
    website: "",
    capacity: 0,
    styleTags: [
      "maestra-ceremonias",
      "simbólica",
      "emotiva",
      "bilingüe"
    ],
    reliability: 10,
    responseTimeHours: 4,
    previousExperience: 12,
    qualityScore: 10,
    commissionFree: true,
    notes: "Maite Mor?n localizada como maestra de ceremonias/coordinadora en fuente nupcial.",
    lat: 43.321,
    lng: -1.984,
    images: [
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://www.bodas.net/organizacion-bodas/ceremonias-jose-linaje--e142961",
    sourceUrl: "https://www.bodas.net/organizacion-bodas/ceremonias-jose-linaje--e142961",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Ceremonias%20Guip%C3%BAzcoa%20-%20Maite%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "se-desplaza",
    packages: [
      {
        name: "ceremonia simbolica"
      },
      {
        name: "guion ceremonia"
      }
    ],
    priceFrom: 350,
    priceRange: "350-1200 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-078",
    name: "Betilore Loradenda",
    category: "floristeria",
    region: "Gipuzkoa",
    phone: "943 117 220",
    email: "esetxebe@gmail.com",
    website: "https://www.facebook.com/p/Floristeria-Betilore-Loradenda-100063496753482/",
    capacity: 0,
    styleTags: [
      "flores",
      "preservadas",
      "ramos",
      "andoain"
    ],
    reliability: 9,
    responseTimeHours: 8,
    previousExperience: 12,
    qualityScore: 9,
    commissionFree: true,
    notes: "Floristeria Betilore Loradenda confirmada en Andoain con servicios de flores y bodas.",
    lat: 43.2195,
    lng: -2.023,
    images: [
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://www.facebook.com/p/Floristeria-Betilore-Loradenda-100063496753482/",
    sourceUrl: "https://www.facebook.com/p/Floristeria-Betilore-Loradenda-100063496753482/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Betilore%20Loradenda%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "ramo"
      },
      {
        name: "ceremonia"
      },
      {
        name: "centros de mesa"
      }
    ],
    priceFrom: 1500,
    priceRange: "1500-5000 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  },
  {
    id: "vendor-079",
    name: "Restaurante Txertota",
    category: "restauracion",
    region: "Gipuzkoa",
    phone: "+34 943 590 721",
    email: "info@txertota.com",
    website: "https://txertota.com/",
    capacity: 100,
    styleTags: [
      "caserío",
      "valle-leizaran",
      "jardines",
      "andoain"
    ],
    reliability: 10,
    responseTimeHours: 6,
    previousExperience: 15,
    qualityScore: 9,
    commissionFree: true,
    notes: "Encantador restaurante tipo caserío rodeado de praderas y jardines en el valle de Leizaran, Andoain.",
    lat: 43.2084,
    lng: -2.0012,
    images: [
      "https://www.txertota.com/uploads/fotos/foto_157_c.jpg",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80"
    ],
    province: "Gipuzkoa",
    serviceArea: "Gipuzkoa y Pais Vasco",
    contactUrl: "https://txertota.com/",
    sourceUrl: "https://txertota.com/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Restaurante%20Txertota%20Gipuzkoa",
    languages: [
      "castellano"
    ],
    availabilityType: "local",
    packages: [
      {
        name: "catering"
      },
      {
        name: "menu boda"
      },
      {
        name: "cocktail"
      }
    ],
    priceFrom: 80,
    priceRange: "80-220 EUR aprox.",
    priceConfidence: "media",
    reviewsSummary: "Proveedor recuperado de la base operativa inicial. Revisar opiniones actuales antes de propuesta firme.",
    notesInternal: "Registro recuperado de la base de 79 proveedores. Validar contacto, disponibilidad, tarifa e imagen antes de enviar a cliente.",
    status: "reviewed",
    lastCheckedAt: "2026-07-06"
  }
];

export const officialVendorPriceSeed: VendorPrice[] = [
  {
    id: "price-restaurante-arraiz-menu",
    vendorId: "vendor-restaurante-arraiz-bilbao",
    serviceName: "Menu de boda",
    season: "alta",
    region: "Bizkaia",
    minPrice: 165,
    maxPrice: 190,
    conditions: "Precio orientativo por persona; confirmar con proveedor.",
    historical: false
  },
  {
    id: "price-palacio-horkasitas-space",
    vendorId: "vendor-palacio-horkasitas-bizkaia",
    serviceName: "Alquiler de espacio",
    season: "alta",
    region: "Bizkaia",
    minPrice: 3000,
    maxPrice: 3200,
    conditions: "Precio orientativo de espacio; confirmar extras y proveedores obligatorios.",
    historical: false
  },
  {
    id: "price-mimiku-floral",
    vendorId: "vendor-mimiku-floristeria",
    serviceName: "Decoracion floral de boda",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 800,
    maxPrice: 1500,
    conditions: "Rango orientativo para boda; depende de piezas y montaje.",
    historical: false
  },
  {
    id: "price-gaizka-corta-reportaje",
    vendorId: "vendor-gaizka-corta-fotografia",
    serviceName: "Reportaje fotografico",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 1800,
    maxPrice: 2800,
    conditions: "Estimacion interna pendiente de propuesta oficial.",
    historical: false
  },
  {
    id: "price-001",
    vendorId: "vendor-001",
    serviceName: "Alquiler / banquete",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 4000,
    maxPrice: 12000,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-002",
    vendorId: "vendor-002",
    serviceName: "Alquiler / banquete",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 4000,
    maxPrice: 12000,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-003",
    vendorId: "vendor-003",
    serviceName: "Alquiler / banquete",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 4000,
    maxPrice: 12000,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-004",
    vendorId: "vendor-004",
    serviceName: "Alquiler / banquete",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 4000,
    maxPrice: 12000,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-005",
    vendorId: "vendor-005",
    serviceName: "Alquiler / banquete",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 4000,
    maxPrice: 12000,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-006",
    vendorId: "vendor-006",
    serviceName: "Alquiler / banquete",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 4000,
    maxPrice: 12000,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-007",
    vendorId: "vendor-007",
    serviceName: "Alquiler / banquete",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 4000,
    maxPrice: 12000,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-008",
    vendorId: "vendor-008",
    serviceName: "Alquiler / banquete",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 4000,
    maxPrice: 12000,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-009",
    vendorId: "vendor-009",
    serviceName: "Alquiler / banquete",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 4000,
    maxPrice: 12000,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-010",
    vendorId: "vendor-010",
    serviceName: "Alquiler / banquete",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 4000,
    maxPrice: 12000,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-011",
    vendorId: "vendor-011",
    serviceName: "Alquiler / banquete",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 4000,
    maxPrice: 12000,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-012",
    vendorId: "vendor-012",
    serviceName: "Alquiler / banquete",
    season: "alta",
    region: "Gran Canaria",
    minPrice: 4000,
    maxPrice: 12000,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-013",
    vendorId: "vendor-013",
    serviceName: "Alquiler / banquete",
    season: "alta",
    region: "Tenerife",
    minPrice: 4000,
    maxPrice: 12000,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-015",
    vendorId: "vendor-015",
    serviceName: "Menu / catering",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 80,
    maxPrice: 220,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-016",
    vendorId: "vendor-016",
    serviceName: "Menu / catering",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 80,
    maxPrice: 220,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-017",
    vendorId: "vendor-017",
    serviceName: "Menu / catering",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 80,
    maxPrice: 220,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-018",
    vendorId: "vendor-018",
    serviceName: "Menu / catering",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 80,
    maxPrice: 220,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-019",
    vendorId: "vendor-019",
    serviceName: "Menu / catering",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 80,
    maxPrice: 220,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-020",
    vendorId: "vendor-020",
    serviceName: "Menu / catering",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 80,
    maxPrice: 220,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-021",
    vendorId: "vendor-021",
    serviceName: "Menu / catering",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 80,
    maxPrice: 220,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-022",
    vendorId: "vendor-022",
    serviceName: "Menu / catering",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 80,
    maxPrice: 220,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-023",
    vendorId: "vendor-023",
    serviceName: "Menu / catering",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 80,
    maxPrice: 220,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-024",
    vendorId: "vendor-024",
    serviceName: "Menu / catering",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 80,
    maxPrice: 220,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-025",
    vendorId: "vendor-025",
    serviceName: "Menu / catering",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 80,
    maxPrice: 220,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-028",
    vendorId: "vendor-028",
    serviceName: "Menu / catering",
    season: "alta",
    region: "Lanzarote",
    minPrice: 80,
    maxPrice: 220,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-029",
    vendorId: "vendor-029",
    serviceName: "Servicio de boda",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 1500,
    maxPrice: 5000,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-030",
    vendorId: "vendor-030",
    serviceName: "Servicio de boda",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 1500,
    maxPrice: 5000,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-031",
    vendorId: "vendor-031",
    serviceName: "Servicio de boda",
    season: "alta",
    region: "Gran Canaria",
    minPrice: 1500,
    maxPrice: 5000,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-034",
    vendorId: "vendor-034",
    serviceName: "Servicio de boda",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 1500,
    maxPrice: 5000,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-038",
    vendorId: "vendor-038",
    serviceName: "Musica y sonido",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 500,
    maxPrice: 1800,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-041",
    vendorId: "vendor-041",
    serviceName: "Musica y sonido",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 500,
    maxPrice: 1800,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-042",
    vendorId: "vendor-042",
    serviceName: "Musica y sonido",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 500,
    maxPrice: 1800,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-047",
    vendorId: "vendor-047",
    serviceName: "Reportaje fotografico",
    season: "alta",
    region: "Gran Canaria",
    minPrice: 1200,
    maxPrice: 2800,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-050",
    vendorId: "vendor-050",
    serviceName: "Video de boda",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 1200,
    maxPrice: 2800,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-057",
    vendorId: "vendor-057",
    serviceName: "Servicio de boda",
    season: "alta",
    region: "Gran Canaria",
    minPrice: 300,
    maxPrice: 800,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-060",
    vendorId: "vendor-060",
    serviceName: "Servicio de boda",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 450,
    maxPrice: 950,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-062",
    vendorId: "vendor-062",
    serviceName: "Servicio de boda",
    season: "alta",
    region: "Tenerife",
    minPrice: 450,
    maxPrice: 950,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-063",
    vendorId: "vendor-063",
    serviceName: "Servicio de boda",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 350,
    maxPrice: 1200,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-066",
    vendorId: "vendor-066",
    serviceName: "Servicio de boda",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 350,
    maxPrice: 1200,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-067",
    vendorId: "vendor-067",
    serviceName: "Servicio de boda",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 350,
    maxPrice: 1200,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-068",
    vendorId: "vendor-068",
    serviceName: "Servicio de boda",
    season: "alta",
    region: "Gran Canaria",
    minPrice: 350,
    maxPrice: 1200,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-074",
    vendorId: "vendor-074",
    serviceName: "Servicio de boda",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 350,
    maxPrice: 1200,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-078",
    vendorId: "vendor-078",
    serviceName: "Servicio de boda",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 1500,
    maxPrice: 5000,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  },
  {
    id: "price-079",
    vendorId: "vendor-079",
    serviceName: "Menu / catering",
    season: "alta",
    region: "Gipuzkoa",
    minPrice: 80,
    maxPrice: 220,
    conditions: "Sujeto a exclusividad e IVA no incluido. Tarifas reales nupciales actualizadas. Revisar antes de enviar presupuesto final.",
    historical: true
  }
];
