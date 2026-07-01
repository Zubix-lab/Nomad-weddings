export interface ChecklistTemplateItem {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  mesesAntes: number;
  prioridad: "alta" | "media" | "baja";
}

export const checklistTemplate: ChecklistTemplateItem[] = [
  // 12-10 meses
  { id: "tmpl-001", titulo: "Definir presupuesto inicial", descripcion: "Establecer el rango máximo de gasto y la contribución de la pareja.", categoria: "12-10 meses", mesesAntes: 12, prioridad: "alta" },
  { id: "tmpl-002", titulo: "Elegir fecha de la boda", descripcion: "Definir fecha principal y alternativas.", categoria: "12-10 meses", mesesAntes: 12, prioridad: "alta" },
  { id: "tmpl-003", titulo: "Contratar wedding planner", descripcion: "Confirmar contrato con Nomad Weddings.", categoria: "12-10 meses", mesesAntes: 11, prioridad: "alta" },
  { id: "tmpl-004", titulo: "Buscar y reservar el espacio", descripcion: "Visitar fincas/bodegas y hacer el primer pago de reserva.", categoria: "12-10 meses", mesesAntes: 10, prioridad: "alta" },
  { id: "tmpl-005", titulo: "Definir estilo y concepto", descripcion: "Crear moodboard de inspiración (colores, ambientación).", categoria: "12-10 meses", mesesAntes: 10, prioridad: "media" },
  
  // 9-7 meses
  { id: "tmpl-006", titulo: "Contratar el catering", descripcion: "Confirmar catering si el espacio no lo incluye.", categoria: "9-7 meses", mesesAntes: 9, prioridad: "alta" },
  { id: "tmpl-007", titulo: "Contratar fotógrafo y videógrafo", descripcion: "Reservar profesionales de imagen con antelación.", categoria: "9-7 meses", mesesAntes: 8, prioridad: "alta" },
  { id: "tmpl-008", titulo: "Comenzar búsqueda de vestido/traje", descripcion: "Visitar tiendas de novia/novio.", categoria: "9-7 meses", mesesAntes: 8, prioridad: "media" },
  { id: "tmpl-009", titulo: "Contratar DJ y sonido", descripcion: "Reservar proveedor de música y equipos de sonido/iluminación.", categoria: "9-7 meses", mesesAntes: 7, prioridad: "alta" },
  { id: "tmpl-010", titulo: "Hacer lista inicial de invitados", descripcion: "Primer borrador con nombres y datos de contacto.", categoria: "9-7 meses", mesesAntes: 7, prioridad: "media" },
  
  // 6-4 meses
  { id: "tmpl-011", titulo: "Diseñar y enviar invitaciones", descripcion: "Elegir papelería y enviar invitaciones físicas o digitales.", categoria: "6-4 meses", mesesAntes: 6, prioridad: "alta" },
  { id: "tmpl-012", titulo: "Contratar decoración floral", descripcion: "Definir flores del altar, centros de mesa y ramos.", categoria: "6-4 meses", mesesAntes: 6, prioridad: "media" },
  { id: "tmpl-013", titulo: "Realizar menú degustación", descripcion: "Probar y elegir los platos finales del banquete.", categoria: "6-4 meses", mesesAntes: 5, prioridad: "alta" },
  { id: "tmpl-014", titulo: "Reservar viaje de novios", descripcion: "Planificar luna de miel y contratar vuelos/hoteles.", categoria: "6-4 meses", mesesAntes: 5, prioridad: "baja" },
  { id: "tmpl-015", titulo: "Reservar peluquería y maquillaje", descripcion: "Contratar estilistas y agendar fecha de prueba.", categoria: "6-4 meses", mesesAntes: 4, prioridad: "media" },
  { id: "tmpl-016", titulo: "Contratar transporte para invitados", descripcion: "Reservar autobuses o guaguas de ida y vuelta.", categoria: "6-4 meses", mesesAntes: 4, prioridad: "media" },
  
  // 3-2 meses
  { id: "tmpl-017", titulo: "Elegir alianzas", descripcion: "Comprar los anillos de boda y grabar inscripciones.", categoria: "3-2 meses", mesesAntes: 3, prioridad: "media" },
  { id: "tmpl-018", titulo: "Contratar stands / photocall", descripcion: "Reservar fotomatón, glitter bar u otras experiencias de invitado.", categoria: "3-2 meses", mesesAntes: 3, prioridad: "baja" },
  { id: "tmpl-019", titulo: "Prueba de peluquería y maquillaje", descripcion: "Realizar las pruebas de estilo con el vestido/traje.", categoria: "3-2 meses", mesesAntes: 3, prioridad: "media" },
  { id: "tmpl-020", titulo: "Preparar el guion de la ceremonia", descripcion: "Definir lecturas, música de entrada y votos.", categoria: "3-2 meses", mesesAntes: 2, prioridad: "alta" },
  { id: "tmpl-021", titulo: "Organizar distribución de mesas", descripcion: "Crear borrador del seating plan con invitados confirmados.", categoria: "3-2 meses", mesesAntes: 2, prioridad: "alta" },
  
  // 1 mes
  { id: "tmpl-022", titulo: "Confirmar lista final de invitados", descripcion: "Cerrar número de adultos, niños y menús especiales.", categoria: "1 mes", mesesAntes: 1, prioridad: "alta" },
  { id: "tmpl-023", titulo: "Enviar plano de mesas al catering", descripcion: "Detallar comensales por mesa y sus dietas/alergias.", categoria: "1 mes", mesesAntes: 1, prioridad: "alta" },
  { id: "tmpl-024", titulo: "Última prueba de vestido/traje", descripcion: "Ajustes finales de costura.", categoria: "1 mes", mesesAntes: 1, prioridad: "alta" },
  { id: "tmpl-025", titulo: "Cerrar playlist y momentos del DJ", descripcion: "Canciones para entrada, banquete, primer baile y fiesta.", categoria: "1 mes", mesesAntes: 1, prioridad: "media" },
  { id: "tmpl-026", titulo: "Comprar detalles para invitados", descripcion: "Adquirir regalos y kits de supervivencia.", categoria: "1 mes", mesesAntes: 1, prioridad: "baja" },
  
  // Semana de la boda
  { id: "tmpl-027", titulo: "Entregar materiales al espacio", descripcion: "Llevar minutas, seating plan, marcasitios y detalles.", categoria: "Semana de la boda", mesesAntes: 0, prioridad: "alta" },
  { id: "tmpl-028", titulo: "Realizar ensayo de ceremonia", descripcion: "Ensayo con padrinos, pajes y oficiante en el sitio.", categoria: "Semana de la boda", mesesAntes: 0, prioridad: "media" },
  { id: "tmpl-029", titulo: "Tratamientos de belleza / Manicura", descripcion: "Relajación y tratamientos finales.", categoria: "Semana de la boda", mesesAntes: 0, prioridad: "baja" },
  { id: "tmpl-030", titulo: "Repasar cronograma con proveedores", descripcion: "Enviar runbook final del día B a todos los proveedores.", categoria: "Semana de la boda", mesesAntes: 0, prioridad: "alta" },
  
  // Día B
  { id: "tmpl-031", titulo: "Supervisar montaje de flores y altar", descripcion: "Controlar que todo quede según el diseño acordado.", categoria: "Día B", mesesAntes: 0, prioridad: "alta" },
  { id: "tmpl-032", titulo: "Coordinar llegada de fotógrafo y vídeo", descripcion: "Asegurar que comienzan a capturar los preparativos a tiempo.", categoria: "Día B", mesesAntes: 0, prioridad: "media" },
  { id: "tmpl-033", titulo: "Recibir y entregar los ramos de novia", descripcion: "Comprobar frescura y entregarlos a la novia y damas.", categoria: "Día B", mesesAntes: 0, prioridad: "media" },
  { id: "tmpl-034", titulo: "Coordinar autobuses de invitados", descripcion: "Validar salidas y llegadas a los puntos establecidos.", categoria: "Día B", mesesAntes: 0, prioridad: "alta" },
  { id: "tmpl-035", titulo: "Dar señal de inicio de ceremonia", descripcion: "Coordinar entradas de novios, música y cortejo.", categoria: "Día B", mesesAntes: 0, prioridad: "alta" }
];
