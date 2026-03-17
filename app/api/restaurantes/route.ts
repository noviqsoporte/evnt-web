import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getAllRestaurantes,
  createRestaurante,
  updateRestaurante,
  deleteRestaurante,
} from '@/lib/airtable';

export const dynamic = 'force-dynamic';

function isAuthenticated() {
  const cookieStore = cookies();
  return cookieStore.get('admin_session')?.value === 'true';
}

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const restaurantes = await getAllRestaurantes();
  return NextResponse.json(restaurantes);
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const restaurante = await createRestaurante(data);
    if (!restaurante) {
      return NextResponse.json({ error: 'Error al crear' }, { status: 500 });
    }
    return NextResponse.json(restaurante);
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
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
    const restaurante = await updateRestaurante(id, data);
    if (!restaurante) {
      return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
    }
    return NextResponse.json(restaurante);
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }
    const success = await deleteRestaurante(id);
    if (!success) {
      return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
