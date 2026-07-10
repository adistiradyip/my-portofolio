"use client";

import { useEffect, useState, useTransition } from "react";
import { updateProfile } from "@/lib/actions";
import type { Profile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminLanguage } from "@/components/admin/admin-language-provider";
import { toast } from "sonner";

function toFormState(profile: Profile) {
  return {
    full_name: profile.full_name ?? "",
    headline: profile.headline ?? "",
    bio: profile.bio ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    location: profile.location ?? "",
    github_url: profile.github_url ?? "",
    linkedin_url: profile.linkedin_url ?? "",
    twitter_url: profile.twitter_url ?? "",
    cv_url: profile.cv_url ?? "",
    avatar_url: profile.avatar_url ?? "",
  };
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const { t } = useAdminLanguage();
  const [form, setForm] = useState(() => toFormState(profile));
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setForm(toFormState(profile));
  }, [profile]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateProfile(form);
      if (result.error) toast.error(result.error);
      else toast.success(t.toast.profileSaved);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name">{t.profile.fields.fullName}</Label>
          <Input
            id="full_name"
            value={form.full_name}
            onChange={(e) => updateField("full_name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="headline">{t.profile.fields.headline}</Label>
          <Input
            id="headline"
            value={form.headline}
            onChange={(e) => updateField("headline", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">{t.profile.fields.bio}</Label>
        <Textarea
          id="bio"
          value={form.bio}
          onChange={(e) => updateField("bio", e.target.value)}
          rows={4}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">{t.profile.fields.email}</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t.profile.fields.phone}</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">{t.profile.fields.location}</Label>
        <Input
          id="location"
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="github_url">{t.profile.fields.github}</Label>
          <Input
            id="github_url"
            value={form.github_url}
            onChange={(e) => updateField("github_url", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin_url">{t.profile.fields.linkedin}</Label>
          <Input
            id="linkedin_url"
            value={form.linkedin_url}
            onChange={(e) => updateField("linkedin_url", e.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="twitter_url">{t.profile.fields.twitter}</Label>
          <Input
            id="twitter_url"
            value={form.twitter_url}
            onChange={(e) => updateField("twitter_url", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cv_url">{t.profile.fields.cv}</Label>
          <Input
            id="cv_url"
            value={form.cv_url}
            onChange={(e) => updateField("cv_url", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="avatar_url">{t.profile.fields.avatar}</Label>
        <Input
          id="avatar_url"
          value={form.avatar_url}
          onChange={(e) => updateField("avatar_url", e.target.value)}
        />
      </div>
      <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90">
        {isPending ? t.common.saving : t.profile.save}
      </Button>
    </form>
  );
}
