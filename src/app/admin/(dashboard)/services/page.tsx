import { getAdminServices } from "@/lib/queries";
import { ServicesManager } from "@/components/admin/services-manager";

export default async function ServicesPage() {
  const services = await getAdminServices();
  return <ServicesManager services={services} />;
}
