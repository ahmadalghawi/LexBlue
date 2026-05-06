import AuthGuard from "@/components/auth/AuthGuard";
import { Navbar } from "@/components/layout/Navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 px-4 py-6">{children}</main>
      </div>
    </AuthGuard>
  );
}

