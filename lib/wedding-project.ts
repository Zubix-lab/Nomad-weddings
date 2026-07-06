import type {
  Client,
  Event,
  ParejaProfile
} from "@/lib/types";

export type WeddingProjectContactInput = {
  name?: string;
  role?: string;
  phone?: string;
  email?: string;
  preferences?: string;
};

export type WeddingProjectInput = {
  clientId?: string;
  coupleName: string;
  eventName?: string;
  date: string;
  location: string;
  region: string;
  guests: number;
  budget: number;
  style: string;
  preferences?: string;
  dietaryNeeds?: string;
  riskNotes?: string;
  accommodationNeeds?: string;
  rgpdConsent?: boolean;
  clientNotes?: string;
  contactOne: WeddingProjectContactInput;
  contactTwo: WeddingProjectContactInput;
};

type WeddingProjectActions = {
  addClient: (client: Omit<Client, "id"> & { id?: string }) => string;
  addEvent: (event: Omit<Event, "id"> & { id?: string }) => string;
  addParejaProfile: (profile: Omit<ParejaProfile, "id"> & { id?: string }) => string;
  addEventService?: unknown;
  addWorkspacePage?: unknown;
  addWorkspaceBlock?: unknown;
  addCalendarItem?: unknown;
};

export type CreatedWeddingProject = {
  clientId: string;
  eventId: string;
  pageIds: Record<string, string>;
};

export function splitCommaList(value = ""): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function profileRole(role?: string): ParejaProfile["rol"] {
  if (role === "novio" || role === "novia" || role === "otro") return role;
  return "otro";
}

export function createWeddingProject(actions: WeddingProjectActions, input: WeddingProjectInput): CreatedWeddingProject {
  const coupleParts = input.coupleName.split("&").map((item) => item.trim()).filter(Boolean);
  const firstName = input.contactOne.name?.trim() || coupleParts[0] || "Persona 1";
  const secondName = input.contactTwo.name?.trim() || coupleParts[1] || "Persona 2";
  const preferences = splitCommaList(input.preferences);
  const dietaryNeeds = input.dietaryNeeds || "";
  const riskNotes = input.riskNotes || "";
  const estimatedBudget = Number(input.budget) || 0;

  const clientId = input.clientId || actions.addClient({
    coupleName: input.coupleName,
    contacts: [
      { name: firstName, role: input.contactOne.role || "novia", phone: input.contactOne.phone || "", email: input.contactOne.email || "" },
      { name: secondName, role: input.contactTwo.role || "novio", phone: input.contactTwo.phone || "", email: input.contactTwo.email || "" }
    ],
    preferences,
    notes: input.clientNotes || riskNotes || "Creado desde alta de boda",
    rgpdConsent: input.rgpdConsent ?? true
  });

  const eventId = actions.addEvent({
    clientId,
    name: input.eventName || `Boda de ${input.coupleName}`,
    date: input.date,
    location: input.location,
    region: input.region,
    guests: Number(input.guests) || 0,
    style: input.style,
    totalBudget: estimatedBudget,
    phase: "descubrimiento",
    risks: splitCommaList(riskNotes),
    dietaryNeeds: splitCommaList(dietaryNeeds),
    accommodationNeeds: input.accommodationNeeds || "",
    paymentStatus: "Pendiente primer pago"
  });

  const partnerOneNotes = [input.contactOne.preferences, dietaryNeeds ? `Alergias/dietas: ${dietaryNeeds}` : ""].filter(Boolean).join("\n");
  const partnerTwoNotes = [input.contactTwo.preferences, dietaryNeeds ? `Alergias/dietas: ${dietaryNeeds}` : ""].filter(Boolean).join("\n");

  actions.addParejaProfile({
    eventId,
    nombre: firstName,
    rol: profileRole(input.contactOne.role || "novia"),
    gustos: input.contactOne.preferences,
    alergias: dietaryNeeds,
    contacto: {
      telefono: input.contactOne.phone || "",
      email: input.contactOne.email || ""
    },
    notas: partnerOneNotes
  });

  actions.addParejaProfile({
    eventId,
    nombre: secondName,
    rol: profileRole(input.contactTwo.role || "novio"),
    gustos: input.contactTwo.preferences,
    alergias: dietaryNeeds,
    contacto: {
      telefono: input.contactTwo.phone || "",
      email: input.contactTwo.email || ""
    },
    notas: partnerTwoNotes
  });

  return {
    clientId,
    eventId,
    pageIds: {}
  };
}
