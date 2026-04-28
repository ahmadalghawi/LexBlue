import AdminGuard from "@/components/auth/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-muted/20">
        <AdminSidebar />
        <main className="flex-grow p-8 pt-10">{children}</main>
      </div>
    </AdminGuard>
  );
}
