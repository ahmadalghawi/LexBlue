export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* TODO: Add Protected Sidebar/Navigation Component Here */}
      <main className="flex-grow">{children}</main>
    </div>
  );
}
