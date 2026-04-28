export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface-container-high">
      {/* TODO: Add Admin Navigation Component Here */}
      <main className="flex-grow p-8">{children}</main>
    </div>
  );
}
