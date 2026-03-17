import Airtable, { FieldSet } from 'airtable';
import { Configuracion, Restaurante, Evento } from './types';

// Initialize Airtable base
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID || 'app_placeholder'
);

const configuracionTable = base(process.env.AIRTABLE_TABLE_CONFIGURACION || 'tbl_placeholder');
const restaurantesTable = base(process.env.AIRTABLE_TABLE_RESTAURANTES || 'tbl_placeholder');
const eventosTable = base(process.env.AIRTABLE_TABLE_EVENTOS || 'tbl_placeholder');

export async function getConfiguracion(): Promise<Configuracion | null> {
  if (!process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_API_KEY === 'pat_placeholder') {
    // Return dummy data if not configured
    return {
      whatsapp: '1234567890',
      tiktok_url: 'https://tiktok.com',
      instagram_url: 'https://instagram.com',
      tagline: 'Tu próximo evento de equipo, resuelto.',
      email: 'hola@evnt.com',
    };
  }

  try {
    const records = await configuracionTable.select({
      maxRecords: 1
    }).firstPage();

    if (records.length === 0) return null;

    const record = records[0];
    console.log('Config raw de Airtable:', JSON.stringify(record.fields, null, 2));

    return {
      whatsapp: (record.get('WhatsApp') as string) || '',
      tiktok_url: (record.get('TikTok_URL') as string) || '',
      instagram_url: (record.get('Instagram_URL') as string) || '',
      tagline: (record.get('Tagline') as string) || '',
      email: (record.get('Email') as string) || '',
    };
  } catch (error) {
    console.error('Error fetching Configuracion:', error);
    return null;
  }
}

export async function getRestaurantes(): Promise<Restaurante[]> {
  if (!process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_API_KEY === 'pat_placeholder') {
    return [];
  }

  try {
    const records = await restaurantesTable.select({
      filterByFormula: '{Activo}',
      sort: [{ field: 'Orden', direction: 'asc' }]
    }).all();

    console.log('Restaurantes raw de Airtable:', JSON.stringify(records.map(r => r.fields), null, 2));

    return records.map(record => ({
      id: record.id,
      nombre: (record.get('Nombre') as string) || '',
      descripcion: (record.get('Descripcion') as string) || '',
      foto_url: Array.isArray(record.get('Foto_URL'))
        ? ((record.get('Foto_URL') as unknown) as { url: string }[])[0]?.url || ''
        : (record.get('Foto_URL') as string) || '',
      ciudad: (record.get('Ciudad') as string) || '',
      tipo_cocina: (record.get('Tipo_Cocina') as string) || '',
      capacidad_max: (record.get('Capacidad_Max') as number) || 0,
      activo: !!record.get('Activo'),
      orden: (record.get('Orden') as number) || 0,
    }));
  } catch (error) {
    console.error('Error fetching Restaurantes:', error);
    return [];
  }
}

// ── Admin CRUD functions ──

export async function getAllRestaurantes(): Promise<Restaurante[]> {
  try {
    const records = await restaurantesTable.select({
      sort: [{ field: 'Orden', direction: 'asc' }],
    }).all();

    return records.map(record => ({
      id: record.id,
      nombre: (record.get('Nombre') as string) || '',
      descripcion: (record.get('Descripcion') as string) || '',
      foto_url: Array.isArray(record.get('Foto_URL'))
        ? ((record.get('Foto_URL') as unknown) as { url: string }[])[0]?.url || ''
        : (record.get('Foto_URL') as string) || '',
      ciudad: (record.get('Ciudad') as string) || '',
      tipo_cocina: (record.get('Tipo_Cocina') as string) || '',
      capacidad_max: (record.get('Capacidad_Max') as number) || 0,
      activo: !!record.get('Activo'),
      orden: (record.get('Orden') as number) || 0,
    }));
  } catch (error) {
    console.error('Error fetching all Restaurantes:', error);
    return [];
  }
}

export async function createRestaurante(data: Partial<Restaurante>): Promise<Restaurante | null> {
  try {
    const record = await restaurantesTable.create({
      Nombre: data.nombre || '',
      Descripcion: data.descripcion || '',
      Foto_URL: data.foto_url || '',
      Ciudad: data.ciudad || '',
      Tipo_Cocina: data.tipo_cocina || '',
      Capacidad_Max: data.capacidad_max || 0,
      Activo: data.activo ?? true,
      Orden: data.orden || 0,
    });

    return {
      id: record.id,
      nombre: (record.get('Nombre') as string) || '',
      descripcion: (record.get('Descripcion') as string) || '',
      foto_url: (record.get('Foto_URL') as string) || '',
      ciudad: (record.get('Ciudad') as string) || '',
      tipo_cocina: (record.get('Tipo_Cocina') as string) || '',
      capacidad_max: (record.get('Capacidad_Max') as number) || 0,
      activo: !!record.get('Activo'),
      orden: (record.get('Orden') as number) || 0,
    };
  } catch (error) {
    console.error('Error creating Restaurante:', error);
    return null;
  }
}

export async function updateRestaurante(
  id: string,
  data: Partial<Restaurante>
): Promise<Restaurante | null> {
  try {
    const fields: Partial<FieldSet> = {};
    if (data.nombre !== undefined) fields.Nombre = data.nombre;
    if (data.descripcion !== undefined) fields.Descripcion = data.descripcion;
    if (data.foto_url !== undefined) fields.Foto_URL = data.foto_url;
    if (data.ciudad !== undefined) fields.Ciudad = data.ciudad;
    if (data.tipo_cocina !== undefined) fields.Tipo_Cocina = data.tipo_cocina;
    if (data.capacidad_max !== undefined) fields.Capacidad_Max = data.capacidad_max;
    if (data.activo !== undefined) fields.Activo = data.activo;
    if (data.orden !== undefined) fields.Orden = data.orden;

    const record = await restaurantesTable.update(id, fields);

    return {
      id: record.id,
      nombre: (record.get('Nombre') as string) || '',
      descripcion: (record.get('Descripcion') as string) || '',
      foto_url: (record.get('Foto_URL') as string) || '',
      ciudad: (record.get('Ciudad') as string) || '',
      tipo_cocina: (record.get('Tipo_Cocina') as string) || '',
      capacidad_max: (record.get('Capacidad_Max') as number) || 0,
      activo: !!record.get('Activo'),
      orden: (record.get('Orden') as number) || 0,
    };
  } catch (error) {
    console.error('Error updating Restaurante:', error);
    return null;
  }
}

export async function deleteRestaurante(id: string): Promise<boolean> {
  try {
    await restaurantesTable.destroy(id);
    return true;
  } catch (error) {
    console.error('Error deleting Restaurante:', error);
    return false;
  }
}

export async function updateConfiguracion(
  data: Partial<Configuracion>
): Promise<Configuracion | null> {
  try {
    const records = await configuracionTable.select({ maxRecords: 1 }).firstPage();
    if (records.length === 0) return null;

    const recordId = records[0].id;
    const fields: Partial<FieldSet> = {};
    if (data.whatsapp !== undefined) fields.WhatsApp = data.whatsapp;
    if (data.tiktok_url !== undefined) fields.TikTok_URL = data.tiktok_url;
    if (data.instagram_url !== undefined) fields.Instagram_URL = data.instagram_url;
    if (data.tagline !== undefined) fields.Tagline = data.tagline;
    if (data.email !== undefined) fields.Email = data.email;

    const record = await configuracionTable.update(recordId, fields);

    return {
      whatsapp: (record.get('WhatsApp') as string) || '',
      tiktok_url: (record.get('TikTok_URL') as string) || '',
      instagram_url: (record.get('Instagram_URL') as string) || '',
      tagline: (record.get('Tagline') as string) || '',
      email: (record.get('Email') as string) || '',
    };
  } catch (error) {
    console.error('Error updating Configuracion:', error);
    return null;
  }
}

export async function getEventos(): Promise<Evento[]> {
  try {
    const records = await eventosTable.select({
      sort: [{ field: 'Fecha_Entrada', direction: 'desc' }],
    }).all();

    return records.map(record => ({
      id: record.id,
      nombre_empresa: (record.get('Nombre_Empresa') as string) || '',
      contacto: (record.get('Contacto') as string) || '',
      telefono: (record.get('Telefono') as string) || '',
      personas: (record.get('Personas') as number) || 0,
      fecha_evento: (record.get('Fecha_Evento') as string) || '',
      presupuesto: (record.get('Presupuesto') as string) || '',
      estado: (record.get('Estado') as string) || '',
      notas: (record.get('Notas') as string) || '',
      fecha_entrada: (record.get('Fecha_Entrada') as string) || '',
    }));
  } catch (error) {
    console.error('Error fetching Eventos:', error);
    return [];
  }
}

export async function updateEvento(
  id: string,
  data: Partial<Evento>
): Promise<Evento | null> {
  try {
    const fields: Partial<FieldSet> = {};
    if (data.estado !== undefined) fields.Estado = data.estado;
    if (data.notas !== undefined) fields.Notas = data.notas;

    const record = await eventosTable.update(id, fields);

    return {
      id: record.id,
      nombre_empresa: (record.get('Nombre_Empresa') as string) || '',
      contacto: (record.get('Contacto') as string) || '',
      telefono: (record.get('Telefono') as string) || '',
      personas: (record.get('Personas') as number) || 0,
      fecha_evento: (record.get('Fecha_Evento') as string) || '',
      presupuesto: (record.get('Presupuesto') as string) || '',
      estado: (record.get('Estado') as string) || '',
      notas: (record.get('Notas') as string) || '',
      fecha_entrada: (record.get('Fecha_Entrada') as string) || '',
    };
  } catch (error) {
    console.error('Error updating Evento:', error);
    return null;
  }
}
