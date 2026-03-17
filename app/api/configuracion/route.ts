import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getConfiguracion, updateConfiguracion } from '@/lib/airtable';

export const dynamic = 'force-dynamic';

function isAuthenticated() {
  const cookieStore = cookies();
  return cookieStore.get('admin_session')?.value === 'true';
}

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const config = await getConfiguracion();
  return NextResponse.json(config);
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const config = await updateConfiguracion(data);
    if (!config) {
      return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
    }
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
