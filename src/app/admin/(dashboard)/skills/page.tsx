import { getAdminSkills } from "@/lib/queries";
import { SkillsManager } from "@/components/admin/skills-manager";

export default async function SkillsPage() {
  const skills = await getAdminSkills();
  return <SkillsManager skills={skills} />;
}
