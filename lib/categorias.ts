export interface CategoriaInfo {
  id: string;
  label: string;
  iconName: string;
  color: string;
}

export const categorias: CategoriaInfo[] = [
  { id: "localizacion", label: "Espacios / Fincas", iconName: "MapPin", color: "#263f38" },
  { id: "restauracion", label: "Catering / Restaurantes", iconName: "Utensils", color: "#9b6345" },
  { id: "decoracion", label: "Decoración general", iconName: "Palette", color: "#d9a47f" },
  { id: "floristeria", label: "Floristería", iconName: "Flower2", color: "#6b6258" },
  { id: "musica", label: "Música en directo", iconName: "Music", color: "#9b6345" },
  { id: "dj", label: "DJ / Sonido", iconName: "Store", color: "#263f38" },
  { id: "fotografia", label: "Fotografía", iconName: "Camera", color: "#d9a47f" },
  { id: "videografia", label: "Videografía", iconName: "Video", color: "#6b6258" },
  { id: "content-creator", label: "Content Creator / RRSS", iconName: "Instagram", color: "#9b6345" },
  { id: "peluqueria-maquillaje", label: "Peluquería y Maquillaje", iconName: "Sparkles", color: "#d9a47f" },
  { id: "transporte", label: "Transporte / Guaguas", iconName: "Truck", color: "#263f38" },
  { id: "papeleria", label: "Papelería / Invitaciones", iconName: "FileText", color: "#6b6258" },
  { id: "reposteria", label: "Repostería / Tartas", iconName: "Cake", color: "#d9a47f" },
  { id: "stands-photocall", label: "Stands / Photocall", iconName: "Gift", color: "#9b6345" },
  { id: "animacion", label: "Animación / Entretenimiento", iconName: "Users", color: "#263f38" },
  { id: "oficial-ceremonia", label: "Oficial de Ceremonia", iconName: "Heart", color: "#d9a47f" }
];
