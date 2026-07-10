import { getAdminProjects } from "@/lib/queries";
import { ProjectsManager } from "@/components/admin/projects-manager";

export default async function ProjectsPage() {
  const projects = await getAdminProjects();
  return <ProjectsManager projects={projects} />;
}
