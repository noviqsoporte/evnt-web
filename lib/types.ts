export interface Restaurante {
  id: string;
  nombre: string;
  descripcion: string;
  foto_url: string;
  ciudad: string;
  tipo_cocina: string;
  capacidad_max: number;
  activo: boolean;
  orden: number;
}

export interface Configuracion {
  whatsapp: string;
  tiktok_url: string;
  instagram_url: string;
  tagline: string;
  email: string;
}

export interface Evento {
  id: string;
  nombre_empresa: string;
  contacto: string;
  telefono: string;
  personas: number;
  fecha_evento: string;
  presupuesto: string;
  estado: string;
  notas: string;
  fecha_entrada: string;
}
