import { getProfile } from "@/lib/queries";
import { ProfilePageContent } from "@/components/admin/profile-page-content";

export default async function ProfilePage() {
  const profile = await getProfile();
  return <ProfilePageContent profile={profile} />;
}
