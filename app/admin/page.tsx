import { cookies } from 'next/headers';
import LoginForm from '@/components/admin/LoginForm';
import DashboardShell from '@/components/admin/DashboardShell';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const cookieStore = cookies();
  const session = cookieStore.get('admin_session');
  const isAuthenticated = session?.value === 'true';

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <DashboardShell />;
}
