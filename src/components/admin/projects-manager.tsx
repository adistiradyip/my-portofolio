"use client";

import { useMemo, useState, useTransition } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { saveProject, deleteProject } from "@/lib/actions";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { useAdminLanguage } from "@/components/admin/admin-language-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const emptyProject: Partial<Project> = {
  title: "",
  description: "",
  content: "",
  image_url: "",
  tech_stack: [],
  live_url: "",
  github_url: "",
  featured: false,
  sort_order: 0,
  status: "draft",
};

export function ProjectsManager({ projects }: { projects: Project[] }) {
  const { t } = useAdminLanguage();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Project>>(emptyProject);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openCreate() {
    setEditing(emptyProject);
    setOpen(true);
  }

  function openEdit(project: Project) {
    setEditing(project);
    setOpen(true);
  }

  function handleSubmit(formData: FormData) {
    const techStack = (formData.get("tech_stack") as string)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    startTransition(async () => {
      const result = await saveProject({
        id: editing.id,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        content: formData.get("content") as string,
        image_url: formData.get("image_url") as string,
        live_url: formData.get("live_url") as string,
        github_url: formData.get("github_url") as string,
        tech_stack: techStack,
        featured: formData.get("featured") === "on",
        sort_order: Number(formData.get("sort_order") || 0),
        status: formData.get("status") as "draft" | "published",
      });
      if (result.error) toast.error(result.error);
      else {
        toast.success(t.toast.projectSaved);
        setOpen(false);
      }
    });
  }

  function confirmDelete() {
    if (!deleteId) return;
    startTransition(async () => {
      const result = await deleteProject(deleteId);
      if (result.error) toast.error(result.error);
      else {
        toast.success(t.toast.projectDeleted);
        setDeleteId(null);
      }
    });
  }

  const columns = useMemo<ColumnDef<Project>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t.projects.titleCol} />
        ),
        cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t.projects.status} />
        ),
        cell: ({ row }) => (
          <Badge variant={row.original.status === "published" ? "default" : "secondary"}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "featured",
        header: t.projects.featured,
        cell: ({ row }) => (row.original.featured ? t.common.yes : t.common.no),
      },
      {
        id: "actions",
        header: () => <div className="text-right">{t.common.actions}</div>,
        cell: ({ row }) => (
          <div className="text-right">
            <Button variant="ghost" size="icon-sm" onClick={() => openEdit(row.original)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(row.original.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    [t],
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{t.projects.title}</h1>
          <p className="text-muted-foreground">{t.projects.subtitle}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button onClick={openCreate} className="w-full bg-primary hover:bg-primary/90 sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                {t.projects.add}
              </Button>
            }
          />
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing.id ? t.projects.edit : t.projects.add}</DialogTitle>
            </DialogHeader>
            <form key={editing.id ?? "new"} action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{t.projects.fields.title}</Label>
                <Input name="title" defaultValue={editing.title ?? ""} required />
              </div>
              <div className="space-y-2">
                <Label>{t.projects.fields.description}</Label>
                <Textarea name="description" defaultValue={editing.description ?? ""} />
              </div>
              <div className="space-y-2">
                <Label>{t.projects.fields.content}</Label>
                <Textarea name="content" defaultValue={editing.content ?? ""} rows={4} />
              </div>
              <div className="space-y-2">
                <Label>{t.projects.fields.techStack}</Label>
                <Input name="tech_stack" defaultValue={editing.tech_stack?.join(", ") ?? ""} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t.projects.fields.liveUrl}</Label>
                  <Input name="live_url" defaultValue={editing.live_url ?? ""} />
                </div>
                <div className="space-y-2">
                  <Label>{t.projects.fields.githubUrl}</Label>
                  <Input name="github_url" defaultValue={editing.github_url ?? ""} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t.projects.fields.imageUrl}</Label>
                <Input name="image_url" defaultValue={editing.image_url ?? ""} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t.projects.fields.sortOrder}</Label>
                  <Input name="sort_order" type="number" defaultValue={editing.sort_order ?? 0} />
                </div>
                <div className="space-y-2">
                  <Label>{t.projects.fields.status}</Label>
                  <select
                    name="status"
                    defaultValue={editing.status ?? "draft"}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="draft">{t.projects.fields.draft}</option>
                    <option value="published">{t.projects.fields.published}</option>
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="featured" defaultChecked={editing.featured} />
                {t.projects.fields.featured}
              </label>
              <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90">
                {isPending ? t.common.saving : t.common.save}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={projects}
        searchKey="title"
        searchPlaceholder={t.projects.search}
        emptyMessage={t.projects.empty}
      />

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        description={t.delete.project}
        onConfirm={confirmDelete}
        isPending={isPending}
      />
    </div>
  );
}
