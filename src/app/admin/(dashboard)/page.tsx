import { getAdminStats } from "@/lib/queries";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  return <AdminDashboard stats={stats} />;
}
