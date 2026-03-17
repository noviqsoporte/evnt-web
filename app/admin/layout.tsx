export const metadata = {
  title: 'EVNT Admin',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh' }}>
      {children}
    </div>
  );
}
