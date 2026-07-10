"use client";

import { ProfileForm } from "@/components/admin/profile-form";
import { useAdminLanguage } from "@/components/admin/admin-language-provider";
import type { Profile } from "@/lib/types";

export function ProfilePageContent({ profile }: { profile: Profile }) {
  const { t } = useAdminLanguage();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-extrabold text-foreground sm:text-3xl">{t.profile.title}</h1>
      <p className="mb-8 text-muted-foreground">{t.profile.subtitle}</p>
      <ProfileForm profile={profile} />
    </div>
  );
}
