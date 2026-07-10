import { getAdminExperiences } from "@/lib/queries";
import { ExperiencesManager } from "@/components/admin/experiences-manager";

export default async function ExperiencesPage() {
  const experiences = await getAdminExperiences();
  return <ExperiencesManager experiences={experiences} />;
}
