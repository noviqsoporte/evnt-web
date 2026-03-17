import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getEventos, updateEvento } from '@/lib/airtable';

export const dynamic = 'force-dynamic';

function isAuthenticated() {
  const cookieStore = cookies();
  return cookieStore.get('admin_session')?.value === 'true';
}

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const eventos = await getEventos();
  return NextResponse.json(eventos);
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { id, ...data } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }
    const evento = await updateEvento(id, data);
    if (!evento) {
      return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
    }
    return NextResponse.json(evento);
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
